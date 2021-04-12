import React from 'react';
import { connect } from 'react-redux';
import { Grid, GridList, GridListTile, GridListTileBar, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        maxWidth: '700px',
    },
    imgList: {
        paddingBottom: '56px',
    },
});

export const Account = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.root} >
        <Grid container justify="center">
            <Grid item xs={12}>
                <Typography variant='h4' >{props.user.username}</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography variant='body2' >IMG</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography variant='body2' >Posts: <br/>{props.user.posts.length}</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography variant='body2' >Followers: <br/>{props.user.followers.length}</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography variant='body2' >Following: <br/>{props.user.following.length}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='body1' >{props.user.firstName} {props.user.lastName}</Typography>
            </Grid>
            <Grid item  xs={12}>
                <Typography variant='body2' >{props.user.description}</Typography>
            </Grid>

        </Grid>
        <GridList cols={3} className={classes.imgList}>
            {props.user.posts.map((post, index) => <GridListTile cols={1} key={index}><img src={post} alt={Math.random(1)}/><GridListTileBar title={index+1}/></GridListTile> )}
        </GridList>
        </div>
    )
}

const mapStateToProps = (state) => ({
    user: state.user,
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)
