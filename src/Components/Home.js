import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFollowingPosts, } from "../Redux/actions";
import Loading from "./Loading";
import SinglePost from "./SinglePost";
import {
  Container,
  Grid,
  Typography,
} from "@mui/material";

const classes = {
  root: {
    paddingBottom: "75px",
  },
  gridContainer: {
    scrollBehavior: "smooth",
  },
};

export const Home = (props) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getFollowingPosts()).then(() => {
      setLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <Container maxWidth="sm" sx={classes.root} disableGutters>
      <Grid
        justify="center"
        container
        spacing={3}
        sx={classes.gridContainer}
      >
        <Grid item xs={12}>
          <Typography variant="h5">Social Photo App</Typography>
        </Grid>

        {loading ? (
          <Loading />
        ) : posts.length >= 1 ? (
          posts.map((post, index) => <SinglePost key={`post-${post.image}`} post={post} index={index} />)
        ) : (
          'Loading'
        )}
      </Grid>
    </Container>
  );
};

export default Home;
