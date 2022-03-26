import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { FormControl, Select, InputLabel, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import MultipleChoiceList from './MultipleChoiceList';

export default function TeacherAddNewWorkStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [workType, setWorkType] = React.useState("Сочинение");
  const [workName, setWorkName] = React.useState("");
  const [taskText, setTaskText] = React.useState("");
  const [taskTopic, setTaskTopic] = React.useState("");
  const [taskAudio, setTaskAudio] = React.useState(0);
  const [groupsSelected, setGroupsSelected] = React.useState([]);
  const [groups, setGroups] = React.useState([]);

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

  const getAllGroups = () => {
    axios.get("/group/get-all-groups")
    .then((response) => {
        let groupNames = new Array();
        response.data.groups.map(
          (item) => {
            groupNames.push(item["group_name"]);
          }
        )
        
        setGroups(groupNames);
    });
  }

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
    for (var i = 0; i < groupsSelected.length; i++) {
      formData.append("groupsSelected[]", groupsSelected[i]);
    }

    axios.post(
      "/work/add-new-work",
      formData
    );
  }

  React.useEffect(() => {
    getAllGroups();
  }, [])

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <React.Fragment>
              <Typography variant="h6" gutterBottom>
                  Выберите название работы
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField 
                    label="Название работы" 
                    variant="standard"
                    onChange={handleName}
                    value={workName}
                  />
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
          </React.Fragment>
        );
      case 1:
        return (
          <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Выберите тип работы
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
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
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div>
                <Button
                  variant='outlined'
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Назад
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Продолжить
                </Button>
              </div>
            </Box>
          </React.Fragment>
        );
      case 2:
        return (
          <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Добавьте тему сочинения
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  id="filled-multiline-static"
                  label="Тема сочинения"
                  multiline
                  rows={2}
                  variant="filled"
                  value={taskTopic}
                  onChange={handleTaskTopic}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div>
                <Button
                  variant='outlined'
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Назад
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Продолжить
                </Button>
              </div>
            </Box>
          </React.Fragment>
        );
      case 3:
        return (
          <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Добавьте текст диктанты и файл с видеозаписью
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
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
              </Grid>
              <Grid item xs={12} md={6}>
                <h5>Также, выберите файл с аудиозаписью.</h5>
                <input type="file" onChange={handleAudio}/>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div>
                <Button
                  variant='outlined'
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Назад
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Продолжить
                </Button>
              </div>
            </Box>
          </React.Fragment>
        )
      case 4:
        return (
          <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Добавьте файл с данными
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MultipleChoiceList 
                  names={groups} 
                  personName={groupsSelected}
                  setPersonName={setGroupsSelected}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div>
                <Button
                  variant='outlined'
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Назад
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Продолжить
                </Button>
              </div>
            </Box>
          </React.Fragment>
        )
      case 5:
        return (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>Настройка закончена.</Typography>
            <Button variant='outlined' onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Сбросить
            </Button>
            <Button variant='outlined' onClick={handleSubmit} sx={{ mt: 1, mr: 1 }}>
              Добавить работу
            </Button>
          </Paper>
        )
      default:
        throw new Error('Unknown step');
    }
  }

  return (
    <Box sx={{ maxWidth: 1000 }}>
      <Stepper sx={{ pt: 3, pb: 5 }} activeStep={activeStep} orientation="horizontal">
        <Step key={"123"}>
            <StepLabel>
              Название
            </StepLabel>
        </Step>
        <Step key={"Выберите тип"}>
            <StepLabel>
              Тип 
            </StepLabel>
        </Step>
        <Step key={"Выбрать тему сочинения"}>
          <StepLabel>
            Тема
          </StepLabel>
        </Step>
        <Step key={"Выбрать текст диктанта"}>
          <StepLabel>
            Текст
          </StepLabel>
        </Step>
        <Step key={""}>
          <StepLabel>
            Группы
          </StepLabel>
        </Step>
        <Step key={""}>
          <StepLabel>
            Конец
          </StepLabel>
        </Step>
      </Stepper>
      {getStepContent(activeStep)}
    </Box>
  );
}