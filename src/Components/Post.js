import React from 'react';
// import { useDispatch } from 'react-redux'
import { Button, Container, Grid, Input, makeStyles, TextField } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
    },
});

export const Post = (props) => {
    // const dispatch = useDispatch();
    const classes = useStyles()

    const uploadImage = () => {

    }

    return (
        <Container disableGutters maxWidth='sm' className={classes.root} >
            <Grid container>
                <Grid item xs={12}>
                    <Input type="file" fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Location' fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Description' fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" onClick={uploadImage} fullWidth >Upload</Button>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Post
