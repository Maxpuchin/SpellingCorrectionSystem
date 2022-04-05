import { Container, Paper, Typography } from "@mui/material";
import TeacherAddNewWorkStepper from "../components/TeacherAddNewWorkStepper";
import TeacherLeftBar from "../components/TeacherLeftBar";
import React from "react";

export default function TeacherAddNewWork(props) {
    return (
        <>
            <TeacherLeftBar/>
            <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
                <Paper
                    variant="outlined"
                    sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
                >
                    <div style={{margin: "24px"}}>
                        <Typography style={{textAlign: "center"}} component="h1" variant="h5">
                                Создать новую работу
                        </Typography>
                        <TeacherAddNewWorkStepper setStatus={props.setStatus}/>
                    </div>
                    </Paper>
            </Container>
        </>
    )
}