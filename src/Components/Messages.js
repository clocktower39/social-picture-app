import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Container, Grid, IconButton, Typography, } from "@mui/material";
import { Create, } from "@mui/icons-material";

const classes = {
  root: {
    paddingBottom: "75px",
  },
  gridContainer: {
    scrollBehavior: "smooth",
  },
};
export default function Messages() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const messages = useSelector(state => state.messages);
  
  return (
    <Container maxWidth="sm" sx={classes.root} disableGutters>
      <Grid justify="center" container spacing={3} sx={classes.gridContainer}>
          <Grid container item xs={6}>
            <Typography variant="h5" component={Link} to="/" sx={{ textDecoration: 'none', color: 'text.primary', }} >Social Photo App</Typography>
          </Grid>
          <Grid container item xs={6} sx={{ justifyContent: 'flex-end', }} >
            <IconButton component={Link} to="/messages" ><Create /></IconButton>
          </Grid>
      </Grid>
    </Container>
  )
}
