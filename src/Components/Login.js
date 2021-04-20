import React, { useState, useEffect }  from 'react';
import { connect, useDispatch } from 'react-redux';
import { Button, TextField, Grid, Paper, makeStyles } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { loginUser } from '../Redux/actions';

const useStyles = makeStyles({
    root: {
        padding: '75px 0',
        textAlign: 'center',
    },
    textField: {
        margin: '12px',
    },
    button: {
    },

  });

export const Login = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(false);
    const [authenticated, setAuthenticated] = useState(localStorage.getItem('authenticated'));
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [password, setPassword] = useState('');

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            handleLoginAttempt(e);
        }
    }
    const handleLoginAttempt = (e) => {
        //change into post request to login, if successful then dispatch login with returned data
        let loginAttempt = JSON.stringify({username:username, password:password, authenticated: authenticated });
        fetch('http://mattkearns.ddns.net:3000/login', {
            method: 'post',
            dataType: 'json',
            body: loginAttempt,
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          })
          .then(res => res.json())
          .then(data => {
              if(!data.authenticated){

              }
              else {
                    dispatch(loginUser(data.user));
                    localStorage.setItem('username', data.user.username);
                    setAuthenticated(data.authenticated);
                    localStorage.setItem('authenticated', data.authenticated);
                    setRedirect(true);
              }
          });
    }

    useEffect(()=>{
        if(username && authenticated){
            handleLoginAttempt();
        }
        // eslint-disable-next-line
    },[])

    if(redirect){
        return <Redirect to={'/'} />
    }
    return (
        <Grid container spacing={3} className={classes.root}>
            <Grid item xs={12}>
                <Paper>
                <TextField
                error={error === true ? true : false}
                helperText={error === true ? "Please enter your username" : false}
                className={classes.textField}
                label="Username"
                value={username}
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(e) => setUsername(e.target.value)}
                />
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                <TextField
                error={error === true ? true : false}
                helperText={(error === true)?"Please enter your password":false}
                className={classes.textField}
                label="Password"
                value={password}
                type="password"
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(e) => {
                    setPassword(e.target.value);
                    (e.target.value === '')?setError(true):setError(false);
                }}
                />
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={(e) => handleLoginAttempt(e)}
                >
                Login
                </Button>
            </Grid>
        </Grid>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
