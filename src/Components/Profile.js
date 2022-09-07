import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Avatar, Button, CardMedia, Container, Dialog, Grid, IconButton, Input, Menu, MenuItem, Slide, TextField, Typography } from "@mui/material";
import { Close, GridOn, Menu as MenuIcon, Portrait, } from "@mui/icons-material";
import { getUserProfilePage, getMyRelationships, logoutUser, updateUser, uploadProfilePicture, serverURL } from "../Redux/actions";
import Loading from "./Loading";
import SinglePost from "./SinglePost";
import { UserCard } from "./Search";
import ChangePassword from './ChangePassword';

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

const ProfilePictureUpload = () => {
  const dispatch = useDispatch();
  const [uploadPhoto, setUploadPhoto] = useState(null);

  const handlePhoto = (e) => {
    setUploadPhoto(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", uploadPhoto);

    if (uploadPhoto) {
      dispatch(uploadProfilePicture(formData));
    }
  };

  return (
    <Container disableGutters maxWidth="sm" >
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Grid container>
          <Input
            type="file"
            accept=".png, .jpg, .jpeg"
            name="photo"
            onChange={handlePhoto}
            fullWidth
            id="hidden-input"
            sx={{ display: 'none' }}
          />
          <Grid item xs={12}>
            <label htmlFor="hidden-input">
              <CardMedia
                sx={{
                  height: 0,
                  paddingTop: "100%",
                  backgroundColor: 'gray'
                }}
                image={uploadPhoto && URL.createObjectURL(uploadPhoto)}
                alt="upload an image"
              />
            </label>
            { !uploadPhoto && <Typography variant="h6" sx={{ textAlign: "center", position: 'relative', bottom: '55%', }}>Click to upload and preview an image.</Typography>}
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth type="submit">
              Upload
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

const EditProfile = ({ user, handleEditProfileModal }) => {
  const dispatch = useDispatch();
  const [editUser, setEditUser] = useState(user);
  const [profilePictureDialog, setProfilePictureDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [passwordModal, setPasswordModal] = useState(false);
  const handlePasswordOpen = () => setPasswordModal(true);
  const handlePasswordClose = () => setPasswordModal(false);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleCancel = () => {
    setEditUser(user);
  };

  const handleSave = () => {
    dispatch(updateUser(editUser));
  };

  const handleProfilePictureDialog = () => setProfilePictureDialog(prev => !prev);

  const handleChange = (e, property) => {
    setEditUser(prev => ({
      ...prev,
      [property]: e.target.value,
    }));
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container >
      <Grid container spacing={2} sx={{ padding: '15px' }}>
        <Grid container item xs={3}>
          <IconButton title="Close" variant="contained" onClick={handleEditProfileModal} >
            <Close />
          </IconButton>

        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4" textAlign="center">
            Edit Profile
          </Typography>
        </Grid>
        <Grid container item xs={3} sx={{ justifyContent: 'flex-end', }}>
          <IconButton title="Settings" variant="contained" onClick={handleMenuClick} >
            <MenuIcon />
          </IconButton>
        </Grid>
      </Grid>


      <Grid container spacing={2} >
        <Grid container item xs={12} sx={{ justifyContent: 'center', }} >
          <Avatar
            alt="Profile Picture"
            src={user.profilePicture && `${serverURL}/user/profilePicture/${user.profilePicture}`}
            sx={{ width: 85, height: 85 }}
            onClick={handleProfilePictureDialog}
          />
        </Grid>
        <Grid container item xs={12} sx={{ justifyContent: 'center', }} >
          <TextField label="First Name" value={editUser.firstName} onChange={(e) => handleChange(e, 'firstName')} />
        </Grid>
        <Grid container item xs={12} sx={{ justifyContent: 'center', }} onChange={(e) => handleChange(e, 'lastName')} >
          <TextField label="Last Name" value={editUser.lastName} />
        </Grid>
        <Grid container item xs={12} sx={{ justifyContent: 'center', }} onChange={(e) => handleChange(e, 'username')} >
          <TextField label="Username" value={editUser.username} />
        </Grid>
        <Grid container item xs={12} sx={{ justifyContent: 'center', }} onChange={(e) => handleChange(e, 'email')} >
          <TextField label="Email" value={editUser.email} />
        </Grid>
        <Grid container item xs={12} sx={{ justifyContent: 'center', }} onChange={(e) => handleChange(e, 'phoneNumber')} >
          <TextField label="Phone Number" value={editUser.phoneNumber} />
        </Grid>
        <Grid container item xs={12} sx={{ justifyContent: 'center', }} onChange={(e) => handleChange(e, 'description')} >
          <TextField label="Bio" value={editUser.description} multiline />
        </Grid>
        <Grid container item xs={6} sx={{ justifyContent: 'flex-end', }} >
          <Button variant="contained" onClick={handleCancel}>Cancel</Button>
        </Grid>
        <Grid container item xs={6} sx={{ justifyContent: 'flex-start', }} >
          <Button variant="contained" onClick={handleSave} >Save</Button>
        </Grid>
      </Grid>
      <Menu open={openMenu} onClose={handleMenuClose} anchorEl={anchorEl}>
        <MenuItem onClick={handlePasswordOpen}>Change password</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      {passwordModal && openMenu && (
        <ChangePassword open={openMenu} handlePasswordClose={handlePasswordClose} />
      )}
      <Dialog
        open={profilePictureDialog}
        onClose={handleProfilePictureDialog}
      >
        <ProfilePictureUpload />
      </Dialog>
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
  ) : (
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
          <Grid container item xs={6} sx={{ justifyContent: 'center', }} >
            <IconButton onClick={() => setGridWidth(4)}>
              <GridOn />
            </IconButton>
          </Grid>
          <Grid container item xs={6} sx={{ justifyContent: 'center', }} >
            <IconButton onClick={() => setGridWidth(12)}>
              <Portrait />
            </IconButton>
          </Grid>
        </Grid>

        {/* list all posts from account */}
        <Grid container item xs={12} spacing={1} >
          {profile.posts &&
            profile.posts.sort((a, b) => a.timestamp < b.timestamp).map((post, index) => {
              const isLiked = post.likes.some(u => u._id === user._id);
              return (
                <Grid
                  item
                  xs={gridWidth}
                  key={index}
                > {
                    gridWidth === 4 ?
                      <CardMedia
                        sx={classes.media}
                        image={post.image ? `${serverURL}/post/image/${post.image}` : null}
                      />
                      : (<SinglePost key={`post-${post.image}`} post={post} likes={post.likes} isLiked={isLiked} />)
                  }
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
        <EditProfile user={user} handleEditProfileModal={handleEditProfileModal} />
      </Dialog>
    </Container>
  );
};

export default Profile;
