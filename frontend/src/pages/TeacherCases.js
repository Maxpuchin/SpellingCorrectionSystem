import React, { useState } from "react";
import TeacherLeftBar from "../components/TeacherLeftBar";
import { Container, Box, List, Typography, Button, Accordion, Alert, AccordionSummary, Card, AlertTitle, Grid, CardContent } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";

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
            <Container maxWidth="lg" sx={{mt: "24px", mb: "24px"}}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                    <Card variant="outlined">
                        <CardContent>
                        <Typography variant="h5" component="div">
                            Что происходит на этой странице?
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Кратко
                        </Typography>
                        <Typography variant="body2">
                            Здесь вы можете выбрать выполненную учеником работу
                            для ручной оценки. <br /> 
                            Для этого выберите еще не оцененную
                            работу из предложенных ниже и нажмите кнопку <b>Оценить</b>.
                        </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
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
                                <b>Статус: </b> {caseInfo.text} <br />
                                <b>Автоматическая оценка: </b> {caseInfo.auto_grade} <br />
                                <b>Ваша оценка: </b> {caseInfo.teacher_grade} <br />
                            </Alert>
                        )
                    })}
                </List>
                </Grid>
            </Grid>             
            </Container>
        </>
    )
}