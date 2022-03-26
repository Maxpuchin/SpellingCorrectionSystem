import React, { useEffect, useState } from "react";
import { Container, Box, Typography, TextField, useIsFocusVisible, Button, Popover, Paper } from "@mui/material";
import StudentLeftBar from "../components/StudentLeftBar";
import axios from "axios";
import { useParams } from "react-router-dom";
import ButtonWithPopover from "../components/ButtonWithPopover";

export default function EssayPage(props) {
    const [topic, setTopic] = useState("");
    const [essayText, setEssayText] = useState("");
    const essayName = useParams().name;
    const [correctedText, setCorrectedText] = useState([]);

    const handleEssayText = (event) => {
        setEssayText(event.target.value);
    }

    const handleSubmit = () => {
        axios.post(
            "/work/correct-text",
            {"text": essayText}
        ).then(
            (response) => {
                setCorrectedText(response.data.corrected);
            }
        )
    }

    const handleFinish = () => {
        axios.post(
            "/work/finish",
        )
    }

    useEffect(() => {
        axios.get("/work/get-essay-info/" + essayName)
        .then((response) => {
            setTopic(response.data.topic);
        })
    }, []);

    return (
        <div>
            <StudentLeftBar/>
            <Container component="main" maxWidth="lg">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Сочинение
                    </Typography>
                    <Typography>
                        {topic}
                    </Typography>
                    {correctedText.length === 0 
                    ? 
                    <TextField
                        margin="normal"
                        fullWidth
                        multiline
                        value={essayText}
                        onChange={handleEssayText}
                        rows={50}
                        label="Введите текст..."
                    />               
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
                    </Paper>
                    }
                    <Button onClick={handleSubmit}>
                        Закончить
                    </Button>
                </Box>
            </Container>
        </div>
    )
}