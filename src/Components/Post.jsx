import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  CardMedia,
  Container,
  Grid,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { uploadUserPost } from '../Redux/actions';

export const Post = (props) => {
  const dispatch = useDispatch();
  const [uploadPhoto, setUploadPhoto] = useState(null);

  const handlePhoto = (e) => {
    if(e.target.files[0].type.substr(0,6) === 'image/'){
      setUploadPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", uploadPhoto);

    if (uploadPhoto) {
      dispatch(uploadUserPost(formData));
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
            <TextField label="Location" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" fullWidth />
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
};

export default Post;
