import React, { useState } from "react";
import {
  Button,
  Container,
  Grid,
  Input,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";

// dev server
const currentIP = window.location.href.split(":")[1];
const serverURL = `http:${currentIP}:3003`;

const useStyles = makeStyles({
  root: {},
});

export const Post = (props) => {
  const classes = useStyles();
  const [newUser, setNewUser] = useState({
    name: "",
    birthdate: "",
    photo: "",
  });

  const handlePhoto = (e) => {
    setNewUser({ ...newUser, photo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", newUser.photo);
    formData.append("name", newUser.name);
    console.log(formData);

    axios
      .post(`${serverURL}/upload`, formData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container disableGutters maxWidth="sm" className={classes.root}>
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
