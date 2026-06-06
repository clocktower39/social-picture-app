import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  AppBar,
  Autocomplete,
  Avatar,
  Box,
  Button,
  IconButton,
  Popover,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { ArrowBack, ArrowForward, Close, PersonAddAlt1 } from "@mui/icons-material";
import { searchUsers } from "../Redux/actions";
import { profilePictureUrl } from "../api";
import FilterStrip from "./FilterStrip";

const TagMarker = ({ tag, index, readOnly = false, onRemove }) => (
  <Box
    sx={{
      position: "absolute",
      left: `${tag.x * 100}%`,
      top: `${tag.y * 100}%`,
      transform: "translate(-50%, -50%)",
      zIndex: 4,
      pointerEvents: readOnly ? "none" : "auto",
    }}
    onClick={(e) => {
      e.stopPropagation();
      if (readOnly) return;
    }}
  >
    <Avatar
      src={profilePictureUrl(tag.profilePicture)}
      sx={{
        width: 32,
        height: 32,
        border: "2px solid white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
      }}
    />
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        top: "100%",
        transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.75)",
        color: "white",
        padding: "2px 8px",
        borderRadius: 1,
        fontSize: 12,
        whiteSpace: "nowrap",
        marginTop: "4px",
        display: "flex",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      @{tag.username}
      {!readOnly && (
        <Close
          fontSize="inherit"
          sx={{ cursor: "pointer", fontSize: 14 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(index);
          }}
        />
      )}
    </Box>
  </Box>
);

const TagUserPicker = ({ anchorEl, onClose, onSelect, excludeIds }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (value) => {
    setQuery(value);
    if (!value) {
      setResults([]);
      return;
    }
    try {
      const action = await dispatch(searchUsers(value));
      const filtered = (action?.users || []).filter((u) => !excludeIds.has(u._id));
      setResults(filtered);
    } catch {
      setResults([]);
    }
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <Box sx={{ p: 1, minWidth: 260, maxWidth: 320 }}>
        <TextField
          autoFocus
          size="small"
          fullWidth
          placeholder="Search people to tag"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Box sx={{ maxHeight: 280, overflow: "auto", mt: 1 }}>
          {query.length === 0 ? (
            <Typography variant="body2" sx={{ p: 1.5, color: "text.secondary" }}>
              Type a username
            </Typography>
          ) : results.length === 0 ? (
            <Typography variant="body2" sx={{ p: 1.5, color: "text.secondary" }}>
              No matches
            </Typography>
          ) : (
            results.map((u) => (
              <Box
                key={u._id}
                onClick={() => {
                  onSelect(u);
                  onClose();
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1,
                  cursor: "pointer",
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <Avatar src={profilePictureUrl(u.profilePicture)} sx={{ width: 32, height: 32 }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" noWrap>{u.username}</Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {u.firstName} {u.lastName}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Popover>
  );
};

const PhotoEditor = ({ imageUrl, imageBlob, filter, filterCss, tags, onFilterChange, onTagsChange, onBack, onNext }) => {
  const imageRef = useRef(null);
  const [taggingMode, setTaggingMode] = useState(false);
  const [pickerAnchor, setPickerAnchor] = useState(null);

  const handleImageClick = (e) => {
    if (!taggingMode) return;
    if (tags.length >= 20) return;
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    setPickerAnchor({ x, y, clientX: e.clientX, clientY: e.clientY });
  };

  const handleTagSelected = (user) => {
    if (!pickerAnchor) return;
    if (tags.some((t) => t.user === user._id)) {
      setPickerAnchor(null);
      return;
    }
    onTagsChange([
      ...tags,
      {
        user: user._id,
        username: user.username,
        profilePicture: user.profilePicture,
        x: pickerAnchor.x,
        y: pickerAnchor.y,
      },
    ]);
    setPickerAnchor(null);
  };

  const handleRemoveTag = (index) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  const excludeIds = new Set(tags.map((t) => t.user));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar sx={{ gap: 1, minHeight: "56px !important" }}>
          <IconButton edge="start" onClick={onBack}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, fontSize: "1rem" }}>
            Edit
          </Typography>
          <Button
            endIcon={<ArrowForward />}
            onClick={onNext}
            disabled={tags.length === 0 && !taggingMode}
          >
            Next
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "rgba(0,0,0,0.9)", position: "relative" }}>
        <Box
          ref={imageRef}
          onClick={handleImageClick}
          sx={{
            flex: 1,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: taggingMode ? "crosshair" : "default",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "relative",
              maxWidth: "100%",
              maxHeight: "100%",
              width: "100%",
              height: "100%",
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: filterCss,
            }}
          />
          {tags.map((tag, i) => (
            <TagMarker
              key={`${tag.user}-${i}`}
              tag={tag}
              index={i}
              readOnly={!taggingMode}
              onRemove={handleRemoveTag}
            />
          ))}
          {taggingMode && (
            <Box
              sx={{
                position: "absolute",
                top: 12,
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0,0,0,0.7)",
                color: "white",
                padding: "6px 12px",
                borderRadius: 2,
                fontSize: 13,
                fontWeight: 500,
                zIndex: 5,
                pointerEvents: "none",
              }}
            >
              Tap a person or thing to tag them
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", backgroundColor: "background.paper", borderTop: 1, borderColor: "divider" }}>
          <Button
            startIcon={<PersonAddAlt1 />}
            onClick={() => {
              setTaggingMode((p) => !p);
              setPickerAnchor(null);
            }}
            variant={taggingMode ? "contained" : "text"}
            size="small"
          >
            {taggingMode ? "Done tagging" : "Tag people"}
          </Button>
          {tags.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              {tags.length} tagged
            </Typography>
          )}
        </Box>
      </Box>

      <FilterStrip selected={filter} onSelect={onFilterChange} imageUrl={imageUrl} />

      <TagUserPicker
        anchorEl={pickerAnchor}
        onClose={() => setPickerAnchor(null)}
        onSelect={handleTagSelected}
        excludeIds={excludeIds}
      />
    </Box>
  );
};

export default PhotoEditor;
