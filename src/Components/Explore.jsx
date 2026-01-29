import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Avatar,
  Button,
  CardMedia,
  Container,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import {
  requestFollow,
  requestUnfollow,
  getMyRelationships,
  serverURL,
} from "../Redux/actions";
import SinglePost from "./SinglePost";

export const UserCard = ({ account }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const relationships = useSelector((state) => state.relationships);
  const isFollowing = relationships.following.some(
    (r) => r.user === account._id
  );

  const handleRequestFollow = (user) => {
    dispatch(requestFollow(user._id));
  };

  const handleRequestUnfollow = (user) => {
    dispatch(requestUnfollow(user._id));
  };

  return (
    <Grid container size={12} alignItems="center" spacing={3}>
      <Grid size={2}>
        <Avatar
          src={
            account.profilePicture
              ? `${serverURL}/user/profilePicture/${account.profilePicture}`
              : null
          }
          component={Link}
          to={`/profile/${account.username}`}
        />
      </Grid>
      <Grid size={6}>
        <Typography variant="body1" color="text.primary">
          {account.username}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {account.firstName} {account.lastName}
        </Typography>
      </Grid>
      <Grid container size={4} sx={{ justifyContent: "flex-end" }}>
        {user._id === account._id ? null : isFollowing ? (
          <Button
            variant="contained"
            onClick={() => handleRequestUnfollow(account)}
            fullWidth
          >
            Unfollow
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => handleRequestFollow(account)}
            fullWidth
          >
            Follow
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export const Explore = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState([]);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [singlePostDialogOpen, setSinglePostDialogOpen] = useState(false);
  const searchRef = useRef(null);
  const [singlePost, setSinglePost] = useState(null);
  const [singlePostLikes, setSinglePostLikes] = useState(null);
  const [isPostLiked, setIsPostLiked] = useState(null);

  const handleSearchDialogOpen = () => {
    setSearchDialogOpen(true);
    searchRef.current.focus();
  };

  const handleSearchDialogClose = () => setSearchDialogOpen(false);

  const handleSinglePostDialogOpen = (post, postLikes, isLiked) => {
    setSinglePostDialogOpen(true);
    setSinglePost(post);
    setSinglePostLikes(postLikes);
    setIsPostLiked(isLiked);
  }
  const handleSinglePostDialogClose = () => {
    setSinglePostDialogOpen(false);
  }

  const fetchExplorePosts = async () => {
    let response = await fetch(`${serverURL}/explore`, {
      method: "get",
      dataType: "json",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    let data = await response.json();

    setPosts(data);
  };

  const fetchSearch = async () => {
    let payload = JSON.stringify({ username: searchInput });

    let response = await fetch(`${serverURL}/search`, {
      method: "post",
      dataType: "json",
      body: payload,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    let data = await response.json();

    setUsers(data.users);
  };

  const handleInput = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    if (searchInput.length) {
      fetchSearch();
    }
    // eslint-disable-next-line
  }, [searchInput]);

  useEffect(() => {
    dispatch(getMyRelationships());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchExplorePosts();
    // eslint-disable-next-line
  }, []);

  return (
    <Container maxWidth="sm">
      <Grid container spacing={0} alignItems="center">
        {searchDialogOpen && (
          <Grid size={1} sx={{ zIndex: 2000 }}>
            <IconButton onClick={handleSearchDialogClose}>
              <ArrowBack />
            </IconButton>
          </Grid>
        )}
        <Grid size={searchDialogOpen ? 11 : 12}>
          <TextField
            fullWidth
            label="Search"
            onChange={handleInput}
            value={searchInput}
            variant="filled"
            onFocus={handleSearchDialogOpen}
            sx={{ zIndex: searchDialogOpen ? 2000 : 0 }}
            inputRef={searchRef}
          />
        </Grid>
        <Dialog
          fullScreen
          open={searchDialogOpen}
          onClose={handleSearchDialogClose}
          disableEnforceFocus
        >
          <DialogContent>
            <Container maxWidth="sm">
              <Grid
                container
                spacing={3}
                alignItems="center"
                sx={{ marginTop: searchRef?.current?.height + 5 }}
              >
                {/* pull X random users then a random post from them */}
                {users.map((account, index) => (
                  <UserCard key={index} account={account} />
                ))}
              </Grid>
            </Container>
          </DialogContent>
        </Dialog>
        <Dialog
          fullScreen
          open={singlePostDialogOpen}
          onClose={handleSinglePostDialogClose}
        >
          <DialogContent>
            <Container maxWidth="sm">
              <Grid size={1}>
                <IconButton onClick={handleSinglePostDialogClose}>
                  <ArrowBack />
                </IconButton>
              </Grid>
              <Grid
                container
                spacing={3}
                alignItems="center"
              >
                {/* pull X random users then a random post from them */}
                <SinglePost post={singlePost} likes={singlePostLikes} isLiked={isPostLiked} />
              </Grid>
            </Container>
          </DialogContent>
        </Dialog>
        {posts.map((post, index) => {
          const isLiked = post.likes.some((u) => u._id === user._id);
          return (
            <Grid
              size={4}
              key={post.image._id}
              onClick={() => handleSinglePostDialogOpen(post, post.likes, isLiked)}
            >
              <CardMedia
                sx={{
                  height: 0,
                  paddingTop: "100%",
                }}
                image={`${serverURL}/post/image/${post.image._id}`}
              />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Explore;
