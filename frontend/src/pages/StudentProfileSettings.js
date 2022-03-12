import React from "react";
import StudentLeftBar from "../components/StudentLeftBar";
import { Container, Box } from "@mui/material";

export default function StudentProfileSettings() {
    return (
        <div>
            <StudentLeftBar/>
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