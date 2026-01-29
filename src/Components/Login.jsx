import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import { loginUser } from "../Redux/actions";

export const Login = (props) => {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [username, setUsername] = useState(
    localStorage.getItem("username") ? localStorage.getItem("username") : ""
  );
  const [password, setPassword] = useState("");
  const [disableButtonDuringLogin, setDisableButtonDuringLogin] = useState(false);
  const user = useSelector((state) => state.user);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLoginAttempt(e);
    }
  };
  const handleLoginAttempt = (e) => {
    if (username && password) {
      setDisableButtonDuringLogin(true);
      dispatch(loginUser({ username: username, password: password })).then((res) => {
        if (res.error) {
          setError(true);
        }
        setDisableButtonDuringLogin(false);
      });
      localStorage.setItem("username", username);
    } else {
      setDisableButtonDuringLogin(false);
      setError(true);
    }
  };

  if (user.username) {
    return <Navigate to={{ pathname: "/" }} />;
  }
  return (
    <Container maxWidth="md" >
      <Paper sx={{ marginTop: "25px", padding: '12.5px 0', textAlign: 'center', height: '85vh', }}>
        <Grid container spacing={2} >
          <Grid size={12}>
            <Typography variant="h4" gutterBottom>
              Log in
            </Typography>
          </Grid>
          <Grid size={12}>
            <TextField
              error={error === true ? true : false}
              helperText={error === true ? "Please enter your email" : false}
              label="Username"
              value={username}
              onKeyDown={(e) => handleKeyDown(e)}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              error={error === true ? true : false}
              helperText={error === true ? "Please enter your password" : false}
              label="Password"
              value={password}
              type="password"
              onKeyDown={(e) => handleKeyDown(e)}
              onChange={(e) => {
                setPassword(e.target.value);
                e.target.value === "" ? setError(true) : setError(false);
              }}
            />
          </Grid>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Button
                variant="contained"
                onClick={(e) => handleLoginAttempt(e)}
                disabled={disableButtonDuringLogin}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Login;
