import React, { useState }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField, Grid, Paper, makeStyles } from '@material-ui/core';
import { Link, Redirect } from 'react-router-dom';
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

export const Login = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const redirect = useSelector(state => state.authenticated)
    const [error, setError] = useState(false);
    const [authenticated] = useState(localStorage.getItem('authenticated'));
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

        dispatch(loginUser(loginAttempt));
    }

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
            <Grid item xs={12}>
                <Link to='./signup'>
                    Need an Account?
                </Link>
            </Grid>
        </Grid>
    )
}

export default Login
