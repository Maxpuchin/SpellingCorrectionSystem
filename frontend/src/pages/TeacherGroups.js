import React, { useEffect, useState } from "react";
import TeacherLeftBar from "../components/TeacherLeftBar";
import { Container, Card, Button, Snackbar, ListSubheader, TextField, Pagination, Typography, Alert, Stack, List, ListItemButton, ListItemText, Collapse, ListItem, IconButton } from "@mui/material";
import axios from "axios";
import MultipleChoiceList from "../components/MultipleChoiceList";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";

export default function TeacherGroups() {
    const [names, setNames] = useState([]);
    const [personName, setPersonName] = React.useState([]);
    const [groupName, setGroupName] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [severity, setSeverity] = React.useState("");
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [listOfGroups, setListOfGroups] = React.useState([]);
    const [openGrops, setOpenGropus] = React.useState([]);

    const onLabelModelChosen = index => event => {
        let newArr = [...openGrops];
        newArr[index] = !newArr[index];
        setOpenGropus(newArr);

    }

    const getAllGroups = () => {
        axios.get("/group/get-all-groups")
        .then((response) => {
            setListOfGroups(response.data.groups);
            let openGroups_ = new Array(listOfGroups.length);
            openGroups_.fill(false);
            setOpenGropus(openGroups_);
        });
    }

    useEffect(() => {
        axios.get("/group/get-all-students")
        .then((response) => {
            let names_ = response.data.users.map((user) => {
                return user.login + " (" + user.first_name + " " + user.last_name + ")";
            });
            setNames(names_);
        })
        .then(() => {
            getAllGroups();
        });
    }, [])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenSnackbar(false);
    };

    const handleGroupName = (event) => {
        setGroupName(event.target.value);
    }

    const handleDeleteStudent = (groupName_, login_) => {
        if (window.confirm("Удалить студента " + login_ + " из группы " + groupName_ + "?")) {
            axios.post(
                "/group/delete-user",
                {
                    "group_name": groupName_,
                    "login": login_
                }
            ).then((r) => {
                getAllGroups();
            });
        }
    }

    const handleDeleteGroup = (groupName_) => {
        if (window.confirm("Удалить группу " + groupName_ + "?")) {
            axios.post(
                "/group/delete-group",
                {
                    "group_name": groupName_
                }
            ).then((r) => {
                getAllGroups();
            });
        }
    }

    const handleSubmit = () => {
        const data = {
            "group_name": groupName,
            "participants": personName
        }
        
        axios.post(
            "/group/add-new-group",
            data
        ).then((response) => {
            if (response.data.status === "OK") {
                setOpenSnackbar(true);
                setSeverity("success");
                setMessage("Группа успешно создана.");
                getAllGroups();
            } else {
                setOpenSnackbar(true);
                setSeverity("warning")
                setMessage(response.data.status);
            }
        })
    }

    return (
        <div>
            <TeacherLeftBar/>
            <Container component="main" maxWidth="xl">
                <Stack direction="row">
                    <Card
                        variant="outlined"
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: "100%",
                            marginRight: "12px"
                        }}
                    >
                        <div style={{margin: "24px", maxHeight: "500", textAlign: "center"}}>
                            <Typography component="h1" variant="h5">
                                Создать новую группу
                            </Typography>
                            <h4>
                                Название группы
                            </h4>
                            <TextField 
                                id="standard-basic" 
                                label="Название группы" 
                                variant="outlined" 
                                style={{ width: "400px"}}
                                value={groupName}
                                onChange={handleGroupName}
                            />
                            <h4>
                                Добавить участников
                            </h4>
                            <MultipleChoiceList 
                                names={names} 
                                personName={personName} 
                                setPersonName={setPersonName}
                            />
                            <Button 
                                style={{marginTop: "24px", width: "400px"}} 
                                variant="outlined" 
                                onClick={handleSubmit}
                            >
                                Создать группу
                            </Button>
                            <Snackbar open={openSnackbar} onClose={handleClose} autoHideDuration={6000} >
                                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                                    {message}
                                </Alert>
                            </Snackbar>          
                        </div>
                    </Card>
                    <Card 
                        variant="outlined"
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            marginLeft: "12px",
                            width: "100%"
                        }}
                    >
                        <div style={{margin: "24px",  textAlign: "center"}}>
                            <Typography component="h1" variant="h5">
                                Созданные группы
                            </Typography>
                            <List
                                sx={{
                                    maxHeight: "500px", overflow:"auto"
                                }}
                                subheader={
                                    <ListSubheader>
                                        Ваши группы
                                    </ListSubheader>
                                }
                            >
                                {
                                    listOfGroups.map((groupItem, index) => {
                                        return (
                                            <React.Fragment>
                                                <ListItemButton onClick={onLabelModelChosen(index)}>
                                                    <ListItemText primary={groupItem["group_name"]} />
                                                    <IconButton 
                                                        onClick={() => handleDeleteGroup(groupItem["group_name"])}
                                                        edge="end"
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                
                                                    {openGrops[index] ? <ExpandLess/> : <ExpandMore/> }
                                                
                                                </ListItemButton>
                                                <Collapse in={openGrops[index]}>
                                                    <List 
                                                        subheader={
                                                            <ListSubheader>
                                                                Участники
                                                            </ListSubheader>
                                                        }
                                                    >
                                                        {groupItem["participants"].map((name) => {
                                                            return (
                                                                <ListItem>
                                                                    <ListItemText 
                                                                        primary={name["login"]} 
                                                                        secondary={name["full_name"]} 
                                                                        sx={{textAlign: "left"}} 
                                                                        
                                                                    />
                                                                    <IconButton onClick={() => handleDeleteStudent(groupItem["group_name"], name["login"])} edge="end">
                                                                        <Delete />
                                                                    </IconButton>
                                                                </ListItem>
                                                            )
                                                        })}
                                                    </List>
                                                </Collapse>
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </List>
                        </div>
                    </Card>
                </Stack>
            </Container>
        </div>
    )
}