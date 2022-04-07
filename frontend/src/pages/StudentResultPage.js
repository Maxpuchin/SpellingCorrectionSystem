import { Card, Chip, Container, Divider, Paper, Stack, Typography, TextField, Button, Alert, AlertTitle } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import StudentLeftBar from "../components/StudentLeftBar";
import TextfieldWithDifference from "../components/TextfieldWithDifference";

export default function StudentResultPage() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    const workCaseId = params.workCaseId;

    const [workName, setWorkName] = useState("");
    const [textWritten, setTextWritten] = useState("");
    const [correctedText, setCorrectedText] = useState([]);
    const [autoGrade, setAutoGrade] = useState(0);
    const [teacherGrade, setTeacherGrade] = useState(0)
    const [isEssay, setIsEssay] = useState(true);
    const [status, setStatus] = useState("");
    const [cwDone, setCwDone] = useState(false);

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
            setStatus(response.data.results.status);
            setTeacherGrade(response.data.results.teacher_grade);
            setCwDone(response.data.results.cw_done);
        });
    }, []);
    
    const handleSubmit = () => {
        axios.get(
            "/work/set-correction-work",
            {
                params: {
                    "workCaseId": workCaseId 
                }
            }
        ).then((response) => {
            window.location.reload();
        })
    }

    return (
        <div>
            <StudentLeftBar/>
            <Container component="main" maxWidth="lg">
                <Typography variant="h4" marginTop={"24px"} textAlign={"center"}>
                    Результаты выполнения работы
                </Typography>
                <Stack 
                    marginTop={"24px"} 
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
                            <b>Статус:</b> {status}
                        </Typography>
                        <Typography>
                            <b>Автоматическая оценка:</b> {autoGrade}
                        </Typography>
                        <Typography>
                            <b>Оценка преподавателя:</b> {teacherGrade === null ? "не оценено" : teacherGrade}
                        </Typography>
                    </Paper>
                </Stack>
                {
                    cwDone === true 
                    ?
                        <Alert severity="success" sx={{mt: "12px"}} >
                            <AlertTitle>
                                Работа над ошибками
                            </AlertTitle>
                            Завершено.
                        </Alert>
                    :
                    <>
                        <Divider sx={{mb: "12px", mt: "12px"}}>
                            <Chip color="primary" variant="outlined" label="Работа над ошибками"/>
                        </Divider>
                        <TextField 
                            fullWidth 
                            multiline 
                            rows={6} 
                            value={textWritten} 
                            onChange={(event) => { setTextWritten(event.target.value) }}
                        />
                        <Button 
                            fullWidth
                            sx={{
                                marginTop: "12px"
                            }}
                            color="success" 
                            variant="outlined"
                            onClick={handleSubmit}
                        >
                            Закончить работу над ошибками
                        </Button>
                    </>
                }
                
            </Container>
        </div>
    );
}