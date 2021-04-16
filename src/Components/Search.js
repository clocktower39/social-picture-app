import React, { useState, useEffect }  from 'react';
import { connect } from 'react-redux'
import { Container, Grid, TextField, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
    },
});

export const Search = (props) => {
    const classes = useStyles();
    const [opacity, setOpacity] = useState(0);

    useEffect(()=>{
        setOpacity(opacity+0.05)
        // eslint-disable-next-line
    },[opacity]);
    
    return (
        <Container disableGutters maxWidth='sm' className={classes.root} style={{opacity}}>
            <Grid container>
                <Grid item xs={12}>
                    <TextField fullWidth label='Search' />
                </Grid>
                    {/* pull X random users then a random post from them */}
            </Grid>
        </Container>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
