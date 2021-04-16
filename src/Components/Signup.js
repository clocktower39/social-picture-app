import React, { useState }  from 'react';
import { connect } from 'react-redux';
import { Button, TextField, Grid, Paper, makeStyles } from '@material-ui/core';

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
    const [error] = useState(false);

    return (
        <Grid container spacing={3} className={classes.root}>
            <Grid item xs={12}>
                <Paper>
                <TextField
                error={error === true ? true : false}
                helperText={error === true ? "Please enter your username" : false}
                className={classes.textField}
                label="Username"
                value={null}
                onKeyDown={(e) => null}
                onChange={(e) => null}
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
                value={null}
                onKeyDown={(e) => null}
                onChange={(e) => null}
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
                value={null}
                onKeyDown={(e) => null}
                onChange={(e) => null}
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
                value={null}
                onKeyDown={(e) => null}
                onChange={(e) => null}
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
                value={null}
                type="password"
                onKeyDown={(e) => null}
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
                value={null}
                type="password"
                onKeyDown={(e) => null}
                />
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={(e) => null}
                >
                Sign up
                </Button>
            </Grid>
        </Grid>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
