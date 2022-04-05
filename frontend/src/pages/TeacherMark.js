import React, { useState } from "react";
import TeacherLeftBar from "../components/TeacherLeftBar";
import { Container, Typography, TextField, Stack, Divider, Paper, Button, Chip, Slide, Slider } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import TextfieldWithDifference from "../components/TextfieldWithDifference";
import { useNavigate } from "react-router-dom";



export default function TeacherMark() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    const workCaseId = params.id;

    const [workName, setWorkName] = useState("");
    const [textWritten, setTextWritten] = useState("");
    const [correctedText, setCorrectedText] = useState([]);
    const [autoGrade, setAutoGrade] = useState(0);
    const [teacherGrade, setTeacherGrade] = useState(-1)
   
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(
            "/work/results",
            {
                params: {
                    "workCaseId": workCaseId 
                }
            }
        ).then((response) => {
            setWorkName(response.data.results.work_name);
            setTextWritten(response.data.results.text_written);
            setCorrectedText(response.data.results.corrected_text);
            setAutoGrade(response.data.results.auto_grade);
        });
    }, []);

    const handleSubmit = () => {
        axios.post(
            "/work/mark",
            {
                "mark": teacherGrade,
                "workCaseId": workCaseId,
                "teacherCorrectedText": textWritten
            }
        ).then((response) => {
            navigate("/teacher/list-works");
        });
    }

    return (
        <div>
            <TeacherLeftBar/>
            <Container component="main" maxWidth="lg">
                <Typography variant="h4" marginTop={"24px"} textAlign={"center"}>
                    Результаты выполнения работы
                </Typography>
                <Divider sx={{mb: "12px", mt: "12px"}}>
                    <Chip color="primary" variant="outlined" label="Результаты автоматической проверки"/>
                </Divider>
                <Stack 
                    direction="row" 
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem />}
                >
                    <TextfieldWithDifference corrections={correctedText}/>
                    <Paper
                        variant="outlined"
                        sx={{padding: "12px", width: "50%"}}
                    >
                        <Typography textAlign="center" variant="h6">
                            Результаты
                        </Typography>
                        <Divider style={{margin: "12px"}}/>
                        <Typography>
                            <b>Название работы:</b> {workName}
                        </Typography>
                        <Typography>
                            <b>Автоматическая оценка:</b> {autoGrade}
                        </Typography>
                    </Paper>
                </Stack>
                <Divider sx={{mb: "12px", mt: "12px"}}>
                    <Chip color="primary" variant="outlined" label="Исправить текст вручную"/>
                </Divider>
                <TextField 
                    fullWidth 
                    multiline 
                    rows={6} 
                    value={textWritten} 
                    onChange={(event) => { setTextWritten(event.target.value) }}
                />
                <Divider sx={{mb: "12px", mt: "12px"}}>
                    <Chip color="primary" variant="outlined" label="Введите оценку"/>
                </Divider>
                <Slider 
                    min={0} 
                    max={100} 
                    color="success" 
                    sx={{mb: "12px"}} 
                    fullWidth 
                    onChange={(event) => { setTeacherGrade(event.target.value) }}
                    value={teacherGrade}
                    valueLabelDisplay="auto"    
                />
                <Button 
                    disabled={teacherGrade === -1}
                    fullWidth 
                    color="success" 
                    variant="outlined"
                    onClick={handleSubmit}
                >
                    Оценить
                </Button>
            </Container>
        </div>
        
    );
}