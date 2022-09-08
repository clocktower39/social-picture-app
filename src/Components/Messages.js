import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Container, Grid, Typography, } from "@mui/material";

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
          <Grid container item xs={12}>
            <Typography variant="h5" textAlign="center" >Messages</Typography>
          </Grid>
      </Grid>
    </Container>
  )
}
