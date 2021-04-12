import React from 'react';
import { connect } from 'react-redux';
import { Grid, GridList, GridListTile, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {

    }
});

export const Account = (props) => {
    const classes = useStyles();
    return (
        <>
        <Grid container justify="center" className={classes.root} >
            <Grid item xs={2}>
                <Typography variant='caption' >IMG</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography variant='caption' ># of Posts</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography variant='caption' >Followers</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography variant='caption' >Following</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='body1' >Full Name</Typography>
            </Grid>
            <Grid item  xs={12}>
                <Typography variant='body2' >Description</Typography>
            </Grid>

        </Grid>
        <GridList cols={3}>
            <GridListTile><img src='#' alt={Math.random(324)}/></GridListTile>
            <GridListTile><img src='#' alt={Math.random(324)}/></GridListTile>
            <GridListTile><img src='#' alt={Math.random(324)}/></GridListTile>
            <GridListTile><img src='#' alt={Math.random(324)}/></GridListTile>
            <GridListTile><img src='#' alt={Math.random(324)}/></GridListTile>
            <GridListTile><img src='#' alt={Math.random(324)}/></GridListTile>
            <GridListTile><img src='#' alt={Math.random(324)}/></GridListTile>
            <GridListTile><img src='#' alt={Math.random(324)}/></GridListTile>
            <GridListTile><img src='#' alt={Math.random(324)}/></GridListTile>
            <GridListTile><img src='#' alt={Math.random(324)}/></GridListTile>
            <GridListTile><img src='#' alt={Math.random(324)}/></GridListTile>
            <GridListTile><img src='#' alt={Math.random(324)}/></GridListTile>
            <GridListTile><img src='#' alt={Math.random(324)}/></GridListTile>
            <GridListTile><img src='#' alt={Math.random(324)}/></GridListTile>
            <GridListTile><img src='#' alt={Math.random(324)}/></GridListTile>
            <GridListTile><img src='#' alt={Math.random(324)}/></GridListTile>
        </GridList>
        </>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)
