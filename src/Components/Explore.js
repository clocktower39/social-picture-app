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
    <Grid container item xs={12} alignItems="center" spacing={3}>
      <Grid item xs={2}>
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
      <Grid item xs={6}>
        <Typography variant="body1" color="text.primary">
          {account.username}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {account.firstName} {account.lastName}
        </Typography>
      </Grid>
      <Grid container item xs={4} sx={{ justifyContent: "flex-end" }}>
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
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState([]);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const searchRef = useRef(null);

  const handleSearchDialogOpen = () => {
    setSearchDialogOpen(true);
    searchRef.current.focus();
  };

  const handleSearchDialogClose = () => setSearchDialogOpen(false);

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
          <Grid item xs={1} sx={{ zIndex: 2000 }}>
            <IconButton onClick={handleSearchDialogClose}>
              <ArrowBack />
            </IconButton>
          </Grid>
        )}
        <Grid item xs={searchDialogOpen ? 11 : 12}>
          <TextField
            fullWidth
            label="Search"
            onChange={handleInput}
            value={searchInput}
            variant="filled"
            onFocus={handleSearchDialogOpen}
            sx={{ zIndex: 2000 }}
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
              <Grid container spacing={3} alignItems="center" sx={{marginTop: searchRef?.current?.height + 5}}>
                {/* pull X random users then a random post from them */}
                {users.map((account, index) => (
                  <UserCard key={index} account={account} />
                ))}
              </Grid>
            </Container>
          </DialogContent>
        </Dialog>
        {posts.map((post, index) => (
          <Grid item xs={4} key={post.image._id}>
            <CardMedia
              sx={{
                height: 0,
                paddingTop: "100%",
              }}
              image={`${serverURL}/post/image/${post.image._id}`}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Explore;
