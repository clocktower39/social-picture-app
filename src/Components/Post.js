import React, { useState } from "react";
import {
  Button,
  Container,
  Grid,
  Input,
  makeStyles,
  TextField,
} from "@material-ui/core";
import axios from "axios";

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
      .post("http://localhost:3000/upload/", formData)
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
