import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AppBar,
  Autocomplete,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  ArrowBack,
  Close,
  Delete,
  Edit,
  Group as GroupIcon,
  Send,
} from "@mui/icons-material";
import {
  addConversationMembers,
  createConversation,
  deleteMessage,
  getConversations,
  leaveConversation,
  removeConversationMember,
  renameGroup,
  searchUsers,
  sendMessage,
  socketMessage,
} from "../Redux/actions";
import { profilePictureUrl } from "../api";
import { extractMentions, formatTime } from "../utils/text";
import Loading from "./Loading";

const getConversationTitle = (conversation, currentUserId) => {
  if (conversation.isGroup && conversation.name) return conversation.name;
  const others = conversation.users.filter((u) => u._id !== currentUserId);
  if (!currentUserId) return others.map((u) => u.username).join(", ");
  if (others.length === 0) return "You";
  if (others.length === 1) return others[0].username;
  return others.map((u) => u.username).join(", ");
};

const ConversationListItem = ({ conversation, onOpen }) => {
  const user = useSelector((state) => state.user);
  const others = conversation.users.filter((u) => u._id !== user._id);
  const lastMessage = conversation.messages?.[conversation.messages.length - 1];

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={() => onOpen(conversation)}>
        <ListItemAvatar>
          {conversation.isGroup ? (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              <GroupIcon />
            </Box>
          ) : (
            <AvatarGroup max={3} spacing="small">
              {others.slice(0, 3).map((u) => (
                <Avatar key={u._id} src={profilePictureUrl(u.profilePicture)} />
              ))}
            </AvatarGroup>
          )}
        </ListItemAvatar>
        <ListItemText
          primary={getConversationTitle(conversation, user._id)}
          secondary={
            lastMessage
              ? `${lastMessage.user?.username || "?"}: ${lastMessage.message?.slice(0, 40) || ""}`
              : "No messages yet"
          }
          primaryTypographyProps={{ color: "text.primary" }}
        />
        {lastMessage && (
          <Typography variant="caption" color="text.secondary">
            {formatTime(lastMessage.timestamp)}
          </Typography>
        )}
      </ListItemButton>
    </ListItem>
  );
};

const MessageList = ({ conversation, currentUser, onDelete }) => {
  const messages = conversation.messages || [];
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography color="text.secondary" variant="body2">
          Say hi 👋
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, overflow: "auto", padding: "12px" }}>
      {messages.map((message, i) => {
        const isMine = message.user?._id === currentUser._id;
        const showAuthor = !isMine && (i === 0 || messages[i - 1].user?._id !== message.user._id);
        return (
          <Box
            key={message._id || i}
            sx={{
              display: "flex",
              justifyContent: isMine ? "flex-end" : "flex-start",
              marginBottom: 0.5,
            }}
          >
            <Box
              sx={{
                maxWidth: "75%",
                display: "flex",
                flexDirection: "column",
                alignItems: isMine ? "flex-end" : "flex-start",
              }}
            >
              {showAuthor && conversation.isGroup && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 0.25 }}>
                  {message.user?.username}
                </Typography>
              )}
              <Box
                sx={{
                  padding: "8px 12px",
                  borderRadius: 2,
                  backgroundColor: isMine ? "primary.main" : "background.paper",
                  color: isMine ? "primary.contrastText" : "text.primary",
                  border: isMine ? "none" : "1px solid",
                  borderColor: "divider",
                  position: "relative",
                }}
              >
                <Typography variant="body2" sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                  {message.message}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    opacity: 0.6,
                    fontSize: 10,
                    marginTop: 0.5,
                    textAlign: "right",
                  }}
                >
                  {formatTime(message.timestamp)}
                </Typography>
                {isMine && (
                  <IconButton
                    size="small"
                    onClick={() => onDelete(message._id)}
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      backgroundColor: "background.paper",
                      padding: 0.25,
                      "&:hover": { backgroundColor: "background.default" },
                    }}
                  >
                    <Delete sx={{ fontSize: 12 }} />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Box>
        );
      })}
      <div ref={messagesEndRef} />
    </Box>
  );
};

const MessageInput = ({ conversationId }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() === "") return;
    const mentions = extractMentions(message);
    dispatch(sendMessage(conversationId, message, mentions));
    setMessage("");
  };

  return (
    <Box
      sx={{
        borderTop: 1,
        borderColor: "divider",
        padding: "8px 12px",
        backgroundColor: "background.paper",
        display: "flex",
        gap: 1,
        alignItems: "center",
      }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="Message... use @username to mention"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        multiline
        maxRows={4}
      />
      <IconButton color="primary" onClick={handleSend} disabled={!message.trim()}>
        <Send />
      </IconButton>
    </Box>
  );
};

const GroupSettings = ({ conversation, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [name, setName] = useState(conversation.name || "");
  const [editing, setEditing] = useState(false);
  const [addingMembers, setAddingMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSaveName = () => {
    dispatch(renameGroup(conversation._id, name));
    setEditing(false);
  };

  const handleSearch = async (value) => {
    setSearchQuery(value);
    if (!value) {
      setSearchResults([]);
      return;
    }
    const action = await dispatch(searchUsers(value));
    if (action?.users) {
      const memberIds = new Set(conversation.users.map((u) => u._id || u));
      setSearchResults(action.users.filter((u) => !memberIds.has(u._id)));
    }
  };

  const handleAdd = (userToAdd) => {
    dispatch(addConversationMembers(conversation._id, [userToAdd._id]));
    setSearchResults((prev) => prev.filter((u) => u._id !== userToAdd._id));
  };

  const handleRemove = (userId) => {
    dispatch(removeConversationMember(conversation._id, userId));
  };

  const handleLeave = () => {
    if (window.confirm("Leave this group?")) {
      dispatch(leaveConversation(conversation._id));
      onClose();
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <GroupIcon /> Group settings
        <IconButton onClick={onClose} sx={{ marginLeft: "auto" }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 2 }}>
          {editing ? (
            <>
              <TextField
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                autoFocus
              />
              <Button onClick={handleSaveName}>Save</Button>
              <Button onClick={() => setEditing(false)}>Cancel</Button>
            </>
          ) : (
            <>
              <Typography variant="h6">{conversation.name || "Unnamed group"}</Typography>
              <IconButton size="small" onClick={() => setEditing(true)}>
                <Edit fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
        <Typography variant="overline" color="text.secondary">
          {conversation.users.length} members
        </Typography>
        <List dense>
          {conversation.users.map((u) => {
            const userObj = u._id ? u : { _id: u, username: "?" };
            return (
              <ListItem
                key={userObj._id}
                secondaryAction={
                  userObj._id !== user._id && (
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleRemove(userObj._id)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar src={profilePictureUrl(userObj.profilePicture)} />
                </ListItemAvatar>
                <ListItemText
                  primary={userObj.username}
                  secondary={userObj._id === user._id ? "You" : null}
                />
              </ListItem>
            );
          })}
        </List>
        {addingMembers ? (
          <Box sx={{ marginTop: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search users to add"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
            <List dense>
              {searchResults.map((u) => (
                <ListItem
                  key={u._id}
                  secondaryAction={
                    <Button size="small" onClick={() => handleAdd(u)}>
                      Add
                    </Button>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={profilePictureUrl(u.profilePicture)} />
                  </ListItemAvatar>
                  <ListItemText primary={u.username} secondary={`${u.firstName} ${u.lastName}`} />
                </ListItem>
              ))}
            </List>
            <Button onClick={() => setAddingMembers(false)}>Done adding</Button>
          </Box>
        ) : (
          <Button onClick={() => setAddingMembers(true)} startIcon={<AddIcon />}>
            Add members
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleLeave}>
          Leave group
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ConversationView = ({ conversation, onClose, socket }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join", { conversationId: conversation._id });
    const handler = (data) => {
      if (data._id === conversation._id) dispatch(socketMessage(data));
    };
    socket.on("update_messages", handler);
    return () => socket.off("update_messages", handler);
  }, [socket, conversation._id, dispatch]);

  const handleDeleteMessage = (messageId) => {
    dispatch(deleteMessage(conversation._id, messageId));
  };

  const title = getConversationTitle(conversation, user._id);
  const others = conversation.users.filter((u) => u._id !== user._id);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar sx={{ gap: 1 }}>
          <IconButton edge="start" onClick={onClose}>
            <ArrowBack />
          </IconButton>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              noWrap
              onClick={() => conversation.isGroup && setSettingsOpen(true)}
              sx={{ cursor: conversation.isGroup ? "pointer" : "default" }}
            >
              {title}
            </Typography>
            {conversation.isGroup && (
              <Typography variant="caption" color="text.secondary">
                {others.length} members
              </Typography>
            )}
          </Box>
          {others.length === 1 && !conversation.isGroup && (
            <IconButton onClick={() => navigate(`/profile/${others[0].username}`)}>
              <Avatar src={profilePictureUrl(others[0].profilePicture)} sx={{ width: 32, height: 32 }} />
            </IconButton>
          )}
          {conversation.isGroup && (
            <IconButton onClick={() => setSettingsOpen(true)}>
              <GroupIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <MessageList conversation={conversation} currentUser={user} onDelete={handleDeleteMessage} />
      <MessageInput conversationId={conversation._id} />
      {settingsOpen && (
        <GroupSettings
          conversation={conversation}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </Box>
  );
};

const CreateConversation = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    const action = dispatch(searchUsers(searchQuery));
    action.then((a) => {
      if (a?.users) {
        const selectedIds = new Set(selectedUsers.map((u) => u._id));
        setSearchResults(a.users.filter((u) => !selectedIds.has(u._id)));
      }
    });
  }, [searchQuery, dispatch, selectedUsers]);

  const handleCreate = async () => {
    if (isGroup && selectedUsers.length < 2) {
      setError("A group needs at least 2 other members");
      return;
    }
    if (!isGroup && selectedUsers.length === 0) {
      setError("Pick someone to message");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const action = await dispatch(
        createConversation({
          userIds: selectedUsers.map((u) => u._id),
          name: isGroup ? groupName : null,
          isGroup,
        })
      );
      if (action?.error) {
        setError(action.error);
      } else {
        reset();
        onClose(action?.conversation);
      }
    } catch (err) {
      setError(err.message || "Failed to create conversation");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setIsGroup(false);
    setGroupName("");
    setSelectedUsers([]);
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      sx={{ "& .MuiPaper-root": { width: "100%" } }}
    >
      <Box sx={{ padding: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 2 }}>
          <IconButton onClick={() => { reset(); onClose(); }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6">{isGroup ? "New group" : "New message"}</Typography>
        </Box>
        <Button
          fullWidth
          variant={isGroup ? "contained" : "outlined"}
          startIcon={<GroupIcon />}
          onClick={() => setIsGroup((p) => !p)}
          sx={{ marginBottom: 2 }}
        >
          {isGroup ? "Group chat" : "Direct message"}
        </Button>
        {isGroup && (
          <TextField
            fullWidth
            label="Group name (optional)"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
        )}
        <Autocomplete
          multiple
          freeSolo={false}
          options={searchResults}
          getOptionLabel={(opt) => opt.username || ""}
          value={selectedUsers}
          onChange={(_, value) => setSelectedUsers(value)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={option._id || index}
                variant="outlined"
                label={option.username}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Add people"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users"
            />
          )}
        />
        {error && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          fullWidth
          variant="contained"
          onClick={handleCreate}
          disabled={submitting}
          sx={{ marginTop: 2 }}
        >
          {submitting ? "Creating..." : isGroup ? "Create group" : "Send message"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default function Messages({ socket }) {
  const dispatch = useDispatch();
  const conversations = useSelector((state) => state.conversations);
  const [createOpen, setCreateOpen] = useState(false);
  const [openConvo, setOpenConvo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getConversations()).then(() => setLoading(false));
  }, [dispatch]);

  const handleOpenConvo = (convo) => setOpenConvo(convo);
  const handleCloseConvo = () => setOpenConvo(null);
  const handleCreateClose = (created) => {
    setCreateOpen(false);
    if (created) setOpenConvo(created);
  };

  if (loading) return <Loading />;

  return (
    <Container maxWidth="sm" sx={{ paddingBottom: "100px" }} disableGutters>
      <Box sx={{ display: "flex", alignItems: "center", padding: "16px 0" }}>
        <Typography variant="h5" sx={{ flex: 1 }}>
          Messages
        </Typography>
        <IconButton onClick={() => setCreateOpen(true)}>
          <AddIcon />
        </IconButton>
      </Box>
      {conversations.length === 0 ? (
        <Box sx={{ textAlign: "center", padding: "40px 0" }}>
          <Typography color="text.secondary" gutterBottom>
            No conversations yet
          </Typography>
          <Button variant="contained" onClick={() => setCreateOpen(true)}>
            Start a conversation
          </Button>
        </Box>
      ) : (
        <List>
          {conversations.map((convo) => (
            <ConversationListItem
              key={convo._id}
              conversation={convo}
              onOpen={handleOpenConvo}
            />
          ))}
        </List>
      )}

      <CreateConversation open={createOpen} onClose={handleCreateClose} />

      <Drawer
        anchor="right"
        open={Boolean(openConvo)}
        onClose={handleCloseConvo}
        sx={{ "& .MuiPaper-root": { width: "100%" } }}
      >
        {openConvo && (
          <ConversationView
            conversation={openConvo}
            onClose={handleCloseConvo}
            socket={socket}
          />
        )}
      </Drawer>
    </Container>
  );
}
