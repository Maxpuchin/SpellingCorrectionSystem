import React, { useState } from "react";
import TeacherLeftBar from "../components/TeacherLeftBar";
import { Container, Box, List, ListItem, ListItemIcon, ListItemText, ListItemButton, ListSubheader, Collapse, Card, Alert, AlertTitle, Button, Table, Typography, TextField, RadioGroup, FormLabel, FormControl, FormControlLabel, Radio } from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { useEffect } from "react";

import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StudentLeftBar from "../components/StudentLeftBar";
import { Paragliding } from "@mui/icons-material";

export default function StudentListWorks() {
    const [listOfWorks, setListOfWorks] = useState([]);
    const navigate = useNavigate();
    const [filterName, setFilterName] = useState("");
    const [filter, setFilter] = useState("name");

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

    const handleParticipate = (name) => {
        axios.get(
            "/work/url",
            {
                params: {
                    "workName": name
                }
            }
        ).then((response) => {
            navigate(response.data.url);
        })
    }

    return (
        <div>
            <StudentLeftBar/>
            <Container component="main" maxWidth="md">
                <Card
                    variant="outlined"
                    sx={{
                        marginTop: "36px",
                        display: 'flex',
                        flexDirection: 'column',
                        // alignItems: 'center',
                        backgroundColor: '#FFFF',
                        width: "100%",
                        marginBottom: "36px",
                        paddingBottom: "12px"
                    }}
                >
                        <Typography textAlign={"center"} marginTop="12px" variant="h4">
                            ?????????????????? ????????????
                        </Typography>
                        <div
                            style={{
                                display: "flex",
                                margin: "12px",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <TextField 

                                label="????????????" 
                                value={filterName}
                                style={{width: "50%", marginRight: "12px"}}
                                onChange={(event) => { setFilterName(event.target.value); }}
                            />
                            <FormControl>
                                <FormLabel style={{textAlign: "center", marginLeft: "12px"}}>???? ???????? ??????????????????????</FormLabel>
                                <RadioGroup
                                    row
                                    value={filter}
                                    onChange={(event) => { setFilter(event.target.value); }}
                                >
                                    <FormControlLabel value="name" control={<Radio />} label="????????????????" />
                                    <FormControlLabel value="text" control={<Radio />} label="????????????" />
                                    <FormControlLabel value="type" control={<Radio />} label="?????? ????????????" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                        
                        <Typography textAlign={"center"} marginTop="12px" variant="h5" color="grey">
                            ?????????????????????? ????????????
                        </Typography>
                        {
                            Object.entries(listOfWorks).map(
                                (item) => {
                                    let groupName = item[0];
                                    let sublistOfWorks = item[1];
                                    return (
                                        <>
                                        {sublistOfWorks
                                        .filter((name) => name["finished"] === false && name[filter].includes(filterName))
                                        .map(
                                            (name) => {
                                                return (
                                                    <Alert
                                                        
                                                        variant="outlined"
                                                        severity={name["color"]} 
                                                        sx={{
                                                            margin: "12px",
                                                            width: "auto"
                                                        }}
                                                        action={
                                                            <Button 
                                                                variant="outlined"
                                                                color={name["color"]} 
                                                                onClick={() => handleParticipate(name["name"])}
                                                            >
                                                                {name["button"]}
                                                            </Button>
                                                        }  
                                                    >
                                                        <AlertTitle>
                                                            {name["name"]}
                                                        </AlertTitle>
                                                        <b>?????? ????????????: </b> {name["type"]} <br/>
                                                        <b>????????????: </b> {name["text"]} <br/>
                                                        <b>?????????? ???????????????? ????????????: </b> {name["time"]} <br/>
                                                        {
                                                            name["auto grade"] !== null &&
                                                            <>
                                                                <b>???????????????????????????? ????????????: </b>{name["auto grade"]}
                                                            </>
                                                        }
                                                        <br/>
                                                        {
                                                            name["teacher grade"] !== null &&
                                                            <>
                                                                <b>???????????? ??????????????????????????: </b>{name["teacher grade"]}
                                                            </>
                                                        }
                                                    </Alert>
                                                );
                                            })
                                        }
                                        </>
                                    );
                                }
                            )
                        }
                        <Typography textAlign={"center"} variant="h5" color="grey">
                            ?????????????????? ????????????
                        </Typography>
                        {
                            Object.entries(listOfWorks).map(
                                (item) => {
                                    let groupName = item[0];
                                    let sublistOfWorks = item[1];
                                    return (
                                        <>
                                        {sublistOfWorks
                                        .filter((name) => name["finished"] === true  && name[filter].includes(filterName))
                                        .map(
                                            (name) => {
                                                return (
                                                    <Alert
                                                        
                                                        variant="outlined"
                                                        severity={name["color"]} 
                                                        sx={{
                                                            margin: "12px",
                                                            width: "auto"
                                                        }}
                                                        action={
                                                            <Button 
                                                                variant="outlined"
                                                                color={name["color"]} 
                                                                onClick={() => handleParticipate(name["name"])}
                                                            >
                                                                {name["button"]}
                                                            </Button>
                                                        }  
                                                    >
                                                        <AlertTitle>
                                                            {name["name"]}
                                                        </AlertTitle>
                                                        <b>?????? ????????????: </b> {name["type"]} <br/>
                                                        <b>????????????: </b> {name["text"]} <br/>
                                                        <b>?????????? ???????????????? ????????????: </b> {name["time"]} <br/>
                                                        {
                                                            name["auto grade"] !== null &&
                                                            <>
                                                                <b>???????????????????????????? ????????????: </b>{name["auto grade"]}
                                                            </>
                                                        }
                                                        <br/>
                                                        {
                                                            name["teacher grade"] !== null &&
                                                            <>
                                                                <b>???????????? ??????????????????????????: </b>{name["teacher grade"]}
                                                            </>
                                                        }
                                                    </Alert>
                                                );
                                            })
                                        }
                                        </>
                                    );
                                }
                            )
                        }
                </Card>
                
            </Container>
        </div>
    )
}