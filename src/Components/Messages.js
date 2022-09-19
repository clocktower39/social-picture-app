import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarGroup, Button, Container, Drawer, Grid, IconButton, List, ListItem, ListItemButton, ListItemAvatar, ListItemText, TextField, Typography, } from "@mui/material";
import { Create, Close as CloseIcon, Delete, } from "@mui/icons-material";
import { getConversations, sendMessage, serverURL } from '../Redux/actions';

const classes = {
  root: {
    paddingBottom: "75px",
  },
  gridContainer: {
    scrollBehavior: "smooth",
  },
};

const Conversation = ({ conversation }) => {
  const user = useSelector(state => state.user);
  const users = conversation.users.filter(u => u._id !== user._id);
  const [openMessageDrawer, setOpenMessageDrawer] = useState(false);

  const handleMessageDrawerOpen = (users, messages, convoId) => {
    setOpenMessageDrawer(true);
  }

  const handleMessageDrawerClose = () => {
    setOpenMessageDrawer(false);
  }

  return (
    <>
      <ListItem
        disablePadding
        sx={{ width: '100%', }}
      >
        <ListItemButton onClick={() => handleMessageDrawerOpen(conversation.users, conversation.messages, conversation._id)} >
          <ListItemAvatar>
            <AvatarGroup max={3} >
              {/* {users.map()} */}
              <Avatar src={users[0].profilePicture ? `${serverURL}/user/profilePicture/${users[0].profilePicture}` : null} />
            </AvatarGroup>
          </ListItemAvatar>
          <ListItemText primary={users.map(u => u.username).join(' ')} />
        </ListItemButton>
      </ListItem>
      <Drawer
        anchor={"right"}
        open={openMessageDrawer}
        onClose={handleMessageDrawerClose}
        sx={{ '& .MuiPaper-root': { width: '100%' } }}
      >
        <div style={{
          height: 'calc(100% - 72px)',
          display: 'flex',
          flexDirection: 'column',
        }} >
          <MessageList users={users} messages={conversation.messages} handleMessageDrawerClose={handleMessageDrawerClose} />

        </div>
        <div style={{
          bottom: 0,
          left: 0,
          position: "fixed",
          width: '100%',
        }}>
          <MessageInput conversationId={conversation._id} />
        </div>
      </Drawer>
    </>
  )
};

const MessageList = ({ users, messages, handleMessageDrawerClose }) => {
  const user = useSelector(state => state.user);

  return (
    <Container maxWidth="sm" sx={{ padding: "0 0 95px 0", }}>
      <Grid container item >
        <Grid container item xs={1} >
          <IconButton onClick={handleMessageDrawerClose} ><CloseIcon /></IconButton>
        </Grid>
        <Grid container item xs={11} sx={{ alignContent: 'center', }} >
          <Typography variant="h5">{users.map(u => u.username).join(' ')}</Typography>
        </Grid>
        <Grid container item xs={12} >
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
        </Grid>
      </Grid>
    </Container>
  )
};

const MessageInput = ({ conversationId }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleMessageSubmit(e);
    }
  };

  const handleMessageSubmit = (e) => {
    if (message !== '') {
      dispatch(sendMessage(conversationId, message))
      setMessage('');
    }
  }

  return (
    <Container maxWidth="sm">
      <Grid
        container
        sx={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: '12.5px 0px'
        }}
      >
        <Grid item xs={12}>
          <TextField
            fullWidth
            error={error === true ? true : false}
            helperText={error === true ? "Please enter a message" : false}
            label="Message"
            value={message}
            onKeyDown={(e) => handleKeyDown(e)}
            onChange={(e) => {
              setMessage(e.target.value);
              e.target.value === "" ? setError(true) : setError(false);
            }}
            InputProps={{
              endAdornment: (
                <Button variant="contained" color="primary" onClick={(e) => handleMessageSubmit(e)}>
                  Send
                </Button>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default function Messages() {
  const dispatch = useDispatch();
  const conversations = useSelector(state => state.conversations);

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
                return <Conversation key={conversation._id} conversation={conversation} />
              })
              : 'No messages'}
          </List>
        </Grid>
      </Grid>
    </Container>
  )
}
