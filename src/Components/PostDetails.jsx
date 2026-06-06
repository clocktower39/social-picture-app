import React, { useState } from "react";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { ArrowBack, LocationOn, Send } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { extractHashtags, extractMentions } from "../utils/text";
import { profilePictureUrl } from "../api";
import { getFilterLabel } from "../filters";

const PostDetails = ({
  imageUrl,
  filterCss,
  filter,
  caption,
  location,
  tags,
  onCaptionChange,
  onLocationChange,
  onBack,
  onShare,
  submitting,
  error,
}) => {
  const user = useSelector((state) => state.user);
  const [locationFocused, setLocationFocused] = useState(false);

  const detectedHashtags = extractHashtags(caption);
  const detectedMentions = extractMentions(caption);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar sx={{ gap: 1, minHeight: "56px !important" }}>
          <IconButton edge="start" onClick={onBack}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, fontSize: "1rem" }}>
            New post
          </Typography>
          <Button
            endIcon={<Send />}
            onClick={onShare}
            disabled={submitting}
            variant="contained"
            size="small"
          >
            {submitting ? "Sharing..." : "Share"}
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {error && (
          <Alert severity="error" sx={{ margin: "12px 16px 0" }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: "flex", gap: 2, padding: 2 }}>
          <Box
            sx={{
              width: 110,
              height: 110,
              borderRadius: 1.5,
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: filterCss,
              flexShrink: 0,
              border: 1,
              borderColor: "divider",
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 1 }}>
              <Avatar src={profilePictureUrl(user.profilePicture)} sx={{ width: 28, height: 28 }} />
              <Typography variant="body2" fontWeight={600}>
                {user.username}
              </Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={8}
              placeholder="Write a caption... use #hashtags and @mentions"
              value={caption}
              onChange={(e) => onCaptionChange(e.target.value)}
              variant="standard"
              InputProps={{ disableUnderline: true }}
            />
            {(detectedHashtags.length > 0 || detectedMentions.length > 0) && (
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", marginTop: 1 }}>
                {detectedHashtags.map((tag) => (
                  <Chip key={`h-${tag}`} label={`#${tag}`} size="small" />
                ))}
                {detectedMentions.map((m) => (
                  <Chip key={`m-${m}`} label={`@${m}`} size="small" variant="outlined" />
                ))}
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ borderTop: 1, borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", padding: "8px 16px" }}>
            <LocationOn sx={{ color: "text.secondary", marginRight: 1 }} fontSize="small" />
            <TextField
              fullWidth
              size="small"
              placeholder="Add location"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              onFocus={() => setLocationFocused(true)}
              onBlur={() => setLocationFocused(false)}
              variant="standard"
              InputProps={{ disableUnderline: true }}
            />
          </Box>
        </Box>

        <Box sx={{ borderTop: 1, borderColor: "divider" }}>
          <Box sx={{ padding: "12px 16px" }}>
            <Typography variant="overline" color="text.secondary" sx={{ display: "block", marginBottom: 1 }}>
              Settings
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <Typography variant="body2">Filter</Typography>
              <Typography variant="body2" color="text.secondary">
                {getFilterLabel(filter)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <Typography variant="body2">People tagged</Typography>
              <Typography variant="body2" color="text.secondary">
                {tags.length}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <Typography variant="body2">Hashtags</Typography>
              <Typography variant="body2" color="text.secondary">
                {detectedHashtags.length}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <Typography variant="body2">Mentions</Typography>
              <Typography variant="body2" color="text.secondary">
                {detectedMentions.length}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PostDetails;
