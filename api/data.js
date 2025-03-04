const faker = require("faker");
const { ICD_CODE } = require("./constants/icdCode");
const BASE_URL = " https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=";
const parentStorage = require('node-persist');
const timeout =  5* 60 * 1000;

//two caches, one for participants so make makeParticpants isnt run every time changing the participants 
// and one for icd codes to reduce requests to clinicaltables
const patientStorage = parentStorage.create({dir: './cache/patients'})
const storage = parentStorage.create({dir: './cache/icdCode'});

//sync caches
storage.initSync({});
patientStorage.initSync({})


function makeDiagnosis(numDiagnoses) {
  const result = [];
  for (let i = 0; i < numDiagnoses; i++) {
    result.push({
      icdCode: faker.random.arrayElement(ICD_CODE),
      timestamp: faker.date.recent(365),
    });
  }
  return result.sort((a, b) => new Date(a.timestamp - b.timestamp));
}

function makeParticipants(numParticipants) {
  const result = [];

  for (let i = 0; i < numParticipants; i++) {
    result.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      dateOfBirth: faker.date.past(10, new Date(1950, 0, 1)),
      gender: faker.random.arrayElement(["MALE", "FEMALE", "NON-BINARY"]),
      phoneNumber: faker.datatype.number({ min: 1000000000, max: 9999999999 }),
      patientNotes: faker.random.arrayElement([faker.lorem.text(), null]),
      diagnoses: makeDiagnosis(10),
    });
  }

  return result;
}
//checks to ensure icd codes are in the correct ICD-10 format
function wellformedCode(code){
  const regex = /^[A-Za-z]\d{2,3}(\.\d{0,3})?$/; //regex to check the code itself
  if (code.length >= 3 && code.length <= 7 && regex.test(code)){
    return true;
  }
  return false;
}
//Getter for particpants, if participants have been loaded, access them from the cache
async function getParticipants(){
  let ppt = await patientStorage.getItem('ppt');
  if (!ppt) { //if there are not already patients in the cache generate patients
    ppt = makeParticipants(200);
    await patientStorage.setItem('ppt', ppt); //add new ppt to the cache
  }
  return ppt
}
//Counts the unique icd codes for each patient
async function countICD(){
  const icdCounts = {};
  const icdCodes = {};
  const participants = await getParticipants(); // get the particpants
  if (!participants){
    console.error('ERROR: participants not found')
    return 
  }
  participants.forEach ((participant) =>{// for each participant access count the codes
    const seen_codes = [];
    participant.diagnoses.forEach((dg) =>{
      const code = dg.icdCode
      if (!wellformedCode(code)){ // make sure the code is wellformed
        console.error(`WARNING: ${code} is not in ICD-10 format.`)
      }
      else if (!seen_codes.includes(code)) { //if the cude is unique push it to seen_codes
        seen_codes.push(code);
      } 
    })
    //add the counts and unique codes for each participant
    icdCounts[participant.firstName + "_" + participant.lastName] = seen_codes.length
    icdCodes[participant.firstName + "_" + participant.lastName] = seen_codes
  });
  return {icdCounts, icdCodes}
}

//sort the icds in different orders (by count or alphabetical)
function sortICD(icdCounts){
  const ret = {};

    ret["alph_desc"] = Object.entries(icdCounts)
      .sort (([a,], [b,]) => b.localeCompare(a)) //sort using local compare for chars, then reduce back into dict
      .reduce((dict, [key, val]) =>{
        dict[key] = val;
        return dict;
      }, {});
    ret["alph_asc"]= Object.entries(icdCounts)
      .sort (([a,], [b,]) => a.localeCompare(b)) //sort using local compare for chars, then reduce back into dict
      .reduce((dict, [key, val]) =>{
        dict[key] = val;
        return dict;
      }, {});
    ret["asc"] = Object.keys(icdCounts)
      .sort ((a, b) => icdCounts[a] - icdCounts[b]) //sort by count, then reduce back into dict
      .reduce((dict, key) =>{
        dict[key] = icdCounts[key];
        return dict;
      }, {});
  ret["desc"] = Object.keys(icdCounts)
      .sort ((a, b) => icdCounts[b] - icdCounts[a]) //sort by count, then reduce back into dict
      .reduce((dict, key) =>{
        dict[key] = icdCounts[key];
        return dict;
      }, {});
    return ret;
  }
  //uses clinical tables api to get names/diagnoses associated with ICD-10 codes
  async function focusView(diagnoses){
    const ret = {};
    for(const code of Array.from(diagnoses)){ //for each code passed in, either retrieve from the cache or call the api
      const key = `cache_for_${code}`;
      const cache = await storage.getItem(key);
      if (cache && Date.now() - cache.timestamp < timeout){ //if still valid in the cache, retrieve
        console.log(`Cache hit for ${key}`);
        ret[code] = cache.name;
      } else { //if expired retrieve from the API
        try {
          storage.clear()
          const res = await fetch(BASE_URL + code);
          if (res.status != 200){
            console.error("Could not fetch from Clinical Tables, verify connection to API")
          }
          const data = await res.json()
          await storage.setItem(key, {name: data.name, timestamp: Date.now()})
          ret[code] = data[3]; //[3] of the return is the pairs of code-->names
        } catch (error) {
          console.error("Error fetching names from Clinical Tables:", error.message);
          throw error;
        }
      }
    };
  return ret
}

module.exports = { getParticipants, countICD, sortICD, focusView};
