import { BrowserRouter } from "react-router-dom";
import React, { useEffect } from "react";
import { AppBar, Toolbar, Alert, Snackbar, Typography, Link } from '@mui/material';
import Router from "./Routes";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center" marginBottom="48px">
      <Link color="inherit">
        Система автоматического исправления опечаток
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


function App() {
  const [status, setStatus] = React.useState("not show");
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setStatus("not show");
  };

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
        <Router setStatus={setStatus}/>
        <Copyright />
        
        <Snackbar open={status !== "not show"} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
            {status}
          </Alert>
        </Snackbar>
    </BrowserRouter>

  );
}

export default App;
