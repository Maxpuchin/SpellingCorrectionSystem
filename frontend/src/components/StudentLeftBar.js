import { Drawer, Toolbar, Box, Typography, List, Avatar, Divider } from "@mui/material";
import { mainListItems, secondaryListItems } from "./StudentLeftBarListItems";
import React from "react";
import { useEffect } from "react";
import axios from "axios";

export default function StudentLeftBar() {
    const [userLogin, setUserLogin] = React.useState(0);

    useEffect(() => {
        setUserLogin(localStorage.getItem("login"));
    }, [])

    return ( 
        <Drawer 
            variant="permanent" 
            open={true} 
            PaperProps={{
                sx: {
                width: 280
                }
            }}
        >
            <Box
                sx={{
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: "column",
                px: 3,
                py: '11px',
                borderRadius: 1
                }}
            >
                
                <Avatar style={{marginBottom: "12px"}}>{userLogin[0]}</Avatar>
                <Typography
                    color="neutral.400"
                    variant="body2"
                >
                    Добро пожаловать, {userLogin}!
                </Typography>
            </Box>
            <Divider />
            <List component="nav">
                {mainListItems}
                <Divider sx={{ my: 1 }} />
                {secondaryListItems}
            </List>
        </Drawer>
    );
};