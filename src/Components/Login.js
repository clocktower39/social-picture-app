import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { loginUser } from "../Redux/actions";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "25px 0",
    textAlign: "center",
  },
  textField: {
    margin: "12px",
  },
  button: {},
}));

export const Login = (props) => {
  const classes = useStyles();
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
      dispatch(loginUser(JSON.stringify({ username: username, password: password }))).then((res) => {
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
    <Container maxWidth="sm">
      <Grid container className={classes.root} component={Paper} spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Log in
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            color="secondary"
            error={error === true ? true : false}
            helperText={error === true ? "Please enter your username" : false}
            className={classes.textField}
            label="username"
            value={username}
            onKeyDown={(e) => handleKeyDown(e)}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            color="secondary"
            error={error === true ? true : false}
            helperText={error === true ? "Please enter your password" : false}
            className={classes.textField}
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
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={(e) => handleLoginAttempt(e)}
            disabled={disableButtonDuringLogin}
          >
            Login
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
