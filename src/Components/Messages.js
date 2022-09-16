import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarGroup, Container, Drawer, Grid, IconButton, List, ListItem, ListItemButton, ListItemAvatar, ListItemText, Typography, } from "@mui/material";
import { Create, Close as CloseIcon, Delete, } from "@mui/icons-material";
import { getConversations, serverURL } from '../Redux/actions';

const classes = {
  root: {
    paddingBottom: "75px",
  },
  gridContainer: {
    scrollBehavior: "smooth",
  },
};

const Conversation = ({ conversation, handleMessageDrawerOpen }) => {
  const user = useSelector(state => state.user);
  const users = conversation.users.filter(u => u._id !== user._id);

  return (
    <ListItem
      disablePadding
      sx={{ width: '100%', }}
    >
      <ListItemButton onClick={() => handleMessageDrawerOpen(conversation.users, conversation.messages)} >
        <ListItemAvatar>
          <AvatarGroup max={3} >
            {/* {users.map()} */}
            <Avatar src={users[0].profilePicture ? `${serverURL}/user/profilePicture/${users[0].profilePicture}` : null} />
          </AvatarGroup>
        </ListItemAvatar>
        <ListItemText primary={users.map(u => u.username).join(' ')} />
      </ListItemButton>
    </ListItem>
  )
};

const MessageList = ({ users, messages }) => {
  const user = useSelector(state => state.user);

  return (
    <>
      {messages.map((message, i) => {
        return (
          <Grid
            key={message._id || i}
            sx={
              message.user.username === user.username
                ? {
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "10px 0px",
                  borderRadius: "7.5px",
                  backgroundColor: "rgb(21, 101, 192)",
                  color: "white"
                }
                : {
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "10px 0px",
                  borderRadius: "7.5px",
                  backgroundColor: "#23272A",
                  color: "white"
                }
            }
            container
            item
            xs={12}
          >
            <Grid container item xs={2} sx={{ justifyContent: 'center', }}>
              <Avatar src={message.user.profilePicture ? `${serverURL}/user/image/${message.user.profilePicture}` : null} />
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h6" display="inline">
                {message.user.username}{" "}
              </Typography>
              <Typography
                variant="subtitle1"
                display="inline"
                sx={{
                  fontSize: "16px",
                  opacity: ".33",
                }}
              >
                {message.timeStamp == null
                  ? null
                  : `${new Date(message.timeStamp)
                    .toLocaleDateString()
                    .substr(
                      0,
                      new Date(message.timeStamp).toLocaleDateString()
                        .length - 5
                    )} ${new Date(message.timeStamp).toLocaleTimeString()}`}
              </Typography>
              <Typography variant="subtitle1" display="block">
                {message.message}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              {message.user.username === user.username && (
                <IconButton disabled >
                  <Delete />
                </IconButton>
              )}
            </Grid>
          </Grid>
        );
      })}
    </>
  )
};


export default function Messages() {
  const dispatch = useDispatch();
  const conversations = useSelector(state => state.conversations);
  const [openMessageDrawer, setOpenMessageDrawer] = useState(false);
  const [messageListUsers, setMessageListUsers] = useState([]);
  const [messageListMessages, setMessageListMessages] = useState([]);

  const handleMessageDrawerOpen = (users, messages) => {
    setMessageListUsers([...users]);
    setMessageListMessages([...messages]);
    setOpenMessageDrawer(true);
  }

  const handleMessageDrawerClose = () => {
    setOpenMessageDrawer(false);
    setMessageListUsers([]);
    setMessageListMessages([]);
  }

  useEffect(() => {
    dispatch(getConversations())
  }, [dispatch])

  return (
    <Container maxWidth="sm" sx={classes.root} disableGutters>
      <Grid container sx={classes.gridContainer}>
        <Grid justify="center" container spacing={3}>
          <Grid container item xs={6}>
            <Typography variant="h5" component={Link} to="/" sx={{ textDecoration: 'none', color: 'text.primary', }} >Social Photo App</Typography>
          </Grid>
          <Grid container item xs={6} sx={{ justifyContent: 'flex-end', }} >
            <IconButton component={Link} to="/messages" ><Create /></IconButton>
          </Grid>
        </Grid>
        <Grid container item xs={12} >
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {conversations.length > 0
              ? conversations.map(conversation => {
                return <Conversation conversation={conversation} handleMessageDrawerOpen={handleMessageDrawerOpen} />
              })
              : 'No messages'}
          </List>
        </Grid>
      </Grid>
      <Drawer
        anchor={"right"}
        open={openMessageDrawer}
        onClose={handleMessageDrawerClose}
        sx={{ '& .MuiPaper-root': { width: '100%' } }}
      >
        <Grid container >
          <Grid container item >
            <IconButton onClick={handleMessageDrawerClose} ><CloseIcon /></IconButton>
            <Grid container item xs={12} >
              <MessageList users={messageListUsers} messages={messageListMessages} />
            </Grid>
          </Grid>
        </Grid>
      </Drawer>
    </Container>
  )
}
