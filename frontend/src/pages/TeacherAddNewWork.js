import { Container, Box, Typography, Card } from "@mui/material";
import TeacherAddNewWorkStepper from "../components/TeacherAddNewWorkStepper";
import TeacherLeftBar from "../components/TeacherLeftBar";
import React from "react";

export default function TeacherAddNewWork() {
    return (
        <div>
        <TeacherLeftBar/>
        <Container component="main" maxWidth="md">
            <Card
                variant="outlined"
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <div style={{margin: "24px"}}>
                    <Typography component="h1" variant="h5">
                        Создать новую работу
                    </Typography>
                    <TeacherAddNewWorkStepper/>
                </div>
            </Card>
        </Container>
        </div>
    )
}