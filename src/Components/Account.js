import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  Button,
  Container,
  Grid,
  CardMedia,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { logoutUser, updateUser } from "../Redux/actions";

const useStyles = makeStyles({
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
});

export const Account = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(props.user.username);
  const [firstName, setFirstName] = useState(props.user.firstName);
  const [lastName, setLastName] = useState(props.user.lastName);
  const [description, setDescription] = useState(props.user.description);
  const [gridWidth, setGridWidth] = useState(4);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("username");
    localStorage.setItem("authenticated", false);
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
    <Container disableGutters maxWidth="sm" className={classes.root}>
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
            <Typography variant="h4">{props.user.username}</Typography>
          )}
          <br />
        </Grid>
        <Grid item xs={4}>
          <img
            className={classes.profilePic}
            src={props.user.profilePic}
            alt="profile pic"
          />
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" align="center">
            {props.user.posts.length}
            <br />
            Posts
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" align="center">
            {props.user.followers.length}
            <br />
            Followers
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" align="center">
            {props.user.following.length}
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
              {props.user.firstName} {props.user.lastName}
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
            <Typography variant="body2">{props.user.description}</Typography>
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
          {props.user.posts.map((post, index) => {
            return (
              <Grid
                item
                xs={gridWidth}
                key={index}
                onClick={() => {
                  gridWidth === 4 ? setGridWidth(12) : setGridWidth(4);
                }}
              >
                <CardMedia className={classes.media} image={post.src} />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Account);
