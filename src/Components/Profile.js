import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Avatar, Button, CardMedia, Container, Dialog, Grid, Slide, TextField, Typography } from "@mui/material";
import { getUserProfilePage, getMyRelationships, serverURL } from "../Redux/actions";
import Loading from "./Loading";
import { UserCard } from "./Search";

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

const FollowingUsers = ({ userId, following }) => {
  return (
    <Grid container spacing={2} >
      <Grid item xs={12}>
        <Typography variant="h4" textAlign="center">
          Following
        </Typography>
      </Grid>
      {following.map((user) => (
        <UserCard key={user._id} account={user} />
      ))}
    </Grid>
  );
};

const FollowerUsers = ({ userId, followers }) => {
  return (
    <Grid container spacing={2} >
      <Grid item xs={12}>
        <Typography variant="h4" textAlign="center">
          Followers
        </Typography>
      </Grid>
      {followers.map((user) => (
        <UserCard key={user._id} account={user} />
      ))}
    </Grid>
  );
};

const EditProfile = ({ profile, handleEditProfileModal }) => {
  return (
    <Grid container >
      <Grid container spacing={2} >
        <Grid item xs={2}>
          <Button onClick={handleEditProfileModal} >Cancel</Button>

        </Grid>
        <Grid item xs={8}>
          <Typography variant="h4" textAlign="center">
            Edit Profile
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button >Done</Button>
        </Grid>
      </Grid>


      <Grid container spacing={2} >
        <Grid container item xs={12} sx={{ justifyContent: 'center', }} >
          <Avatar 
              alt="Profile Picture"
              src={
                profile.user.profilePicture
                  ? `${serverURL}/user/profilePicture/${profile.user.profilePicture}`
                  : null
              }
          sx={{ width: 85, height: 85 }}
          />
        </Grid>
        <Grid container item xs={12} sx={{ justifyContent: 'center', }} >
          <TextField label="First Name" />
        </Grid>
        <Grid container item xs={12} sx={{ justifyContent: 'center', }} >
          <TextField label="Last Name" />
        </Grid>
        <Grid container item xs={12} sx={{ justifyContent: 'center', }} >
          <TextField label="Username" />
        </Grid>
        <Grid container item xs={12} sx={{ justifyContent: 'center', }} >
          <TextField label="Email" />
        </Grid>
        <Grid container item xs={12} sx={{ justifyContent: 'center', }} >
          <TextField label="Phone Number" />
        </Grid>
        <Grid container item xs={12} sx={{ justifyContent: 'center', }} >
          <TextField label="Bio" />
        </Grid>
      </Grid>

    </Grid>
  );
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Profile = (props) => {
  const params = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const profile = useSelector((state) => state.profile);
  const [gridWidth, setGridWidth] = useState(4);
  const [loading, setLoading] = useState(true);
  const [openFollowingModal, setOpenFollowingModal] = useState(false);
  const [openFollowersModal, setOpenFollowersModal] = useState(false);
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);

  const handleFollowingModal = () => setOpenFollowingModal((prev) => !prev);
  const handleFollowersModal = () => setOpenFollowersModal((prev) => !prev);
  const handleEditProfileModal = () => setOpenEditProfileModal((prev) => !prev);

  useEffect(() => {
    setOpenFollowingModal(false);
    setOpenFollowersModal(false);
    dispatch(getUserProfilePage(params.username)).then(() => setLoading(false));
  }, [dispatch, params.username]);

  useEffect(() => {
    dispatch(getMyRelationships());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return loading ? (
    <Loading />
  ) : params.username === profile.user.username ? (
    <Container disableGutters maxWidth="sm" sx={classes.root}>
      <Grid container sx={{ justifyContent: "center" }} spacing={1}>
        <Grid container item xs={11} spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h4">{profile.user.username}</Typography>
            <br />
          </Grid>
          <Grid item xs={4}>
            <Avatar
              sx={classes.avatar}
              alt="Profile Picture"
              src={
                profile.user.profilePicture
                  ? `${serverURL}/user/profilePicture/${profile.user.profilePicture}`
                  : null
              }
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body2" align="center">
              {profile.posts ? profile.posts.length : 0}
              <br />
              Posts
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body2" align="center" onClick={handleFollowersModal}>
              {profile.followers.length}
              <br />
              Followers
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body2" align="center" onClick={handleFollowingModal}>
              {profile.following.length}
              <br />
              Following
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              {profile.user.firstName} {profile.user.lastName}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">{profile.user.description}</Typography>
          </Grid>
        </Grid>


        <Grid container item xs={12} spacing={1} >
          {user._id === profile.user._id ?
            <>
              <Grid container item xs={12}>
                <Button variant="contained" fullWidth onClick={handleEditProfileModal} >Edit</Button>
              </Grid>
            </>
            : <>
              <Grid container item xs={6}>
                <Button variant="contained" fullWidth >
                  {
                    profile.followers.some(u => u._id === user._id)
                      ? 'Unfollow'
                      : profile.following.some(u => u._id === user._id)
                        ? 'Follow Back'
                        : 'Follow'}
                </Button>
              </Grid>
              <Grid container item xs={6}>
                <Button variant="contained" fullWidth disabled >Message</Button>
              </Grid>
            </>
          }
        </Grid>


        {/* list all posts from account */}
        <Grid container item xs={12} spacing={1} >
          {profile.posts &&
            profile.posts.sort((a, b) => a.timestamp < b.timestamp).map((post, index) => {
              return (
                <Grid
                  item
                  xs={gridWidth}
                  key={index}
                  onClick={() => {
                    gridWidth === 4 ? setGridWidth(12) : setGridWidth(4);
                  }}
                >
                  <CardMedia
                    sx={classes.media}
                    image={post.image ? `${serverURL}/post/image/${post.image}` : null}
                  />
                </Grid>
              );
            })}
        </Grid>
      </Grid>
      <Dialog
        open={openFollowersModal}
        onClose={handleFollowersModal}
        sx={{ "& .MuiDialog-paper": { padding: "5px", width: "100%", minHeight: "80%" } }}
      >
        <FollowerUsers userId={profile.user._id} followers={profile.followers} />
      </Dialog>
      <Dialog
        open={openFollowingModal}
        onClose={handleFollowingModal}
        sx={{ "& .MuiDialog-paper": { padding: "5px", width: "100%", minHeight: "80%" } }}
      >
        <FollowingUsers userId={profile.user._id} following={profile.following} />
      </Dialog>
      <Dialog
        open={openEditProfileModal}
        onClose={handleEditProfileModal}
        fullScreen
        TransitionComponent={Transition}
      >
        <EditProfile profile={profile} handleEditProfileModal={handleEditProfileModal} />
      </Dialog>
    </Container>
  ) : (
    <Typography textAlign={"center"}>User not found.</Typography>
  );
};

export default Profile;
