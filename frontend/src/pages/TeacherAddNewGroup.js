import React, { useEffect, useState } from "react";
import TeacherLeftBar from "../components/TeacherLeftBar";
import { Container, Card, TextField, Typography } from "@mui/material";
import axios from "axios";
import MultipleChoiceList from "../components/MultipleChoiceList";

export default function TeacherAddNewGroup() {
    const [names, setNames] = useState([]);

    useEffect(() => {
        axios.get("/group/get-all-students").then(
            (response) => {
                let names_ = response.data.users.map((user) => {
                    return user.login + " (" + user.first_name + " " + user.last_name + ")";
                });
                setNames(names_);
            }
        )
    })

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
                    <div style={{margin: "24px", textAlign: "center"}}>
                        <Typography component="h1" variant="h5">
                            Создать новую группу
                        </Typography>
                        <h4>
                            Название группы
                        </h4>
                        <TextField 
                            id="standard-basic" 
                            label="Название группы" 
                            variant="outlined" 
                            style={{width: 400}}
                        />
                        <h4>
                            Добавить участников
                        </h4>
                        <MultipleChoiceList names={names}/>
                    </div>
                </Card>
            </Container>
        </div>
    )
}