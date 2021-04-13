import React from 'react';
import { connect } from 'react-redux';
import { Grid, GridList, GridListTile, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        maxWidth: '700px',
    },
    imgList: {
        paddingBottom: '56px',
    },
    profilePic:{
        borderRadius: '50%',
        scale: 0.5,
    },
});

export const Account = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.root} >
            <Grid container justify="center">
                <Grid item xs={12}>
                    <Typography variant='h4' >{props.user.username}</Typography>
                    <br />
                </Grid>
                <Grid item xs={4}>
                    <img className={classes.profilePic} src="https://instagram.fphx1-1.fna.fbcdn.net/v/t51.2885-19/s150x150/28766400_217879322124728_5210140121432588288_n.jpg?tp=1&_nc_ht=instagram.fphx1-1.fna.fbcdn.net&_nc_ohc=No_5BMqsMDcAX9fbb6S&edm=ABfd0MgAAAAA&ccb=7-4&oh=c65376028aa13c54926ea384d55c5650&oe=609C3AAF&_nc_sid=7bff83" alt="profile pic" />
                </Grid>
                <Grid item xs={2}>
                    <Typography variant='body2' align='center'>{props.user.posts.length}<br/>Posts</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant='body2' align='center'>{props.user.followers.length}<br/>Followers</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant='body2' align='center'>{props.user.following.length}<br/>Following</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='body1'>{props.user.firstName} {props.user.lastName}</Typography>
                </Grid>
                <Grid item  xs={12}>
                    <Typography variant='body2'>{props.user.description}</Typography>
                </Grid>

            </Grid>
            <GridList cols={3} className={classes.imgList}>
                {props.user.posts.map((post, index) => <GridListTile cols={1} key={index}><img src={post} alt={Math.random(1)}/></GridListTile> )}
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
