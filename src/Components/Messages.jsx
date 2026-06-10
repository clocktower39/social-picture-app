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
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
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
  MoreVert,
  NotificationsOff,
  Send,
  VolumeOff,
  VolumeUp,
} from "@mui/icons-material";
import {
  addConversationMembers,
  archiveConversation,
  createConversation,
  deleteConversation,
  deleteMessage,
  getConversations,
  leaveConversation,
  markConversationUnread,
  muteConversation,
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
  if (others.length === 0) return "You";
  if (others.length === 1) return others[0].username;
  return others.map((u) => u.username).join(", ");
};

const ConversationListItem = ({ conversation, onOpen, onMenu, muted, archived }) => {
  const user = useSelector((state) => state.user);
  const others = conversation.users.filter((u) => u._id !== user._id);
  const lastMessage = conversation.messages?.[conversation.messages.length - 1];

  return (
    <ListItem
      disablePadding
      secondaryAction={
        <IconButton
          edge="end"
          onClick={(e) => onMenu(e, conversation)}
          aria-label="Conversation options"
        >
          <MoreVert />
        </IconButton>
      }
    >
      <ListItemButton onClick={() => onOpen(conversation)} sx={{ paddingRight: 7 }}>
        <ListItemAvatar>
          {conversation.isGroup ? (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: "primary.contrastText",
              }}
            >
              <GroupIcon />
            </Box>
          ) : (
            <Avatar
              src={profilePictureUrl(others[0]?.profilePicture)}
              sx={{ width: 48, height: 48 }}
            />
          )}
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Typography
                variant="body1"
                color="text.primary"
                noWrap
                sx={{ fontWeight: 600, flex: 1, minWidth: 0 }}
              >
                {getConversationTitle(conversation, user._id)}
              </Typography>
              {(muted || archived) && (
                <VolumeOff sx={{ fontSize: 14, color: "text.secondary" }} />
              )}
            </Box>
          }
          secondary={
            <Typography variant="body2" color="text.secondary" noWrap>
              {lastMessage
                ? lastMessage.user?._id === user._id
                  ? `You: ${lastMessage.message?.slice(0, 40) || ""}`
                  : `${lastMessage.user?.username || "?"}: ${lastMessage.message?.slice(0, 40) || ""}`
                : "No messages yet"}
            </Typography>
          }
        />
        {lastMessage && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginLeft: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {formatTime(lastMessage.timestamp)}
            </Typography>
          </Box>
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
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          padding: 4,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: "action.hover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GroupIcon sx={{ fontSize: 32, color: "text.secondary" }} />
        </Box>
        <Typography color="text.secondary" variant="body2" textAlign="center">
          No messages yet
        </Typography>
        <Typography variant="caption" color="text.secondary" textAlign="center">
          Send a message to start the conversation
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, overflow: "auto", padding: "12px 16px" }}>
      {messages.map((message, i) => {
        const isMine = message.user?._id === currentUser._id;
        const showAuthor =
          !isMine && (i === 0 || messages[i - 1].user?._id !== message.user._id);
        const prevMine = i > 0 && messages[i - 1].user?._id === currentUser._id;
        const nextMine = i < messages.length - 1 && messages[i + 1].user?._id === currentUser._id;
        const stackToPrev = prevMine && isMine;
        const stackToNext = nextMine && isMine;
        return (
          <Box
            key={message._id || i}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMine ? "flex-end" : "flex-start",
              marginTop: showAuthor ? 1.5 : 0.25,
            }}
          >
            {showAuthor && conversation.isGroup && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ marginLeft: 1.5, marginBottom: 0.25, fontWeight: 600 }}
              >
                {message.user?.username}
              </Typography>
            )}
            <Box
              sx={{
                maxWidth: "75%",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                flexDirection: isMine ? "row-reverse" : "row",
              }}
            >
              <Box
                sx={{
                  padding: "8px 14px",
                  borderRadius: stackToPrev
                    ? isMine
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px"
                    : stackToNext
                    ? isMine
                      ? "18px 4px 18px 18px"
                      : "4px 18px 18px 18px"
                    : isMine
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                  backgroundColor: isMine ? "primary.main" : "background.paper",
                  color: isMine ? "primary.contrastText" : "text.primary",
                  border: isMine ? "none" : "1px solid",
                  borderColor: "divider",
                  position: "relative",
                  minWidth: 48,
                }}
              >
                <Typography variant="body2" sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                  {message.message}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    opacity: 0.65,
                    fontSize: 10,
                    marginTop: 0.25,
                    textAlign: "right",
                  }}
                >
                  {formatTime(message.timestamp)}
                </Typography>
              </Box>
              {isMine && (
                <IconButton
                  size="small"
                  onClick={() => onDelete(message._id)}
                  aria-label="Delete message"
                  sx={{ opacity: 0.6, "&:hover": { opacity: 1 } }}
                >
                  <Delete sx={{ fontSize: 14 }} />
                </IconButton>
              )}
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
        padding: "10px 12px",
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

const GroupSettings = ({ conversation, onClose, onDeleted, onLeft }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [name, setName] = useState(conversation.name || "");
  const [editing, setEditing] = useState(false);
  const [addingMembers, setAddingMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const isCreator = conversation.createdBy && conversation.createdBy === user._id;

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
      const memberIds = new Set(conversation.users.map((u) => u._id));
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

  const handleLeave = async () => {
    setLeaving(true);
    try {
      await dispatch(leaveConversation(conversation._id));
      onLeft?.();
      onClose();
    } finally {
      setLeaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteConversation(conversation._id));
      onDeleted?.();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { backgroundColor: "background.default" } }}
    >
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
                placeholder="Group name"
              />
              <Button onClick={handleSaveName}>Save</Button>
              <Button onClick={() => setEditing(false)}>Cancel</Button>
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ flex: 1 }}>
                {conversation.name || "Unnamed group"}
              </Typography>
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
            const isYou = userObj._id === user._id;
            return (
              <ListItem
                key={userObj._id}
                secondaryAction={
                  !isYou && (
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
                  secondary={isYou ? "You" : null}
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
      <DialogActions sx={{ padding: 2, gap: 1, justifyContent: "space-between" }}>
        <Button
          color="error"
          onClick={() => setConfirmLeave(true)}
          disabled={leaving}
        >
          Leave group
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={() => setConfirmDelete(true)}
          disabled={deleting}
        >
          Delete group
        </Button>
      </DialogActions>

      <Dialog open={confirmLeave} onClose={() => setConfirmLeave(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Leave this group?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            You won't receive new messages. You can be re-added by another member.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmLeave(false)}>Cancel</Button>
          <Button color="error" onClick={handleLeave} disabled={leaving}>
            {leaving ? "Leaving..." : "Leave"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete this group?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This permanently removes the group for all members. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete for everyone"}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

const ConversationView = ({ conversation, onClose, socket, onDeleted }) => {
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
  const subtitle = conversation.isGroup ? `${others.length} members` : "Direct message";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "background.default",
      }}
    >
      <AppBar position="sticky" color="default" elevation={1}>
        <Container maxWidth="md" disableGutters>
          <Toolbar
            sx={{
              gap: 1,
              minHeight: "56px !important",
              paddingLeft: "8px !important",
              paddingRight: "8px !important",
            }}
          >
            <IconButton edge="start" onClick={onClose} aria-label="Back to messages">
              <ArrowBack />
            </IconButton>
            <Box
              sx={{ flex: 1, minWidth: 0, cursor: "pointer" }}
              onClick={() => conversation.isGroup && setSettingsOpen(true)}
            >
              <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {title}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {conversation.isGroup ? subtitle : "Active now"}
              </Typography>
            </Box>
            {others.length === 1 && !conversation.isGroup && (
              <IconButton onClick={() => navigate(`/profile/${others[0].username}`)}>
                <Avatar
                  src={profilePictureUrl(others[0].profilePicture)}
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
            )}
            {conversation.isGroup && (
              <IconButton onClick={() => setSettingsOpen(true)} aria-label="Group settings">
                <GroupIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="md" disableGutters sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <MessageList
          conversation={conversation}
          currentUser={user}
          onDelete={handleDeleteMessage}
        />
        <MessageInput conversationId={conversation._id} />
      </Container>
      {settingsOpen && (
        <GroupSettings
          conversation={conversation}
          onClose={() => setSettingsOpen(false)}
          onDeleted={onDeleted}
          onLeft={onDeleted}
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
      PaperProps={{ sx: { maxWidth: 600, width: "100%", margin: "0 auto" } }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <AppBar position="sticky" color="default" elevation={1}>
          <Toolbar
            sx={{
              gap: 1,
              minHeight: "56px !important",
              paddingLeft: "8px !important",
              paddingRight: "8px !important",
            }}
          >
            <IconButton onClick={() => { reset(); onClose(); }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ flex: 1, fontSize: "1rem", fontWeight: 600 }}>
              {isGroup ? "New group" : "New message"}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ padding: 2, overflowY: "auto" }}>
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
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuConvo, setMenuConvo] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    dispatch(getConversations()).then(() => setLoading(false));
  }, [dispatch]);

  const handleOpenMenu = (e, convo) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setMenuConvo(convo);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleOpenConvo = (convo) => setOpenConvo(convo);
  const handleCloseConvo = () => setOpenConvo(null);
  const handleCreateClose = (created) => {
    setCreateOpen(false);
    if (created) setOpenConvo(created);
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    const targetId = confirmAction.conversationId || menuConvo?._id;
    if (!targetId) return;
    const { type } = confirmAction;
    try {
      if (type === "delete") {
        await dispatch(deleteConversation(targetId));
        if (openConvo?._id === targetId) handleCloseConvo();
      } else if (type === "archive") {
        await dispatch(archiveConversation(targetId, true));
      } else if (type === "unarchive") {
        await dispatch(archiveConversation(targetId, false));
      } else if (type === "mute") {
        await dispatch(muteConversation(targetId, true));
      } else if (type === "unmute") {
        await dispatch(muteConversation(targetId, false));
      } else if (type === "markUnread") {
        await dispatch(markConversationUnread(targetId));
      }
    } catch (err) {
      console.error("Conversation action failed:", err);
    } finally {
      setConfirmAction(null);
      setMenuConvo(null);
      handleCloseMenu();
    }
  };

  if (loading) return <Loading />;

  return (
    <Container maxWidth="md" sx={{ paddingBottom: "100px" }}>
      <Box sx={{ display: "flex", alignItems: "center", padding: "16px 0" }}>
        <Typography variant="h5" sx={{ flex: 1, fontWeight: 600 }}>
          Messages
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          New
        </Button>
      </Box>
      {conversations.length === 0 ? (
        <Box sx={{ textAlign: "center", padding: "40px 20px" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No conversations yet
          </Typography>
          <Typography color="text.secondary" sx={{ marginBottom: 3 }}>
            Start a new conversation to connect with friends.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
          >
            Start a conversation
          </Button>
        </Box>
      ) : (
        <List sx={{ backgroundColor: "background.paper", borderRadius: 2, overflow: "hidden" }}>
          {conversations.map((convo) => {
            const muted = (convo.mutedBy || []).some((id) => id === convo.mutedBy?.[0] || id);
            const archived = false;
            return (
              <ConversationListItem
                key={convo._id}
                conversation={convo}
                onOpen={handleOpenConvo}
                onMenu={handleOpenMenu}
                muted={convo.mutedBy?.length > 0}
                archived={convo.archivedBy?.length > 0}
              />
            );
          })}
        </List>
      )}

      <CreateConversation open={createOpen} onClose={handleCreateClose} />

      <Drawer
        anchor="right"
        open={Boolean(openConvo)}
        onClose={handleCloseConvo}
        PaperProps={{ sx: { maxWidth: 720, width: "100%", margin: "0 auto" } }}
      >
        {openConvo && (
          <ConversationView
            conversation={openConvo}
            onClose={handleCloseConvo}
            socket={socket}
            onDeleted={handleCloseConvo}
          />
        )}
      </Drawer>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {menuConvo && menuConvo.archivedBy?.length > 0 ? (
          <MenuItem
            onClick={() => {
              setConfirmAction({ type: "unarchive", conversationId: menuConvo._id });
              handleCloseMenu();
            }}
          >
            Unarchive
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              setConfirmAction({ type: "archive", conversationId: menuConvo._id });
              handleCloseMenu();
            }}
          >
            Archive
          </MenuItem>
        )}
        {menuConvo && menuConvo.mutedBy?.length > 0 ? (
          <MenuItem
            onClick={() => {
              setConfirmAction({ type: "unmute", conversationId: menuConvo._id });
              handleCloseMenu();
            }}
          >
            <ListItemText inset>Unmute</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              setConfirmAction({ type: "mute", conversationId: menuConvo._id });
              handleCloseMenu();
            }}
          >
            Mute
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setConfirmAction({ type: "markUnread", conversationId: menuConvo._id });
            handleCloseMenu();
          }}
        >
          Mark as unread
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setConfirmAction({ type: "delete", conversationId: menuConvo._id });
            handleCloseMenu();
          }}
          sx={{ color: "error.main" }}
        >
          Delete chat
        </MenuItem>
      </Menu>

      <Dialog
        open={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {confirmAction?.type === "delete" && "Delete this chat?"}
          {confirmAction?.type === "archive" && "Archive this chat?"}
          {confirmAction?.type === "unarchive" && "Unarchive this chat?"}
          {confirmAction?.type === "mute" && "Mute this chat?"}
          {confirmAction?.type === "unmute" && "Unmute this chat?"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {confirmAction?.type === "delete" &&
              "This removes the chat from your list. Other members can still see it."}
            {confirmAction?.type === "archive" &&
              "Archived chats are hidden from your inbox. You can find them under Archived."}
            {confirmAction?.type === "unarchive" &&
              "This chat will show up in your inbox again."}
            {confirmAction?.type === "mute" &&
              "You won't get notifications for new messages in this chat."}
            {confirmAction?.type === "unmute" && "Notifications for this chat are turned back on."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmAction(null)}>Cancel</Button>
          <Button
            color={confirmAction?.type === "delete" ? "error" : "primary"}
            onClick={handleConfirm}
          >
            {confirmAction?.type === "delete" ? "Delete" : "OK"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
