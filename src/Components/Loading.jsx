import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const classes = {
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
};

export default function Loading() {

  return (
    <Box sx={classes.root}>
      <Typography variant="h4" color="text.primary">Loading</Typography>
      <CircularProgress />
    </Box>
  );
}
