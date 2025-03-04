
import React, { useState, useEffect, } from 'react';
import { Button, Paper, Select, MenuItem, FormControl, SelectChangeEvent, Box, AppBar, Card, Typography } from "@mui/material";
import { useParams } from 'react-router-dom';
import { text, rectangle, backButton } from '../style.tsx'
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function FocusView() {
    const { ppt } = useParams();
    const [nameCodes, setNameCodes] = useState(new Map());
    const [selectedDiagnoses, setSelectedDiagnoses] = useState(new Map());
    const navigate = useNavigate();
    const BASE_URL = 'http://localhost:5001/participants/icdcounts'

    useEffect(() => { // any time a new participant is selected, get the focus view of their icd codes
        async function focusParticipant() {
            const res = await fetch(BASE_URL + `/focusview/${ppt}`)
            if(!res) {
                console.error("ERROR: unable to fetch data from server")
            }
            const res_json = await res.json();
            setNameCodes(res_json)
        }
        if (ppt) {
            focusParticipant();
        }
    }, [ppt]) // activate upon participant
    const handleChange = (event: SelectChangeEvent, icdcode: string) => { //if a particpant has a code with multiple matches, show all matches in dropdown
        setSelectedDiagnoses(prev => ({
            ...prev,
            [icdcode]: event.target.value as string
        })); 
    };
    return (
        <div>
            <Box sx={{ maxWidth: '800px', margin: '0 auto', paddingTop: '130px', position: 'relative' }}>
                {/* Back button to return to previous page  */}
                    <Button sx={{...backButton, position: 'relative', top: "55px", left: "-250px"}} onClick={() => navigate(-1)}>
                        <ArrowBackIosIcon sx={{ fontSize: "20px", color: "#F7F7FC" }} />
                        <Typography sx={{text, color: "#F7F7FC", fontSize: "20px"}}> Back </Typography>
                    </Button>     
                <Card
                    component={Paper}
                    variant="outlined"
                    sx={{
                        borderRadius: "10px",
                        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                        padding: "20px",
                        marginBottom: "20px",
                        px: 3
                    }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderBottom: '1px solid #E5E7EB', marginBottom: '12px' }}>
                        <Typography sx={{ text, fontSize: "20px", color: '#97999B', marginBottom: '12px' }}>
                            {ppt?.replace('_', ' ')}
                        </Typography>
                    </Box>
                    {/* state the number of codes */}
                    <Typography sx={{ text, color: '#97999B', marginBottom: '16px' }}>
                        ICD Codes ({Object.keys(nameCodes).length})
                    </Typography>
                    <Box>
                        {/* iterate through icd codes and their respective names */}
                        {Array.from(Object.entries(nameCodes)).map(([icdCodes, icdNames]) => (
                            <Card key={icdCodes} sx={rectangle}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ text, fontSize: "18px", color: "#626275" }}>
                                        {/* show the dropdown if there are multiple names */}
                                        {icdNames.length > 1 ? (
                                            <FormControl size="small" fullWidth>
                                                <Select
                                                    value={selectedDiagnoses[icdCodes] || ""}
                                                    onChange={(event) => handleChange(event, icdCodes)}
                                                    displayEmpty
                                                    variant="outlined">
                                                    <MenuItem value="" disabled>Multiple {icdCodes} diagnoses</MenuItem>
                                                    {icdNames.map(([code, description]) => (
                                                        <MenuItem key={code} value={code}>
                                                            {description + `(${code})`}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            // if there are no names, state that
                                        ) : icdNames.length === 0 ? (
                                            `No diagnoses or name for ${icdCodes}`
                                        ) : icdNames[0][1]}
                                    </Typography>
                                    <Typography sx={{ text, fontSize: "18px", color: "#626275", pr: 5 }}>
                                        {icdCodes}
                                    </Typography>

                                </Box>
                            </Card>
                        ))}
                    </Box>
                </Card>
            </Box>
        </div>
    )
}
