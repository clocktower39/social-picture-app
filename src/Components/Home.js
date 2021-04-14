import React, { useState, useEffect }  from 'react';
import { connect } from 'react-redux';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  Container,
  Grid,
  IconButton,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Favorite, Share, ExpandMore, MoreVert } from '@material-ui/icons';
import { red } from '@material-ui/core/colors';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    root:{
        paddingBottom: '75px',
    },
    gridContainer: {
      scrollBehavior:'smooth',
    },
    cardRoot: {
    },
    media: {
      height: 0,
      paddingTop: '100%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
  }));
  

export const Home = (props) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [opacity, setOpacity] = useState(0);

    useEffect(()=>{
        setOpacity(opacity+0.05)
        // eslint-disable-next-line
    },[opacity]);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    return (
        <Container maxWidth='sm' className={classes.root} disableGutters style={{opacity}}>
            <Grid justify="center" container spacing={3} className={classes.gridContainer}>
                <Grid item xs={12}>
                    <Typography variant="h5" >Social Photo App</Typography>
                </Grid>
                
                {props.posts.map((post, index) => {
                    return(
                        <Grid item xs={12}>
                            <Card className={classes.cardRoot}>
                                <CardHeader
                                    avatar={
                                    <Avatar aria-label="recipe" className={classes.avatar} alt='Profile Pic' src={post.user.profilePicSrc} />
                                    }
                                    action={
                                    <IconButton aria-label="settings">
                                        <MoreVert />
                                    </IconButton>
                                    }
                                    title={post.user.username}
                                    subheader={post.location}
                                />
                                <CardMedia
                                    className={classes.media}
                                    image={post.imgSrc}
                                />
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                    {post.description}
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <IconButton aria-label="add to favorites">
                                    <Favorite />
                                    </IconButton>
                                    <IconButton aria-label="share">
                                    <Share />
                                    </IconButton>
                                    <IconButton
                                    className={clsx(classes.expand, {
                                        [classes.expandOpen]: expanded,
                                    })}
                                    onClick={handleExpandClick}
                                    aria-expanded={expanded}
                                    aria-label="show more"
                                    >
                                    <ExpandMore />
                                    </IconButton>
                                </CardActions>
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                    <Typography paragraph>Comments:</Typography>
                                    </CardContent>
                                </Collapse>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        </Container>
    )
}

const mapStateToProps = (state) => ({
    posts: state.posts,    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
