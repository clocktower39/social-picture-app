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
import { ModeComment, ExpandMore, Favorite, Share, MoreVert } from "@mui/icons-material";

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

const CommentSection = ({ post, user, expanded, handleExpandClick }) => {

  const CommentCard = ({ comment, firstComment = false }) => (
    <Grid container spacing={1}>
      <Grid item xs={1}>
        <Avatar
          aria-label="recipe"
          sx={classes.avatarComment}
          alt={comment.user.username}
          src={comment.user.profilePicture ? `${serverURL}/user/profilePicture/${comment.user.profilePicture}` : null}
        />
      </Grid>
      <Grid item xs={10}>
        <Typography variant="body1" >
          <strong>{comment.user.username}</strong> {comment.comment}
        </Typography>
      </Grid>
      <Grid container item xs={1} sx={{ justifyContent: 'center' }}>

        {firstComment && (
          <IconButton
            sx={expanded ? { ...classes.expand, ...classes.expandOpen } : { ...classes.expand }}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMore />
          </IconButton>

        )}
      </Grid>
    </Grid>
  )


  return (
    <CardContent>
      {post.comments.slice(0, 1).map((comment, i) => <CommentCard key={`${comment._id}-first`} comment={comment} firstComment={true} />)}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {post.comments.filter((c, i) => i !== 0).map((comment, i) => <CommentCard key={comment._id||i} comment={comment} />)}
        <CommentField post={post} user={user} />
      </Collapse>
    </CardContent>
  )
}

const CommentField = ({ post, user }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");

  const handlePostComment = () => {
    if (comment !== '') {
      dispatch(commentPost(post._id, user, comment));
      setComment('');
    }
  }
  

  return (
    <Grid container alignItems="center" spacing={2} sx={{ marginTop: '5px', }}>
      <Grid item xs={1}>
        <Avatar
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
  )
};

export default function SinglePost(props) {
  const { post, likes, isLiked } = props;
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => setExpanded((prev) => !prev);

  const handleDeleteDialog = () => setDeleteDialog((prev) => !prev);
  const handleMenu = (event) => setOpenMenu(prev => {
    !prev ? setAnchorEl(event.currentTarget) : setAnchorEl(null);
    return !prev;
  });

  const handleLikePost = () => dispatch(likePost(post._id, user));
  const handleUnlikePost = () => dispatch(unlikePost(post._id, user));
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
          <IconButton aria-label="comments" onClick={handleExpandClick} >
            <ModeComment />
          </IconButton>
          <IconButton aria-label="share">
            <Share />
          </IconButton>
        </CardActions>
        <Typography variant="body2" color="textSecondary" sx={{ padding: '0 16px' }}>
          Likes: {likes ? likes.length : 0}
        </Typography>
        <CommentSection post={post} user={user} expanded={expanded} handleExpandClick={handleExpandClick} />
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
