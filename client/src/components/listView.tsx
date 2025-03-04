import React, { useState, useEffect, } from 'react';
import { Paper, Box, MenuItem, Select, SelectChangeEvent, TextField, InputAdornment, Typography, IconButton, Card } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { text, card } from "../style.tsx"

export default function ListView() {
  const [participantICD, setParticipantICD] = useState(new Map());
  const [sortType, setSortType] = useState(() => sessionStorage.getItem("sortType") || "def"); //use session storage to make sure sort type history is saves
  const [searchVal, setsSarchVal] = useState("");
  const BASE_URL = 'http://localhost:5001/participants/icdcounts'



  useEffect(() => {
    //retrieve the participants nd their counts form the server
    async function getParticipants() {
      //def is unsorted default upon load
      if (sortType == "def") {
        const res = await fetch(BASE_URL)
        if (!res) {
          console.error("ERROR: Unable to fetch data from server.")
        }
        const res_json = await res.json();
        setParticipantICD(res_json)
      } else if (sortType == "desc") { //get desc counts
        const res = await fetch(BASE_URL + '/sort_desc')
        if (!res) {
          console.error("ERROR: Unable to fetch data from server.")
        }
        const res_json = await res.json();
        setParticipantICD(res_json)
      } else if (sortType == "asc") { //get asc counts
        const res = await fetch(BASE_URL + '/sort_asc')
        if (!res) {
          console.error("ERROR: Unable to fetch data from server.")
        }
        const res_json = await res.json();
        setParticipantICD(res_json)
      } else if (sortType == "alph_asc") { //get A-Z sort
        const res = await fetch(BASE_URL + '/sort_alphAsc')
        if (!res) {
          console.error("ERROR: Unable to fetch data from server.")
        }
        const res_json = await res.json();
        setParticipantICD(res_json)
      }
      else if (sortType == "alph_Desc") { //get Z-A sort
        const res = await fetch(BASE_URL + '/sort_alphDesc')
        if (!res) {
          console.error("ERROR: Unable to fetch data from server.")
        }
        const res_json = await res.json();
        setParticipantICD(res_json)
      }
    }
    getParticipants();
  }, [sortType]) // switch when sortType changes

  const navigate = useNavigate();
  const handleClick = (ppt) => { //handles navigation to focusview from list
    navigate(`/focusview/${ppt}`);
  };
  const handleChange = (event: SelectChangeEvent) => { //handles the change in sortType for from dropdown
    setSortType(event.target.value as string);
    sessionStorage.setItem("sortType", event.target.value as string)
  };

  const handleSearch = (event) => { //handles the particpant name search
    setsSarchVal(event.target.value as string);
  };


  return (
    <div>
      <Box sx={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '130px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Typography variant="h2" sx={{
          fontFamily: "Mulish",
          fontWeight: 700,
          fontSize: "28px",
          color: "#0E2C78",
          marginBottom: "24px"
        }}>
          Participants
        </Typography>
        {/* text field for entering search term */}
        <TextField
        label="Search Participants"
        variant="outlined"
        value={searchVal}
        onChange={handleSearch}
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'  }}>
          
      </TextField>
      </Box>
      <Card
        component={Paper}
        variant="outlined"
        sx={{
          borderRadius: "10px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          marginBottom: "20px",
          px: 3
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px', marginBottom: '12px' }}>
          <Typography sx={{ text, fontSize: "20px", color: '#97999B' }}>
            Participants
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: 1, pr: 15 }}>
            <Typography sx={{ text, color: '#97999B' }}>
              ICD Codes
            </Typography>
            {/* Drop down for selecting sort type */}
            <IconButton size="small" sx={{ marginLeft: '8px' }}>
              <Select
                labelId="sort-select-label"
                id="sort-select"
                value={sortType || "def"}
                label="sort_type"
                onChange={handleChange}
                size='small'>
                <MenuItem value={"def"}>Default</MenuItem>
                <MenuItem value={"asc"}>Count Ascending</MenuItem>
                <MenuItem value={"desc"}>Count Descending</MenuItem>
                <MenuItem value={"alph_asc"}>Alphabetical (A-Z)</MenuItem>
                <MenuItem value={"alph_Desc"}>Alphabetical (Z-A)</MenuItem>
              </Select>
            </IconButton>
          </Box>
        </Box>
        <Box>
          {/* Iterate throguht the particpant -- icd count pairs, filtered by searchVal if applicable */}
          {Array.from(Object.entries(participantICD))
          .filter(([participant]) => participant.toLowerCase().includes(searchVal.toLowerCase()))
          .map(([participant, icdcount]) => (
            <Card key={participant}
              sx={card}
              // if you click on a participant takes you to focus view
              onClick={() => handleClick(participant)} style={{ cursor: "pointer" }}> 
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ text, fontSize: "18px", color: "#626275" }}>
                  {participant.replace("_", " ")}
                </Typography>
                <Typography sx={{ text, fontSize: "18px", color: "#626275", display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: 1, pr: 27 }}>
                  {icdcount}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>
      </Card>
    </Box>
    </div >
  )
};