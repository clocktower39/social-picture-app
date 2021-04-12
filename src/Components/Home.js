import React from 'react';
import { connect } from 'react-redux';
import { GridList, GridListTile, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {

    }
})
export const Home = (props) => {
    const classes = useStyles();

    return (
        <>
            <Typography variant={'h3'}>Social Photo App</Typography>
            <GridList className={classes.root} cols={2}>
                <GridListTile cols={2}><img src='#' alt={Math.random(324).toFixed(2)}/></GridListTile>
                <GridListTile cols={2}><img src='#' alt={Math.random(324).toFixed(2)}/></GridListTile>
            </GridList>
        </>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
