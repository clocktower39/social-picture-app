import React, { useState, useEffect }  from 'react';
// import { useDispatch } from 'react-redux'
import { Button, Container, Grid, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
    },
});

export const Post = (props) => {
    // const dispatch = useDispatch();
    const classes = useStyles();
    const [opacity, setOpacity] = useState(0);

    const uploadImage = () => {

    }

    useEffect(()=>{
        if(opacity<1){
            setOpacity(opacity+0.05);
        }
        // eslint-disable-next-line
    },[opacity]);

    return (
        <Container disableGutters maxWidth='sm' className={classes.root} style={{opacity}}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="body1">Post</Typography>
                    <input type="file" />
                    <Button variant="contained" onClick={uploadImage}>Upload</Button>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Post
