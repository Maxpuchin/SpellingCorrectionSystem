import { BrowserRouter, Link } from "react-router-dom";
import React, { useEffect } from "react";
import { AppBar, Toolbar, Typography } from '@mui/material';
import Router from "./Routes";


function App() {
  return (
    
    <BrowserRouter>
       <AppBar position="static" style={{ background: '#FFFF', height: "64px", boxShadow: "0px 8px 32px -4px rgba(50, 50, 50, 0.1)"  }}>
          <Toolbar>
            <div style={{flexGrow: 1, textAlign: "left"}}>
            </div>
            <Typography variant="h6" style={{color: "#222222", flexGrow: 1, textAlign: "center"}}>      
              Система автоматического исправления опечаток
            </Typography>
            <div style={{flexGrow: 1, textAlign: "right"}}>
            </div>
          </Toolbar>
        </AppBar>
        <Router/>
    </BrowserRouter>

  );
}

export default App;
