import React from "react";
import TeacherLeftBar from "../components/TeacherLeftBar";
import { Container, Box } from "@mui/material";

export default function TeacherPage() {
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