import { Alert, Button, Card, Container, CardActionArea, CardContent, Paper, Typography, TextField, Stack } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";

import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

import Loading from "react-fullscreen-loading";
import { useNavigate } from "react-router-dom";


const START_TEXT = "Вы готовы приступить к выполнению задания? Отменить действие будет нельзя."

export default function StudentWorkPage() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    const workName = params.name;

    const navigate = useNavigate();

    const [status, setStatus] = useState("");
    const [isEssay, setIsEssay] = useState(false);
    const [dictationAudio, setDictationAudio] = useState({});
    const [essayTopic, setEssayTopic] = useState("");
    const [textWritten, setTextWritten] = useState("");
    const [secondsLeft, setSecondsLeft] = useState(-1);
    const [loadGrade, setLoadGrade] = useState(false); 
    const [audioURL, setAudioURL] = useState("");

    const handleTextWritten = (event) => {
        setTextWritten(event.target.value);
    }

    const handleStart = () => {
        axios.get(
            "/work/start", 
            {
                params: 
                {
                    "name": workName
                }
            }
        ).then((response) => {
            setSecondsLeft(response.data.time_left);
            setStatus("in process");
        });
    }

    const handleFinish = () => {
        setLoadGrade(true);
        axios.post(
            "/work/finish",
            {
                "name": workName,
                "text_written": textWritten
            }
        ).then((response) => {
            navigate(response.data.url);
        });
    }
 
    useEffect(() => {
        axios.get(
            "/work/info",
            {
                params: {
                    "name": workName
                }
            }
        ).then((response) => {
            setStatus(response.data.status);
            setSecondsLeft(response.data.seconds_left)
            setEssayTopic(response.data.essay_topic);
            setIsEssay(response.data.is_essay);
            setAudioURL("/work/audio?audioName=" + response.data.dictation_audio);
        }).then(
            () => {
                setInterval(() => {
                    setSecondsLeft((prevSec) => prevSec - 1)
                }, 1000)
            }
        )
    }, []);

    const getContentByStatus = (status) => {
        switch (status) {
            case "not started": 
                return (
                    <Card variant="outlined" style={{margin: "20%"}}>
                        <CardContent>
                            <Typography variant="h5">
                                Внимание!
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
            case "in process":
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
                        
                        <Typography mb={"12px"} component="h1" variant="h5">
                            {isEssay === true ? "Сочинение" : "Диктант"}: {workName}
                        </Typography>
                        {
                            isEssay === true 
                            ?
                            <Typography>
                                {essayTopic}
                            </Typography>
                            :
                            <AudioPlayer
                            autoPlay={false}
                            autoPlayAfterSrcChange={false}
                                src={audioURL}
                            />
                        }
                        <TextField
                            margin="normal"
                            fullWidth
                            multiline
                            value={textWritten}
                            onChange={handleTextWritten}
                            rows={50}
                            label="Введите текст..."
                        /> 
                        <Button onClick={handleFinish}>
                            Закончить
                        </Button>
                        <Loading loading={loadGrade} />
                    </Box>
                );
            default: 
                return (
                    <>
                    </>
                );
        }    
    }

    return (
        <Container component="main" maxWidth="lg">   
            {getContentByStatus(status)}
        </Container>
    )
}