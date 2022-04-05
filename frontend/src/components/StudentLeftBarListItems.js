import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { AddBox, ExitToApp, FormatListBulleted, Settings } from '@mui/icons-material';
import { Link } from "react-router-dom";


export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/student/list-works">
      <ListItemIcon>
        <FormatListBulleted/>
      </ListItemIcon>
      <ListItemText primary="Общее" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/student/settings">
      <ListItemIcon>
        <Settings/>
      </ListItemIcon>
      <ListItemText primary="Настройки" />
    </ListItemButton>
    <ListItemButton component={Link} to="/sign-in" >
      <ListItemIcon>
        <ExitToApp />
      </ListItemIcon>
      <ListItemText primary="Выйти" />
    </ListItemButton>
  </React.Fragment>
);