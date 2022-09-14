import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, Container, Drawer, Grid, IconButton, List, ListItem, ListItemButton, ListItemAvatar, ListItemText, Typography, } from "@mui/material";
import { Create, Close as CloseIcon, } from "@mui/icons-material";
import { getConversations, serverURL } from '../Redux/actions';

const classes = {
  root: {
    paddingBottom: "75px",
  },
  gridContainer: {
    scrollBehavior: "smooth",
  },
};

const Conversation = ({ conversation, handleMessageDrawerToggle }) => {
  const user = useSelector(state => state.user);
  const users = conversation.users.filter(u => u._id !== user._id);

  return (
    <ListItem
      disablePadding
      sx={{ width: '100%', }}
    >
      <ListItemButton onClick={handleMessageDrawerToggle} >
        <ListItemAvatar>
          <Avatar src={users[0].profilePicture ? `${serverURL}/user/profilePicture/${users[0].profilePicture}` : null} />
        </ListItemAvatar>
        <ListItemText primary={users.map(u => u.username).join(' ')} />
      </ListItemButton>
    </ListItem>
  )
};


export default function Messages() {
  const dispatch = useDispatch();
  const conversations = useSelector(state => state.conversations);
  const [openMessageDrawer, setOpenMessageDrawer] = useState(false);

  const handleMessageDrawerToggle = () => setOpenMessageDrawer(prev => !prev);

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
                return <Conversation conversation={conversation} handleMessageDrawerToggle={handleMessageDrawerToggle} />
              })
              : 'No messages'}
          </List>
        </Grid>
      </Grid>
      <Drawer
        anchor={"right"}
        open={openMessageDrawer}
        onClose={handleMessageDrawerToggle}
        sx={{ '& .MuiPaper-root': { width: '100%' } }}
      >
        <Grid container >
          <Grid container item >
            <IconButton onClick={handleMessageDrawerToggle} ><CloseIcon /></IconButton>
          </Grid>
        </Grid>
      </Drawer>
    </Container>
  )
}
