import React, { useState } from "react";
import TeacherLeftBar from "../components/TeacherLeftBar";
import { Container, Box, List, ListItem, ListItemIcon, ListItemText, ListItemButton, ListSubheader, Collapse, Card } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";

import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export default function TeacherListWorks() {
    const [listOfWorks, setListOfWorks] = useState([]);

    useEffect(() => {
        axios.get("/work/get-teachers-works")
        .then((response) => {
            if (response.data.status === "OK") {
                setListOfWorks(response.data.works);
            }
        });
    }, [])
    
    const [openDicts, setOpenDicts] = React.useState(false);

    const handleClickDicts = () => {
      setOpenDicts(!openDicts);
    };

    const [openEssay, setOpenEssay] = React.useState(false);

    const handleClickEssay = () => {
      setOpenEssay(!openEssay);
    };

    return (
        <div>
            <TeacherLeftBar/>
            <Container component="main" maxWidth="md">
                <Card
                    variant="outlined"
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <List
                        sx={{ width: '100%', bgcolor: 'background.paper' }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={
                            <ListSubheader component="div" id="nested-list-subheader">
                            Добавленные вами работы
                            </ListSubheader>
                        }
                    >
                        <ListItemButton onClick={handleClickDicts}>
                            <ListItemIcon>
                                <FormatListBulletedIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Диктанты" />
                            {openDicts ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={openDicts} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {listOfWorks.filter((x) => x.type === "Диктант").map((work) => {
                                    return (
                                        <ListItemButton sx={{ pl: 4 }}>
                                            <ListItemIcon>
                                            <TextSnippetIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={work.name} secondary={work.time}/>
                                        </ListItemButton>
                                    )
                                })}
                            </List>
                        </Collapse>
                        <ListItemButton onClick={handleClickEssay}>
                            <ListItemIcon>
                                <FormatListBulletedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Сочинения" />
                            {openEssay ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={openEssay} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {listOfWorks.filter((x) => x.type === "Сочинение").map((work) => {
                                    return (
                                        <ListItemButton sx={{ pl: 4 }}>
                                            <ListItemIcon>
                                                <TextSnippetIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={work.name} secondary={work.time}/>
                                        </ListItemButton>
                                    )
                                })}
                            </List>
                        </Collapse>
                    </List>
                </Card>
                
            </Container>
        </div>
    )
}