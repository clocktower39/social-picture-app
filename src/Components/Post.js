import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Container,
  Grid,
  Input,
  TextField,
} from "@mui/material";
import { uploadUserPost } from '../Redux/actions';

export const Post = (props) => {
  const dispatch = useDispatch();
  const [uploadPhoto, setUploadPhoto] = useState(null);

  const handlePhoto = (e) => {
    setUploadPhoto(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", uploadPhoto);

    if(uploadPhoto){
      dispatch(uploadUserPost(formData));
    }
  };

  return (
    <Container disableGutters maxWidth="sm" >
      <form onSubmit={handleSubmit} encType="multipart/form-data">
      <Grid container>
        <Grid item xs={12}>
          <Input
            type="file"
            accept=".png, .jpg, .jpeg"
            name="photo"
            onChange={handlePhoto}
            fullWidth
          />
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
