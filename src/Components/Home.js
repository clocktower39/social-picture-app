import React from 'react';
import { connect } from 'react-redux';
import { GridList, GridListTile, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    postList: {
        maxWidth: '700px',
    }
})
export const Home = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.root} >
            <Typography variant={'h3'}>Social Photo App</Typography>
            <GridList className={classes.postList} cols={1}>
                <GridListTile cols={1} rows={3} ><img src='https://wallpapercave.com/wp/wp3788216.jpg' alt={Math.random(1).toFixed(2)}/></GridListTile>
                <GridListTile cols={1} rows={3} ><img src='https://wallpapercave.com/wp/wp3788216.jpg' alt={Math.random(1).toFixed(2)}/></GridListTile>
                <GridListTile cols={1} rows={3} ><img src='https://wallpapercave.com/wp/wp3788216.jpg' alt={Math.random(1).toFixed(2)}/></GridListTile>
                <GridListTile cols={1} rows={3} ><img src='https://wallpapercave.com/wp/wp3788216.jpg' alt={Math.random(1).toFixed(2)}/></GridListTile>
                <GridListTile cols={1} rows={3} ><img src='https://wallpapercave.com/wp/wp3788216.jpg' alt={Math.random(1).toFixed(2)}/></GridListTile>
                <GridListTile cols={1} rows={3} ><img src='https://wallpapercave.com/wp/wp3788216.jpg' alt={Math.random(1).toFixed(2)}/></GridListTile>
                <GridListTile cols={1} rows={3} ><img src='https://wallpapercave.com/wp/wp3788216.jpg' alt={Math.random(1).toFixed(2)}/></GridListTile>
                <GridListTile cols={1} rows={3} ><img src='https://wallpapercave.com/wp/wp3788216.jpg' alt={Math.random(1).toFixed(2)}/></GridListTile>
                <GridListTile cols={1} rows={3} ><img src='https://wallpapercave.com/wp/wp3788216.jpg' alt={Math.random(1).toFixed(2)}/></GridListTile>
                <GridListTile cols={1} rows={3} ><img src='https://wallpapercave.com/wp/wp3788216.jpg' alt={Math.random(1).toFixed(2)}/></GridListTile>
                <GridListTile cols={1} rows={3} ><img src='https://wallpapercave.com/wp/wp3788216.jpg' alt={Math.random(1).toFixed(2)}/></GridListTile>
            </GridList>
        </div>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
