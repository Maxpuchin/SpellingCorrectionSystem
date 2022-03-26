import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        <Link color="inherit">
          Система автоматического исправления опечаток
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

const theme = createTheme();

export default function SignUp() {
  const [error, setError] = React.useState("OK");
  const navigate = useNavigate();

  React.useEffect(() => {
    axios.get("/auth/logout");
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const accountData = ({
      login: data.get('login'),
      password: data.get('password'),
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      isTeacher: data.get("isTeacher") === "on" ? true : false
    });

    if (accountData.login === "" || accountData.password === "" ||
    accountData.firstName === "" || accountData.lastName == "") {
      setError("Не все поля заполнены!");
    } else {
      axios.post(
        "/auth/sign-up",
        accountData
      ).then(
        (resp) => {
          if (resp.data.status !== "OK") {
            setError(resp.data.status);
          } else {
            navigate("/sign-in");
          }
        }
      )
    }

  };
  
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Создать аккаунт
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="firstName"
                  label="Имя (не больше 20 символов)"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="lastName"
                  label="Фамилия (не больше 20 символов)"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="login"
                  label="Имя пользователя (не больше 20 символов)"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Пароль (не больше 20 символов)"
                  type="password"
                  //id="password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox name="isTeacher" color="primary" />}
                  label="Я учитель."
                />
              </Grid>
            </Grid>
            {error !== "OK" &&
              <Alert severity="error">
                {error}
              </Alert>
            }
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Создать аккаунт
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/sign-in" variant="body2">
                  Уже есть аккаунт? Войдите.
                </Link>
              </Grid>
            </Grid>
            
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 5 }} /> */}
      </Container>
    </ThemeProvider>
  );
}