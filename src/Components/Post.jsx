import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { AddPhotoAlternate } from "@mui/icons-material";
import { uploadUserPost } from "../Redux/actions";
import { getFilterCss } from "../filters";
import PhotoEditor from "./PhotoEditor";
import PostDetails from "./PostDetails";

const STEP_PICK = "pick";
const STEP_EDIT = "edit";
const STEP_DETAILS = "details";

const Post = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [step, setStep] = useState(STEP_PICK);
  const [filter, setFilter] = useState("normal");
  const [tags, setTags] = useState([]);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handlePick = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (!picked.type.startsWith("image/")) {
      setUploadError("Please pick an image file (JPG, PNG, or WebP).");
      return;
    }
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setFile(picked);
    setImageUrl(URL.createObjectURL(picked));
    setFilter("normal");
    setTags([]);
    setCaption("");
    setLocation("");
    setUploadError(null);
    setStep(STEP_EDIT);
  };

  const handlePickAnother = () => {
    setUploadError(null);
    fileRef.current?.click();
  };

  const handleBack = () => {
    if (step === STEP_EDIT) {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      setFile(null);
      setImageUrl(null);
      setFilter("normal");
      setTags([]);
      setCaption("");
      setLocation("");
      setUploadError(null);
      setStep(STEP_PICK);
    } else if (step === STEP_DETAILS) {
      setStep(STEP_EDIT);
    }
  };

  const handleShare = async () => {
    if (!file || submitting) return;
    setSubmitting(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caption", caption);
      formData.append("location", location);
      formData.append("filter", filter);
      formData.append(
        "tags",
        JSON.stringify(tags.map((t) => ({ user: t.user, x: t.x, y: t.y })))
      );
      const result = await dispatch(uploadUserPost(formData));
      if (result?.type === "ERROR") {
        setUploadError(result.error || "Upload failed. Please try again.");
        return;
      }
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      navigate("/");
    } catch (err) {
      setUploadError(err.message || "Upload failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === STEP_EDIT && imageUrl) {
    return (
      <PhotoEditor
        imageUrl={imageUrl}
        imageBlob={file}
        filter={filter}
        filterCss={getFilterCss(filter)}
        tags={tags}
        onFilterChange={setFilter}
        onTagsChange={setTags}
        onBack={handleBack}
        onNext={() => setStep(STEP_DETAILS)}
      />
    );
  }

  if (step === STEP_DETAILS && imageUrl) {
    return (
      <PostDetails
        imageUrl={imageUrl}
        filter={filter}
        filterCss={getFilterCss(filter)}
        caption={caption}
        location={location}
        tags={tags}
        onCaptionChange={setCaption}
        onLocationChange={setLocation}
        onBack={handleBack}
        onShare={handleShare}
        submitting={submitting}
        error={uploadError}
      />
    );
  }

  return (
    <Container maxWidth="sm" disableGutters sx={{ paddingBottom: "100px" }}>
      <Box sx={{ padding: "24px 16px" }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Create new post
        </Typography>
        {uploadError && (
          <Alert severity="error" sx={{ marginBottom: 2 }} onClose={() => setUploadError(null)}>
            {uploadError}
          </Alert>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp"
          onChange={handlePick}
          style={{ display: "none" }}
        />
        <Box
          onClick={handlePickAnother}
          sx={{
            position: "relative",
            width: "100%",
            paddingTop: "100%",
            backgroundColor: "rgba(0,0,0,0.04)",
            borderRadius: 3,
            border: "2px dashed",
            borderColor: "divider",
            cursor: "pointer",
            overflow: "hidden",
            transition: "border-color 0.2s",
            "&:hover": { borderColor: "primary.main" },
          }}
        >
          <Stack
            sx={{
              position: "absolute",
              inset: 0,
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AddPhotoAlternate sx={{ fontSize: 36 }} />
            </Box>
            <Typography variant="h6">Drag photos here</Typography>
            <Button variant="contained" component="span">
              Select from computer
            </Button>
          </Stack>
        </Box>

        <Box sx={{ marginTop: 3 }}>
          <Typography variant="overline" color="text.secondary">
            Tips
          </Typography>
          <Stack component="ul" sx={{ paddingLeft: "20px", marginTop: 1, color: "text.secondary" }} spacing={0.5}>
            <Typography component="li" variant="body2">
              Pick a photo, then apply filters at the bottom of the editor
            </Typography>
            <Typography component="li" variant="body2">
              Tap "Tag people" to position-tag friends in your photo
            </Typography>
            <Typography component="li" variant="body2">
              Add a caption with #hashtags and @mentions in the next step
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default Post;
