const express = require("express");
const { getParticipants, countICD, sortICD, focusView } = require("./data");
const cors = require('cors');
const app = express();
app.use(cors());

//Basic route provided -- not used
app.get("/participants", async (_, res) => {
  try {
    const participants = await getParticipants();
    if (!participants) {
      res.status(400).json({ error: `Error: unable to get participants` });
    }
    res.json(participants.participants)
  }catch(e){
    console.error(e)
  }
});
let icdCounts, icdCodes, sorted_counts; //to reduce the number of get requests, save icd operations after inital count
app.get("/participants/icdcounts", async (_, res) => {
  try {
    const counted_codes = await countICD(); // count icd codes based on generated participants
    if (!counted_codes) {
      res.status(400).json({ error: `Error: unable to get counted codes` });
    }
    icdCounts = counted_codes.icdCounts
    icdCodes = counted_codes.icdCodes;
    sorted_counts = sortICD(icdCounts); //perform the different count operations
    res.json(icdCounts)
  }catch(e){
    console.error(e)
  }
});
//Send the sorted counts based on how they should be sorted
app.get("/participants/icdcounts/sort_asc", (_, res) => {
  res.json(sorted_counts.asc); //count ascending
});
app.get("/participants/icdcounts/sort_desc", (_, res) => {
  res.json(sorted_counts.desc);//count descending
});
app.get("/participants/icdcounts/sort_alphDesc", (_, res) => {
  res.json(sorted_counts.alph_desc); //Alphabetical (A-Z)
});
app.get("/participants/icdcounts/sort_alphAsc", (_, res) => {
  res.json(sorted_counts.alph_asc); //Alphabetical (Z-A)
});
//Focus view on a specific participant
app.get("/participants/icdcounts/focusview/:ppt", async (req, res) => {
  try{
    const ppt_name = req.params.ppt //Participant received through url
    if (!ppt_name){
      res.status(400).json({ error: `Error: Bad Request with ppt ${ppt_name}` });
    }
    const ppt_focus = await focusView(icdCodes[ppt_name]); //get the names for the icd codes of the participent 
    await res.json(ppt_focus)
  }catch (e){
    console.error("Error fetching focused view of patients")
  }
})

module.exports = { app };
