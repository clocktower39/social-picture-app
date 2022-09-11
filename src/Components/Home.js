import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getFollowingPosts } from "../Redux/actions";
import Loading from "./Loading";
import SinglePost from "./SinglePost";
import { Container, Grid, IconButton, Typography } from "@mui/material";
import { Message as MessageIcon } from "@mui/icons-material";

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
  const user = useSelector((state) => state.user);
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
      <Grid justify="center" container spacing={3} sx={classes.gridContainer}>
        <Grid container item xs={12}>
          <Grid container item xs={6}>
            <Typography variant="h5">Social Photo App</Typography>
          </Grid>
          <Grid container item xs={6} sx={{ justifyContent: 'flex-end', }} >
            <IconButton component={Link} to="/messages" ><MessageIcon /></IconButton>
          </Grid>
        </Grid>

        {loading ? (
          <Loading />
        ) : posts.length >= 1 ? (
          posts.map((post) => {
            const isLiked = post.likes.some((u) => u._id === user._id);
            return (
              <SinglePost
                key={`post-${post.image}`}
                post={post}
                likes={post.likes}
                isLiked={isLiked}
              />
            );
          })
        ) : (
          "Loading"
        )}
      </Grid>
    </Container>
  );
};

export default Home;
