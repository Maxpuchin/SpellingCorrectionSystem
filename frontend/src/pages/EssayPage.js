import React, { useEffect, useState } from "react";
import { Container, Box, Typography, TextField, Card, useIsFocusVisible, Button, Popover, Paper, CardContent, CardActionArea, Snackbar, Alert } from "@mui/material";
import StudentLeftBar from "../components/StudentLeftBar";
import axios from "axios";
import { useParams } from "react-router-dom";
import ButtonWithPopover from "../components/ButtonWithPopover";
import { ConstructionOutlined } from "@mui/icons-material";


const START_TEXT = "Чтобы приступить к заданию, нажмите на кнопку Приступить. Отменить действие будет нельзя";

export default function EssayPage(props) {
    const [topic, setTopic] = useState("");
    const [essayText, setEssayText] = useState("");
    const essayName = useParams().name;
    const [correctedText, setCorrectedText] = useState([]);
    const [startStatus, setStartStatus] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(-1);

    const handleStart = () => {
        axios.get(
            "/work/essay/start", 
            {
                params: 
                {
                    "name": essayName
                }
            }
        ).then((response) => {
            setSecondsLeft(response.data["time_left"]);
            setStartStatus(1);
        });
    }

    const handleEssayText = (event) => {
        setEssayText(event.target.value);
    }

    const handleSubmit = () => {
        axios.post(
            "/work/essay/correct",
            {"text": essayText}
        ).then(
            (response) => {
                setCorrectedText(response.data.corrected);
            }
        )
    }

    const handleFinish = () => {
        axios.post(
            "/work/essay/finish",
            {
                "name": essayName,
                "text_written": essayText
            }
        ).then(
            (response) => {
                setStartStatus(2);
            }
        ).catch(
            () => {
                alert("Произошла ошибка.")
            }
        )
    }

    useEffect(() => {
        axios.get("/work/essay/info", {params: {"name": essayName}})
        .then((response) => {
            if (response.data.status === "not started") {
                setStartStatus(0);
            } else if (response.data.status === "in process") {
                setStartStatus(1);
                setSecondsLeft(response.data["seconds_left"]);
                setTopic(response.data.topic);
            } else {
                setStartStatus(2);
            }
        }).then(
            () => {
                setInterval(() => {
                    setSecondsLeft((prevSec) => prevSec - 1)
                }, 1000)
            }
        )
    }, [])

    const getContentByStatus = (status) => {
        switch (status) {
            case 0:
                return (
                    <Card variant="outlined" style={{margin: "20%"}}>
                        <CardContent>
                            <Typography variant="h5">
                                Предупреждение
                            </Typography>
                            <Typography style={{marginTop: "12px", marginBottom: "12px"}}>
                                {START_TEXT}
                            </Typography>
                            <CardActionArea>
                                <Button variant="outlined" onClick={handleStart}>Приступить</Button>
                            </CardActionArea>
                        </CardContent>
                    </Card>
                );
            case 1:
                return (
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        
                            <Alert 
                                severity="info"
                                sx={{     
                                    position: "absolute",
                                    top: "88px",
                                    width: "10%",
                                    right: "24px"               
                                }}
                            >
                                Времени осталось: {
                                    ('0' + Math.round(secondsLeft / 60)).slice(-2) 
                                }:{('0' + Math.round(secondsLeft % 60)).slice(-2) }
                            </Alert>
                        
                        <Typography component="h1" variant="h5">
                            Сочинение
                        </Typography>
                        <Typography>
                            {topic}
                        </Typography>
                        {correctedText.length === 0 
                        ? 
                        <>
                            <TextField
                                margin="normal"
                                fullWidth
                                multiline
                                value={essayText}
                                onChange={handleEssayText}
                                rows={50}
                                label="Введите текст..."
                            /> 
                            <Button onClick={handleSubmit}>
                                Закончить
                            </Button>
                        </>
                                      
                        :
                        <Paper variant="outlined"
                            style={{
                                margin: "24px",
                                padding: "12px"
                            }}
                        >
                            <div 
                                style={{ 
                                    display: 'flex', 
                                    flexFlow: "wrap", 
                                    width: '100%' 
                                }}
                            >
                                {correctedText.map((elem, ndx) => 
                                    {
                                        let before = elem["before"];
                                        let after = elem["after"];

                                        if (after === before) {
                                            return (
                                                <Typography style={{marginLeft: "2px", marginRight: "2px"}} >
                                                    {before}
                                                </Typography>
                                            )
                                        } else {
                                            return (
                                                <>
                                                    <ButtonWithPopover
                                                        label={before}
                                                    >
                                                        Вероятно, вы имели в виду: <b>{after}</b>
                                                    </ButtonWithPopover>
                                                </>
                                            )
                                        }
                                    }
                                )}
                            </div>
                            <Button onClick={handleFinish}>
                                Отправить на оценку
                            </Button>
                        </Paper>
                        }
                        
                    </Box>
                );
            case 2:
                return (
                    <Card variant="outlined" style={{margin: "20%"}}>
                        <CardContent>
                            <Typography variant="h5">
                                Предупреждение
                            </Typography>
                            <Typography style={{marginTop: "12px", marginBottom: "12px"}}>
                                Вы уже написали эту работу.
                            </Typography>
                        </CardContent>
                    </Card>
                );
            default:
                throw new Error();
        }
        
    }

    return (
        <div>
            {
                startStatus !== 1 &&
                <StudentLeftBar/>
            }
            
            <Container component="main" maxWidth="lg">
                
                {getContentByStatus(startStatus)}
            </Container>
        </div>
    )
}