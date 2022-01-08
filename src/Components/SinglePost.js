import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { likePost, removeLikeFromPost, commentOnPost } from "../Redux/actions";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Favorite, Share, ExpandMore, MoreVert } from "@mui/icons-material";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
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
    backgroundColor: '#F44336',
  },
  avatarComment: {
    height: "25px",
    width: "25px",
  },
}));

export default function SinglePost(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector((state) => state.user);
  const [comment, setComment] = React.useState("");
  const [expanded, setExpanded] = React.useState(false);
  const post = props.post;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Grid item xs={12} key={props.index}>
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
          <Typography variant="body2" color="textSecondary" component="p">
            Likes: {post.likes ? post.likes.length : 0}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            <strong>{post.user.username}: </strong>
            {post.description}
          </Typography>
        </CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Comments:</Typography>
            {post.comments.map((comment, i) => (
              <Grid container>
              <Grid item xs={1}>
                <Avatar
                  aria-label="recipe"
                  className={classes.avatarComment}
                  alt={comment.username}
                  src={comment.username}
                />
              </Grid>
                <Grid item xs={11}>
                  <Typography key={i} variant="body1" component="p">
                    <strong>{comment.username}</strong> {comment.remark}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </CardContent>
        </Collapse>
        <CardContent>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={1}>
              <Avatar
                aria-label="recipe"
                className={classes.avatarComment}
                alt={user.username}
                src={user.profilePic}
              />
            </Grid>
            <Grid item xs={9}>
              <TextField
                label="Add a comment..."
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Grid>

            <Grid item xs={2}>
              <Button
                variant="contained"
                onClick={() =>
                  dispatch(
                    commentOnPost(post, {
                      remark: comment,
                      username: user.username,
                    })
                  ).then(() => setComment(""))
                }
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}
