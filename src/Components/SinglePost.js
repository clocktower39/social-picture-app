import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { serverURL, likePost, unlikePost, commentPost, deletePost, } from "../Redux/actions";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Favorite, Share, MoreVert } from "@mui/icons-material";

const classes = {
  media: {
    height: 0,
    paddingTop: "100%",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
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
};

const CommentSection = ({ post }) => {

  return (
    <CardContent>
      {post.comments.map((comment, i) => (
        <Grid container key={`${comment.comment}-${comment.user._id}-${i}`}>
          <Grid item xs={1}>
            <Avatar
              aria-label="recipe"
              sx={classes.avatarComment}
              alt={comment.user.username}
              src={comment.user.profilePicture ? `${serverURL}/user/profilePicture/${comment.user.profilePicture}` : null}
            />
          </Grid>
          <Grid item xs={11}>
            <Typography key={i} variant="body1" component="p">
              <strong>{comment.user.username}</strong> {comment.comment}
            </Typography>
          </Grid>
        </Grid>
      ))}
    </CardContent>
  )
}

export default function SinglePost(props) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { post, likes, isLiked } = props;

  const handleDeleteDialog = () => setDeleteDialog((prev) => !prev);
  const handleMenu = (event) => setOpenMenu(prev => {
    !prev ? setAnchorEl(event.currentTarget) : setAnchorEl(null);
    return !prev;
  });

  const handleLikePost = () => dispatch(likePost(post._id, user));
  const handleUnlikePost = () => dispatch(unlikePost(post._id, user));
  const handlePostComment = () => {
    if (comment !== '') {
      dispatch(commentPost(post._id, user, comment));
      setComment('');
    }
  }
  const handleConfirmDelete = () => {
    dispatch(deletePost(post._id, post.image)).then(() => setDeleteDialog(false));
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          avatar={
            <Avatar
              sx={classes.avatar}
              alt="Profile Picture"
              src={post.user.profilePicture ? `${serverURL}/user/profilePicture/${post.user.profilePicture}` : null}
              component={Link}
              to={`/profile/${post.user.username}`}
            />
          }
          action=
          {<>
            <IconButton aria-label="settings" onClick={handleMenu} >
              <MoreVert />
            </IconButton>
            <Menu
              open={openMenu}
              onClose={handleMenu}
              anchorEl={anchorEl}
              PaperProps={{
                style: {
                  width: '20ch',
                },
              }}
            >
              <MenuItem onClick={null} disabled >
                Share
              </MenuItem>
              <MenuItem onClick={null} disabled >
                Report
              </MenuItem>
              {
                post.user._id === user._id &&
                <MenuItem onClick={handleDeleteDialog}>
                  Delete
                </MenuItem>
              }
            </Menu>
          </>
          }
          title={post.user.username}
          subheader={post.location}
        />
        <CardMedia sx={classes.media} image={post.image ? `${serverURL}/post/image/${post.image}` : null} />
        <CardActions disableSpacing>
          {
            isLiked
              ?
              <IconButton aria-label="unlike" onClick={handleUnlikePost} >
                <Favorite
                  sx={{ color: 'red', }}
                />
              </IconButton>
              :
              <IconButton aria-label="like" onClick={handleLikePost} >
                <Favorite />
              </IconButton>
          }
          <IconButton aria-label="share">
            <Share />
          </IconButton>
        </CardActions>
        <Typography variant="body2" color="textSecondary" sx={{ padding: '0 16px' }}>
          Likes: {likes ? likes.length : 0}
        </Typography>
        <CommentSection post={post} />
        <CardContent>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={1}>
              <Avatar
                aria-label="recipe"
                sx={classes.avatarComment}
                alt={user.username}
                src={user.profilePicture ? `${serverURL}/user/profilePicture/${user.profilePicture}` : null}
              />
            </Grid>
            <Grid item xs={11}>
              <TextField
                label="Add a comment..."
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <Button
                      variant="contained"
                      onClick={handlePostComment}
                    >
                      Submit
                    </Button>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Dialog
        open={deleteDialog}
        onClose={handleDeleteDialog}
      >
        <DialogTitle >
          {"Are you sure you want to delete this post?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This post will be deleted immediately.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeleteDialog}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
