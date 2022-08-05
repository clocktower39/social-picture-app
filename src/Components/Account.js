import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Avatar,
  Button,
  Container,
  Grid,
  CardMedia,
  TextField,
  Typography,
} from "@mui/material";
import { logoutUser, updateUser, serverURL } from "../Redux/actions";

const classes = {
  root: {
    maxWidth: "700px",
  },
  imgList: {
    paddingBottom: "56px",
  },
  profilePic: {
    borderRadius: "50%",
  },
  media: {
    height: 0,
    paddingTop: "100%",
  },
};

export const Account = (props) => {
  const { user={}, } = props;
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(user.username | "");
  const [firstName, setFirstName] = useState(user.firstName | "");
  const [lastName, setLastName] = useState(user.lastName | "");
  const [description, setDescription] = useState(user.description | "");
  const [gridWidth, setGridWidth] = useState(4);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleEdit = () => {
    if (editMode === true) {
      dispatch(updateUser({ username, firstName, lastName, description })).then(
        () => setEditMode(!editMode)
      );
    } else {
      setEditMode(!editMode);
    }
  };

  const handleChange = (e, setter) => {
    setter(e.target.value);
  };

  return (
    <Container disableGutters maxWidth="sm" sx={classes.root}>
      <Grid container justify="center" spacing={1}>
        <Grid item xs={12}>
          {editMode ? (
            <TextField
              label="Username"
              value={username}
              onChange={(e) => {
                handleChange(e, setUsername);
              }}
            />
          ) : (
            <Typography variant="h4">{user.username}</Typography>
          )}
          <br />
        </Grid>
        <Grid item xs={4}>
          <Avatar
            sx={classes.avatar}
            alt="Profile Picture"
            src={`${serverURL}/user/profilePicture/${user.profilePicture}`}
          />
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" align="center">
            {user.posts ? user.posts.length : 0}
            <br />
            Posts
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" align="center">
            <br />
            Followers
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" align="center">
            <br />
            Following
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {editMode ? (
            <>
              <TextField
                label="First Name"
                value={firstName}
                onChange={(e) => {
                  handleChange(e, setFirstName);
                }}
              />
              <TextField
                label="Last Name"
                value={lastName}
                onChange={(e) => {
                  handleChange(e, setLastName);
                }}
              />
            </>
          ) : (
            <Typography variant="body1">
              {user.firstName} {user.lastName}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          {editMode ? (
            <TextField
              label="Description"
              fullWidth
              value={description}
              onChange={(e) => {
                handleChange(e, setDescription);
              }}
            />
          ) : (
            <Typography variant="body2">{user.description}</Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => handleEdit()}
          >
            {editMode ? "Save" : "Edit"}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => handleLogout()}
          >
            LOGOUT
          </Button>
        </Grid>

        {/* list all posts from account */}
        <Grid container item xs={12}>
          {user.posts && user.posts.map((post, index) => {
            return (
              <Grid
                item
                xs={gridWidth}
                key={index}
                onClick={() => {
                  gridWidth === 4 ? setGridWidth(12) : setGridWidth(4);
                }}
              >
                <CardMedia sx={classes.media} image={post.src} />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Account;
