import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { FormControl, Select, InputLabel, MenuItem, TextField } from '@mui/material';
import axios from 'axios';

export default function TeacherAddNewWorkStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [workType, setWorkType] = React.useState("Сочинение");
  const [workName, setWorkName] = React.useState("");
  const [taskText, setTaskText] = React.useState("");
  const [taskTopic, setTaskTopic] = React.useState("");
  const [taskAudio, setTaskAudio] = React.useState(0);

  const handleType = (event) => {
    setWorkType(event.target.value);
  }

  const handleAudio = (event) => {
    setTaskAudio(event.target.files[0]);
  }

  const handleName = (event) => {
    setWorkName(event.target.value);
  }

  const handleTaskText = (event) => {
    setTaskText(event.target.value);
  }

  const handleTaskTopic = (event) => {
    setTaskTopic(event.target.value);
  }
  
  const handleNext = () => {
    if (activeStep == 1 && workType == "Сочинение") {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep == 1 && workType == "Диктант"){
      setActiveStep((prevActiveStep) => prevActiveStep + 2);
    } else if (activeStep == 2) {
      setActiveStep((prevActiveStep) => prevActiveStep + 2);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmit = () => {
    var formData = new FormData();
    formData.append("workType", workType);
    formData.append("workName", workName);
    formData.append("taskText", taskText);
    formData.append("taskTopic", taskTopic);
    formData.append("taskAudio", taskAudio);

    axios.post(
      "/work/add-new-work",
      formData
    );
  }

  return (
    <Box sx={{ maxWidth: 1000 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key={"123"}>
            <StepLabel>
              Выберите название
            </StepLabel>
            <StepContent>
              <TextField 
                label="Название работы" 
                variant="standard"
                onChange={handleName}
                value={workName}
              />
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    disabled={workName === ""}
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Продолжить
                  </Button>
                </div>
              </Box>
            </StepContent>
        </Step>
        <Step key={"Выберите тип"}>
            <StepLabel>
              Выберите тип
            </StepLabel>
            <StepContent>
                <FormControl fullWidth variant="standard">
                    <InputLabel id="demo-simple-select-label">Тип работы</InputLabel>
                    <Select
                        value={workType}
                        onChange={handleType}
                    >
                        <MenuItem value={"Сочинение"}>Сочинение</MenuItem>
                        <MenuItem value={"Диктант"}>Диктант</MenuItem>
                    </Select>
                </FormControl>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Продолжить
                  </Button>
                  <Button
                    variant='outlined'
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Назад
                  </Button>
                </div>
              </Box>
            </StepContent>
        </Step>
        <Step key={"Выбрать тему сочинения"}>
          <StepLabel>
            Выберите тему сочинения
          </StepLabel>
          <StepContent>
            <TextField
              id="filled-multiline-static"
              label="Тема сочинения"
              multiline
              rows={2}
              variant="filled"
              value={taskTopic}
              onChange={handleTaskTopic}
            />
            <Box sx={{ mb: 2 }}>
              <div>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Продолжить
                </Button>
                <Button
                  variant='outlined'
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Назад
                </Button>
              </div>
            </Box>
          </StepContent>
        </Step>
        <Step key={"Выбрать текст диктанта"}>
          <StepLabel>
            Выберите текст диктанта
          </StepLabel>
          <StepContent>
            <h5>Введите файл с текстом диктанта.</h5>
            <TextField
              id="filled-multiline-static"
              label="Текст диктанта"
              multiline
              rows={2}
              variant="filled"
              value={taskText}
              onChange={handleTaskText}
            />
            {/* <input type="file"/> */}
            <h5>Также, выберите файл с аудиозаписью.</h5>
            <input type="file" onChange={handleAudio}/>
            <Box sx={{ mb: 2 }}>
              <div>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Завершить
                </Button>
                <Button
                  variant='outlined'
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Назад
                </Button>
              </div>
            </Box>
          </StepContent>
        </Step>
      </Stepper>
      {activeStep === 4 && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>Настройка закончена.</Typography>
          <Button variant='outlined' onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Сбросить
          </Button>
          <Button variant='outlined' onClick={handleSubmit} sx={{ mt: 1, mr: 1 }}>
            Добавить работу
          </Button>
        </Paper>
      )}
    </Box>
  );
}