import { Toolbar, Box, Typography, List, Avatar, Divider, IconButton } from "@mui/material";
import { mainListItems, secondaryListItems } from "./StudentLeftBarListItems";
import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { Menu } from "@mui/icons-material";
import MuiDrawer from '@mui/material/Drawer';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';


const drawerWidth = 280;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      '& .MuiDrawer-paper': {
        position: 'absolute',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: theme.spacing(7),
          [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
          },
        }),
      },
    }),
  );

export default function StudentLeftBar() {
    const [userLogin, setUserLogin] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = () => {
        setOpen(!open);
    };
    
    useEffect(() => {
        setUserLogin(localStorage.getItem("login"));
    }, [])

    return ( 
        <Drawer 
            variant="permanent" 
            open={open} 
            
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
                <IconButton onClick={toggleDrawer}>
                    <Menu/>
                </IconButton>
                <Avatar style={{marginBottom: "12px"}}>{userLogin[0]}</Avatar>
                {
                    open &&
                <Typography
                    color="neutral.400"
                    variant="body2"
                >
                    Добро пожаловать, {userLogin}!
                </Typography>
                }
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