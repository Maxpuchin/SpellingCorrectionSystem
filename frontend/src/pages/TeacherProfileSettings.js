import React from "react";
import TeacherLeftBar from "../components/TeacherLeftBar";
import { Container, Box } from "@mui/material";

export default function TeacherProfileSettings() {
    return (
        <div>
            <TeacherLeftBar/>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                </Box>
            </Container>
        </div>
    )
}