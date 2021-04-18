import React, { useState, useEffect }  from 'react';
import { connect, useDispatch } from 'react-redux';
import { Button, Container, Grid, CardMedia, Typography, makeStyles } from '@material-ui/core';
import { logoutUser } from '../Redux/actions';

const useStyles = makeStyles({
    root: {
        maxWidth: '700px',
    },
    imgList: {
        paddingBottom: '56px',
    },
    profilePic:{
        borderRadius: '50%',
    },
    media: {
      height: 0,
      paddingTop: '100%',
    },
});

export const Account = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [opacity, setOpacity] = useState(0);

    useEffect(()=>{
        setOpacity(opacity+0.05)
        // eslint-disable-next-line
    },[opacity]);

    const handleLogout = () => {
        dispatch(logoutUser());
        localStorage.removeItem('username');
        localStorage.setItem('authenticated', false);
    }

    return (
        <Container disableGutters maxWidth='sm' className={classes.root} style={{opacity}}>
            <Grid container justify="center" spacing={1} >
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
                <Grid item  xs={6}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={()=> null}
                    >EDIT</Button>
                </Grid>
                <Grid item  xs={6}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={()=>handleLogout()}
                    >LOGOUT</Button>
                </Grid>
                
                {/* list all posts from account */}
                <Grid container item xs={12}>
                    {props.user.posts.map((post, item) => {
                        return(
                            <Grid item xs={4}>
                                <CardMedia className={classes.media} image={post}/>
                            </Grid>
                        );
                    })}
                </Grid>
            </Grid>
        </Container>
    )
}

const mapStateToProps = (state) => ({
    user: state.user,
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)
