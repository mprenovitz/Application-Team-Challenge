import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListView from "./components/listView.tsx";
// import CountView from "./components/countView.tsx";
import FocusView from "./components/focuseView.tsx";
import { AppBar } from "@mui/material";
import NavbarSvg from './assets/Navbar.svg';
import { useNavigate } from 'react-router-dom';

function Appbar(){
    //Intus navbar that persists regardless of the page, can click on the icon to return to the main page (listview for our purposes)
    const navigate = useNavigate();
    return (
            <AppBar
                position="static"
                sx={{
                    width: '1439px',
                    height: '109px',
                    position: 'absolute',
                    left: '1px',
                    backgroundImage: `url(${NavbarSvg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer'
                }}
                onClick={() => navigate('/')}>
            </AppBar>
    );
}
function App() {
    return (
        <BrowserRouter>
            <Appbar />
            <Routes>
                {/* Two paths list view (/) and focusview */}
                <Route path="/" element={<ListView />} />
                <Route path="/focusview/:ppt" element={<FocusView />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;