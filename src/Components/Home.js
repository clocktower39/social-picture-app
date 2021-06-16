import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts, likePost, removeLikeFromPost } from "../Redux/actions";
import Loading from "./Loading";
import {
  Avatar,
  Button,
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
import { Favorite, Share, ExpandMore, MoreVert } from "@material-ui/icons";
import { red } from "@material-ui/core/colors";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: "75px",
  },
  gridContainer: {
    scrollBehavior: "smooth",
  },
  cardRoot: {},
  media: {
    height: 0,
    paddingTop: "100%",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export const Home = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts);
  const [expanded, setExpanded] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [toggle, setToggle] = React.useState(true);

  useEffect(() => {
    dispatch(getPosts([...user.following, user.username])).then(() => {
      setLoading(false);
    });
    // eslint-disable-next-line
  }, [toggle]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Container maxWidth="sm" className={classes.root} disableGutters>
      <Grid
        justify="center"
        container
        spacing={3}
        className={classes.gridContainer}
      >
        <Grid item xs={12}>
          <Typography variant="h5">Social Photo App</Typography>
        </Grid>

        {loading ? (
          <Loading />
        ) : posts.length >= 1 ? (
          posts.map((post, index) => {
            return (
              <Grid item xs={12} key={index}>
                <Card className={classes.cardRoot}>
                  <CardHeader
                    avatar={
                      <Avatar
                        aria-label="recipe"
                        className={classes.avatar}
                        alt="Profile Pic"
                        src={post.user.profilePic}
                      />
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MoreVert />
                      </IconButton>
                    }
                    title={post.user.username}
                    subheader={post.location}
                  />
                  <CardMedia className={classes.media} image={post.src} />
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      <strong>{post.user.username}: </strong>
                      {post.description}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <IconButton
                      aria-label="add to favorites"
                      onClick={() => {
                        post.likes
                          ? post.likes.includes(user.username)
                            ? dispatch(removeLikeFromPost(post))
                            : dispatch(likePost(post))
                          : alert("add likes array to post");
                      }}
                    >
                      <Favorite
                        style={
                          post.likes
                            ? post.likes.includes(user.username)
                              ? { color: "red" }
                              : null
                            : null
                        }
                      />
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
                  <CardContent>
                    <Typography variant="body1">Likes: {(post.likes)?post.likes.length: 0}</Typography>
                  </CardContent>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Typography paragraph>Comments:</Typography>
                    </CardContent>
                  </Collapse>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Button onClick={() => setToggle(!toggle)}>Refresh</Button>
        )}
      </Grid>
    </Container>
  );
};

export default Home;
