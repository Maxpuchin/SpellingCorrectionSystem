import React, { useState } from "react";
import TeacherLeftBar from "../components/TeacherLeftBar";
import { Container, Box, List, Typography, Button, Accordion, Alert, AccordionSummary, Card, AlertTitle } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export default function TeacherCases() {

    const [cases, setCases] = useState([]);

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    const workName = params.name;

    useEffect(() => {
        axios.get("/work/cases?workname=" + workName)
        .then((response) => {
            setCases(response.data.result);
        });
    }, [])
    
    return (
        <>
            <TeacherLeftBar/>
            <Container component="main" maxWidth="md">
                <List>
                    {cases.map((caseInfo) => {
                        console.log(caseInfo)
                        let linkTo = "/teacher/list-works/case?id=" + caseInfo.work_case_id;
                        return (
                            <Alert 
                                variant='outlined' 
                                severity={caseInfo.severity}
                                action={
                                    caseInfo.severity === "error" &&
                                    <Button component={Link} to={linkTo} color={caseInfo.severity} size="small">
                                      ОЦЕНИТЬ
                                    </Button>
                                  }    
                            >
                                <AlertTitle>
                                        <b>Ученик: </b> {caseInfo.full_name}
                                </AlertTitle>
                                <b>Начало: </b> {caseInfo.start_time} <br/>
                                <b>Статус: </b> {caseInfo.text}
                                   
                            </Alert>
                        )
                    })}
                </List>             
            </Container>
        </>
    )
}