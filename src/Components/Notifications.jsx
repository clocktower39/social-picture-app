import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { getNotifications, markNotificationsRead, serverURL } from "../Redux/actions";

const classes = {
  root: {
    paddingBottom: "75px",
  },
};

const getNotificationLink = (notification) => {
  if (notification.type === "message") {
    return "/messages";
  }
  if (notification.actor && notification.actor.username) {
    return `/profile/${notification.actor.username}`;
  }
  return "/";
};

const getNotificationText = (notification) => {
  const name = notification.actor?.username || "Someone";
  switch (notification.type) {
    case "like":
      return `${name} liked your post`;
    case "comment":
      return `${name} commented: ${notification.comment || ""}`;
    case "message":
      return `${name} sent you a message`;
    case "follow":
      return `${name} followed you`;
    case "unfollow":
      return `${name} unfollowed you`;
    default:
      return `${name} sent a notification`;
  }
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export default function Notifications() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.items);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const handleMarkAllRead = () => {
    if (unreadCount > 0) {
      dispatch(markNotificationsRead([], true));
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      dispatch(markNotificationsRead([notification._id]));
    }
  };

  return (
    <Container maxWidth="sm" sx={classes.root}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0" }}>
        <Typography variant="h5">Notifications</Typography>
        <Button variant="outlined" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
          Mark all read
        </Button>
      </Box>
      <Divider />
      {notifications.length === 0 ? (
        <Box sx={{ padding: "24px 0" }}>
          <Typography color="text.secondary">No notifications yet.</Typography>
        </Box>
      ) : (
        <List>
          {notifications.map((notification) => {
            const actorAvatar = notification.actor?.profilePicture
              ? `${serverURL}/user/profilePicture/${notification.actor.profilePicture}`
              : null;
            const postImageId = notification.post?.image?._id || notification.post?.image;
            const postPreview = postImageId ? `${serverURL}/post/image/${postImageId}` : null;
            return (
              <ListItem key={notification._id} disablePadding>
                <ListItemButton
                  component={Link}
                  to={getNotificationLink(notification)}
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    alignItems: "flex-start",
                    backgroundColor: notification.read ? "transparent" : "action.hover",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={actorAvatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={getNotificationText(notification)}
                    secondary={formatTimestamp(notification.createdAt)}
                    sx={{ marginRight: "8px" }}
                  />
                  {postPreview && (
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "8px",
                        backgroundImage: `url(${postPreview})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      )}
    </Container>
  );
}
