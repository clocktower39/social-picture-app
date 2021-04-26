import React, { useState }  from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, Redirect} from 'react-router-dom';
import { Button, TextField, Grid, Paper, makeStyles } from '@material-ui/core';
import { signupUser } from '../Redux/actions';

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

export const Signup = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [error] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [ username, setUsername ] = useState('');
    const [ firstName, setFirstName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

    const handleSignupAttempt = (e) => {
        let signupAttempt = JSON.stringify({username, firstName, lastName, email, password });

        dispatch(signupUser(signupAttempt)).then((e)=>{
            console.log(e)
            setRedirect(false)
        });
    }
    const handleChange = (e, setter) => {
        setter(e.target.value)
    }
    if(redirect){
        return <Redirect to={'/login'} />
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
                onChange={(e) => handleChange(e, setUsername)}
                />
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                <TextField
                error={error === true ? true : false}
                helperText={error === true ? "Please enter your first name" : false}
                className={classes.textField}
                label="First Name"
                value={firstName}
                onChange={(e) => handleChange(e, setFirstName)}
                />
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                <TextField
                error={error === true ? true : false}
                helperText={error === true ? "Please enter your last name" : false}
                className={classes.textField}
                label="Last Name"
                value={lastName}
                onChange={(e) => handleChange(e, setLastName)}
                />
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                <TextField
                error={error === true ? true : false}
                helperText={error === true ? "Please enter your email" : false}
                className={classes.textField}
                label="Email"
                type="email"
                value={email}
                onChange={(e) => handleChange(e, setEmail)}
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
                onChange={(e) => handleChange(e, setPassword)}
                />
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                <TextField
                error={error === true ? true : false}
                helperText={(error === true)?"Please confirm your password":false}
                className={classes.textField}
                label="Confirm Password"
                value={confirmPassword}
                type="password"
                onChange={(e) => handleChange(e, setConfirmPassword)}
                />
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={(e) => handleSignupAttempt()}
                >
                Sign up
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Link to='./login'>
                    Already have an Account?
                </Link>
            </Grid>
        </Grid>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
