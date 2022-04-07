import { Alert, AlertTitle, Badge, Card, CardContent, Container, Grid, Icon, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import TeacherLeftBar from "../components/TeacherLeftBar";
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import { useNavigate } from "react-router-dom";


export default function TeacherListWorks2() {
    const [works, setWorks] = useState([]);
    const [lastCases, setLastCases] = useState([]);
    const [groupNames, setGroupNames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/work/get-teachers-works")
        .then((response) => {
            setWorks(response.data.works);
            setLastCases(response.data.last_cases);
            setGroupNames(response.data.group_names);
        })
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
                            После создания работы ученики, которых вы добавили
                            к работе могут начать ее выполнять. Во вкладке
                            <br />
                            <b>Последние выполнения</b> вы можете ознакомиться 
                            с последними выполнениями ваших работ учениками.
                            <br />
                            Также по желанию вы можете проверить некоторые работы
                            самостоятельно. Каждая работа после завершения будет 
                            <br />
                            проверена нашими алгоритмами и будет выставлена
                            автоматическая оценка. Если вам необходимо усиленный
                            <br />
                            контроль за выполнением работы, пройдите во вкладку 
                            <b> Добавленные работы</b> и выберите нужную работу.
                        </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} md={12} lg={12}>
                    <Paper sx={{padding: "24px", height: "500px"}} variant="outlined">
                        <Typography variant="h6" gutterBottom>
                            Последние выполнения
                        </Typography>
                        <List sx={{ overflowY: "auto", height: "400px"}}>
                        {
                            lastCases.map((item) => {
                                return (
                                    <ListItem disablePadding>
                                        <Alert style={{marginBottom: "12px"}} variant="outlined" severity={item["severity"]} sx={{width: "100%"}}>
                                            <AlertTitle>
                                                {item["work_name"]}
                                            </AlertTitle>
                                            <b>Ученик: </b> {item["full_name"]} <br/>
                                            <b>Тип работы: </b> {item["type"]} <br/>
                                            <b>Статус: </b> {item["text"]} <br/>
                                            <b>Время начала написания работы: </b> {item["start_time"]} <br/>
                                            {
                                                item["auto grade"] !== null &&
                                                <>
                                                    <b>Автоматическая оценка: </b>{item["auto grade"]}
                                                </>
                                            }
                                            <br/>
                                            {
                                                item["teacher grade"] !== null &&
                                                <>
                                                    <b>Оценка преподавателя: </b>{item["teacher grade"]}
                                                </>
                                            }
                                        </Alert>
                                    </ListItem>
                                );
                            })
                        }
                        </List>
                    </Paper>
                </Grid> 
                <Grid item xs={12} md={12} lg={12}>
                    <Paper sx={{padding: "24px"}} variant="outlined">
                        <Typography variant="h6" gutterBottom>
                            Добавленные работы
                        </Typography>
                        {
                            groupNames.map((name) => {
                                return (
                                    <>
                                        {name}
                                        <List sx={{maxHeight: "400px"}}>
                                            {
                                                works
                                                .filter((item) => item["groups"].includes(name))
                                                .map((item) => {
                                                    return (
                                                        
                                                        <ListItem
                                                            secondaryAction={
                                                                <Badge badgeContent={item["cases"]} color="primary">
                                                                    <Icon edge="end">
                                                                        <AutoAwesomeMotionIcon />
                                                                    </Icon>
                                                                </Badge>
                                                            }
                                                            disablePadding
                                                        >
                                                            <ListItemButton onClick={() => {
                                                                navigate("/teacher/list-works/list-cases?name=" + item["name"]);
                                                            }}>
                                                                <ListItemText primary={item["name"]} secondary={item["type"]}/>
                                                            </ListItemButton>
                                                        </ListItem>
                                                        
                                                    );
                                                })
                                            }
                                        </List>
                                    </>
                                );
                            })
                        }
                    </Paper>
                </Grid>
            </Grid>
        </Container>
        </>
    );
}