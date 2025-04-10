import React, { useState }  from 'react';
import { useDispatch } from 'react-redux';
import { Link, Navigate} from 'react-router-dom';
import { Button, TextField, Grid, Paper } from '@mui/material';
import { signupUser } from '../Redux/actions';

const classes = {
    root: {
        padding: '75px 0',
        textAlign: 'center',
    },
    textField: {
        margin: '12px',
    },
    button: {
    },

  };

export const Signup = (props) => {
    const dispatch = useDispatch();

    const [redirect, setRedirect] = useState(false);
    const [ username, setUsername ] = useState('');
    const [ firstName, setFirstName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

    const [ usernameError, setUsernameError ] = useState('');
    const [ firstNameError, setFirstNameError ] = useState('');
    const [ lastNameError, setLastNameError ] = useState('');
    const [ emailError, setEmailError ] = useState('');
    const [ passwordError, setPasswordError ] = useState('');
    const [ confirmPasswordError, setConfirmPasswordError ] = useState('');

    const handleSignupAttempt = (e) => {
        let signupAttempt = JSON.stringify({username, firstName, lastName, email, password });

        dispatch(signupUser(signupAttempt)).then((e)=>{
            if(e.type === "ERROR"){
                setUsernameError(e.error.username);
                setFirstNameError(e.error.firstName);
                setLastNameError(e.error.lastName);
                setEmailError(e.error.email);
                setPasswordError(e.error.password);
                setConfirmPasswordError(e.error.password);
            }
            else {
                setRedirect(true);
            }
        });
    }
    const handleChange = (e, setter) => {
        setter(e.target.value)
    }
    if(redirect){
        return <Navigate to={'/login'} />
    }
    return (
        <Grid container spacing={3} sx={classes.root}>
            <Grid size={12}>
                <Paper>
                <TextField
                error={usernameError}
                helperText={usernameError}
                sx={classes.textField}
                label="Username"
                value={username}
                onChange={(e) => handleChange(e, setUsername)}
                />
                </Paper>
            </Grid>
            <Grid size={12}>
                <Paper>
                <TextField
                error={firstNameError}
                helperText={firstNameError}
                sx={classes.textField}
                label="First Name"
                value={firstName}
                onChange={(e) => handleChange(e, setFirstName)}
                />
                </Paper>
            </Grid>
            <Grid size={12}>
                <Paper>
                <TextField
                error={lastNameError}
                helperText={lastNameError}
                sx={classes.textField}
                label="Last Name"
                value={lastName}
                onChange={(e) => handleChange(e, setLastName)}
                />
                </Paper>
            </Grid>
            <Grid size={12}>
                <Paper>
                <TextField
                error={emailError}
                helperText={emailError}
                sx={classes.textField}
                label="Email"
                type="email"
                value={email}
                onChange={(e) => handleChange(e, setEmail)}
                />
                </Paper>
            </Grid>
            <Grid size={12}>
                <Paper>
                <TextField
                error={passwordError}
                helperText={passwordError}
                sx={classes.textField}
                label="Password"
                value={password}
                type="password"
                onChange={(e) => handleChange(e, setPassword)}
                />
                </Paper>
            </Grid>
            <Grid size={12}>
                <Paper>
                <TextField
                error={confirmPasswordError}
                helperText={confirmPasswordError}
                sx={classes.textField}
                label="Confirm Password"
                value={confirmPassword}
                type="password"
                onChange={(e) => handleChange(e, setConfirmPassword)}
                />
                </Paper>
            </Grid>
            <Grid size={12}>
                <Button
                variant="contained"
                color="primary"
                sx={classes.button}
                onClick={(e) => handleSignupAttempt(e)}
                >
                Sign up
                </Button>
            </Grid>
            <Grid size={12}>
                <Link to='./login'>
                    Already have an Account?
                </Link>
            </Grid>
        </Grid>
    )
}


export default Signup
