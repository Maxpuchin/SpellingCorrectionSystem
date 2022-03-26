import React, { useState } from "react";
import TeacherLeftBar from "../components/TeacherLeftBar";
import { Container, Box, List, ListItem, ListItemIcon, ListItemText, ListItemButton, ListSubheader, Collapse, Card } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

import { useEffect } from "react";

import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export default function StudentListWorks() {
    const [listOfWorks, setListOfWorks] = useState([]);

    useEffect(() => {
        axios.get("/work/get-student-works")
        .then((response) => {
            if (response.data.status === "OK") {
                console.log(response.data.works);
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
                        sx={{ width: '100%', minHeight: "400px", bgcolor: 'background.paper' }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={
                            <ListSubheader style={{textAlign: "center"}}>
                                Доступные вам работы
                            </ListSubheader>
                        }
                    >
                        {
                            Object.entries(listOfWorks).map(
                                (item) => {
                                    let groupName = item[0];
                                    let sublistOfWorks = item[1];
                                    return (
                                        <>
                                        <ListSubheader style={{textAlign: "center"}}>
                                            {groupName}
                                        </ListSubheader>
                                        {sublistOfWorks.map(
                                            (name) => {
                                                return (
                                                    <ListItemButton component={Link} to={"/student/essay/" + name["name"]}>
                                                        <ListItemIcon>
                                                            <FormatListBulletedIcon/>
                                                        </ListItemIcon>
                                                        <ListItemText primary={name["name"]}/>
                                                    </ListItemButton>
                                                );
                                            })
                                        }
                                        </>
                                        
                                    );
                                }
                            )
                        }
                    </List>
                </Card>
                
            </Container>
        </div>
    )
}