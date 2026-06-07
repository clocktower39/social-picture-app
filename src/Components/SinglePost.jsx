import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  likePost,
  unlikePost,
  commentPost,
  deletePost,
  deleteComment,
} from "../Redux/actions";
import {
  Avatar,
  Box,
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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import { Close, ModeComment, Favorite, Share, MoreVert, Person } from "@mui/icons-material";
import { postImageUrl, profilePictureUrl } from "../api";
import { renderTextWithLinks, formatFullDateTime, extractMentions } from "../utils/text";
import { getFilterCss } from "../filters";

const CaptionText = ({ text }) => {
  const navigate = useNavigate();
  const parts = renderTextWithLinks(text);

  const handleClick = (part) => {
    if (part.type === "hashtag") {
      navigate(`/tag/${part.value}`);
    } else if (part.type === "mention") {
      navigate(`/profile/${part.value}`);
    }
  };

  return (
    <Typography variant="body2" sx={{ padding: "0 16px 8px 16px" }}>
      {parts.map((part, i) =>
        part.type === "text" ? (
          <span key={i}>{part.value}</span>
        ) : (
          <span
            key={i}
            onClick={() => handleClick(part)}
            style={{
              color: part.type === "hashtag" ? "#1976d2" : "#2e7d32",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {part.type === "hashtag" ? `#${part.value}` : `@${part.value}`}
          </span>
        )
      )}
    </Typography>
  );
};

const TagMarker = ({ tag }) => (
  <Box
    sx={{
      position: "absolute",
      left: `${tag.x * 100}%`,
      top: `${tag.y * 100}%`,
      transform: "translate(-50%, -50%)",
      zIndex: 2,
      pointerEvents: "none",
    }}
  >
    <Avatar
      src={profilePictureUrl(tag.user?.profilePicture || tag.profilePicture)}
      sx={{
        width: 32,
        height: 32,
        border: "2px solid white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
      }}
    />
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        top: "100%",
        transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.7)",
        color: "white",
        padding: "2px 8px",
        borderRadius: 1,
        fontSize: 12,
        whiteSpace: "nowrap",
        marginTop: "4px",
      }}
    >
      @{tag.user?.username || tag.username}
    </Box>
  </Box>
);

const CommentText = ({ comment }) => {
  const navigate = useNavigate();
  const parts = renderTextWithLinks(comment.comment);
  return (
    <Typography variant="body2" component="span">
      <strong
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/profile/${comment.user.username}`)}
      >
        {comment.user.username}
      </strong>{" "}
      {parts.map((part, i) =>
        part.type === "text" ? (
          <span key={i}>{part.value}</span>
        ) : (
          <span
            key={i}
            onClick={() =>
              part.type === "hashtag"
                ? navigate(`/tag/${part.value}`)
                : navigate(`/profile/${part.value}`)
            }
            style={{
              color: part.type === "hashtag" ? "#1976d2" : "#2e7d32",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {part.type === "hashtag" ? `#${part.value}` : `@${part.value}`}
          </span>
        )
      )}
    </Typography>
  );
};

const CommentCard = ({ comment, postId, postOwnerId, currentUser, dispatch }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const isCommentOwner = currentUser._id === comment.user._id;
  const isPostOwner = currentUser._id === postOwnerId;
  const canDelete = isCommentOwner || isPostOwner;

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid size={1}>
        <Avatar
          sx={{ height: 28, width: 28 }}
          alt={comment.user.username}
          src={profilePictureUrl(comment.user.profilePicture)}
        />
      </Grid>
      <Grid size={canDelete ? 10 : 12}>
        <CommentText comment={comment} />
        <Typography variant="caption" color="text.secondary" display="block">
          {formatFullDateTime(comment.createdAt || comment.timestamp)}
          {comment.likes && comment.likes.length > 0 && ` · ${comment.likes.length} likes`}
        </Typography>
      </Grid>
      {canDelete && (
        <Grid size={1}>
          <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <MoreVert fontSize="small" />
          </IconButton>
          <Menu
            open={Boolean(menuAnchor)}
            anchorEl={menuAnchor}
            onClose={() => setMenuAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={() => {
                dispatch(deleteComment(postId, comment._id));
                setMenuAnchor(null);
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </Grid>
      )}
    </Grid>
  );
};

const CommentField = ({ post, user }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");

  const handlePostComment = () => {
    if (comment.trim() === "") return;
    const mentions = extractMentions(comment);
    dispatch(commentPost(post._id, user, comment, mentions));
    setComment("");
  };

  return (
    <Grid container alignItems="center" spacing={2} sx={{ marginTop: "5px" }}>
      <Grid size={1}>
        <Avatar
          sx={{ height: 28, width: 28 }}
          alt={user.username}
          src={profilePictureUrl(user.profilePicture)}
        />
      </Grid>
      <Grid size={11}>
        <TextField
          label="Add a comment..."
          placeholder="Use @username to mention someone"
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handlePostComment();
            }
          }}
          InputProps={{
            endAdornment: (
              <Button variant="contained" size="small" onClick={handlePostComment}>
                Post
              </Button>
            ),
          }}
        />
      </Grid>
    </Grid>
  );
};

const CommentSection = ({ post, user, expanded, handleExpandClick }) => {
  const dispatch = useDispatch();
  if (!post.comments) return null;
  const first = post.comments[0];
  const rest = post.comments.slice(1);

  return (
    <CardContent sx={{ paddingBottom: "8px !important" }}>
      {post.caption && <CaptionText text={post.caption} />}
      {first && (
        <CommentCard
          comment={first}
          postId={post._id}
          postOwnerId={post.user._id}
          currentUser={user}
          dispatch={dispatch}
        />
      )}
      {post.comments.length > 1 && (
        <Box sx={{ display: "flex", alignItems: "center", mt: 0.5, ml: 6 }}>
          <Button size="small" onClick={handleExpandClick}>
            {expanded
              ? "Hide comments"
              : `View all ${post.comments.length} comments`}
          </Button>
        </Box>
      )}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 1 }}>
          {rest.map((c, i) => (
            <Box key={c._id || i} sx={{ mt: 1 }}>
              <CommentCard
                comment={c}
                postId={post._id}
                postOwnerId={post.user._id}
                currentUser={user}
                dispatch={dispatch}
              />
            </Box>
          ))}
          <CommentField post={post} user={user} />
        </Box>
      </Collapse>
      {!expanded && post.comments.length === 1 && (
        <Box sx={{ mt: 1 }}>
          <CommentField post={post} user={user} />
        </Box>
      )}
    </CardContent>
  );
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const LikesDialog = ({ open, onClose, likes }) => {
  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition}>
      <Grid container sx={{ padding: "12px" }}>
        <Grid size={3}>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Grid>
        <Grid size={6}>
          <Typography variant="h6" textAlign="center">Likes</Typography>
        </Grid>
        <Grid size={3} />
      </Grid>
      <DialogContent>
        {(!likes || likes.length === 0) ? (
          <Typography color="text.secondary" textAlign="center" sx={{ padding: "32px 0" }}>
            No likes yet
          </Typography>
        ) : (
          <List>
            {likes.map((u) => (
              <ListItem
                key={u._id}
                component={Link}
                to={`/profile/${u.username}`}
                onClick={onClose}
                sx={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemAvatar>
                  <Avatar src={profilePictureUrl(u.profilePicture)} />
                </ListItemAvatar>
                <ListItemText
                  primary={u.username}
                  secondary={u.firstName ? `${u.firstName} ${u.lastName || ""}` : null}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default function SinglePost({ post, isLiked, onClose }) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [likesOpen, setLikesOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!post) return null;

  const handleLikesOpen = () => setLikesOpen(true);
  const handleLikesClose = () => setLikesOpen(false);
  const handleDeleteDialog = () => setDeleteDialog((p) => !p);
  const handleExpandClick = () => setExpanded((p) => !p);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };
  const handleCloseMenu = () => {
    setOpenMenu(false);
    setAnchorEl(null);
  };

  const handleLikePost = () => dispatch(likePost(post._id, user));
  const handleUnlikePost = () => dispatch(unlikePost(post._id, user));
  const handleConfirmDelete = () => {
    dispatch(deletePost(post._id, post.image?._id || post.image)).then(() => {
      setDeleteDialog(false);
      onClose?.();
    });
  };

  const imageId = post.image?._id || post.image;
  const tags = post.tags || [];
  const likesCount = post.likes ? post.likes.length : 0;

  return (
    <Grid size={12}>
      <Card>
        <CardHeader
          avatar={
            <Avatar
              alt={post.user.username}
              src={profilePictureUrl(post.user.profilePicture)}
              component={Link}
              to={`/profile/${post.user.username}`}
            />
          }
          action={
            <>
              <IconButton aria-label="settings" onClick={handleOpenMenu}>
                <MoreVert />
              </IconButton>
              <Menu
                open={openMenu}
                onClose={handleCloseMenu}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{ style: { width: "20ch" } }}
              >
                <MenuItem onClick={handleCloseMenu} disabled>
                  Share
                </MenuItem>
                <MenuItem onClick={handleCloseMenu} disabled>
                  Report
                </MenuItem>
                {post.user._id === user._id && (
                  <MenuItem
                    onClick={() => {
                      setOpenMenu(false);
                      setAnchorEl(null);
                      setDeleteDialog(true);
                    }}
                  >
                    Delete
                  </MenuItem>
                )}
              </Menu>
            </>
          }
          title={
            <Box component={Link} to={`/profile/${post.user.username}`} sx={{ color: "inherit", textDecoration: "none" }}>
              {post.user.username}
            </Box>
          }
          subheader={post.location || formatFullDateTime(post.timestamp)}
        />
        <Box sx={{ position: "relative" }}>
          <CardMedia
            sx={{
              height: 0,
              paddingTop: "100%",
              backgroundSize: "cover",
              filter: getFilterCss(post.filter),
            }}
            image={imageId ? postImageUrl(imageId) : null}
          />
          {tags.map((tag, i) => (
            <TagMarker key={i} tag={tag} />
          ))}
        </Box>
        {tags.length > 0 && (
          <Box sx={{ padding: "8px 16px 0" }}>
            <Typography variant="body2" color="text.secondary">
              <Person sx={{ fontSize: 14, verticalAlign: "middle", marginRight: 0.5 }} />
              Tagged:{" "}
              {tags.map((t, i) => (
                <Box
                  key={i}
                  component={Link}
                  to={`/profile/${t.user?.username || t.username}`}
                  sx={{ color: "primary.main", textDecoration: "none", marginRight: 1 }}
                >
                  @{t.user?.username || t.username}
                </Box>
              ))}
            </Typography>
          </Box>
        )}
        <CardActions disableSpacing>
          {isLiked ? (
            <IconButton aria-label="unlike" onClick={handleUnlikePost}>
              <Favorite sx={{ color: "red" }} />
            </IconButton>
          ) : (
            <IconButton aria-label="like" onClick={handleLikePost}>
              <Favorite />
            </IconButton>
          )}
          <IconButton aria-label="comments" onClick={handleExpandClick}>
            <ModeComment />
          </IconButton>
          <IconButton aria-label="share" disabled>
            <Share />
          </IconButton>
        </CardActions>
        <Typography
          variant="body2"
          sx={{ padding: "0 16px 4px", fontWeight: 600, cursor: "pointer" }}
          onClick={handleLikesOpen}
        >
          {likesCount} {likesCount === 1 ? "like" : "likes"}
        </Typography>
        <CommentSection
          post={post}
          user={user}
          expanded={expanded}
          handleExpandClick={handleExpandClick}
        />
      </Card>
      <Dialog
        open={deleteDialog}
        onClose={handleDeleteDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Delete post?</DialogTitle>
        <DialogContent>
          <DialogContentText>This post will be deleted immediately.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      <LikesDialog open={likesOpen} onClose={handleLikesClose} likes={post.likes || []} />
    </Grid>
  );
}
