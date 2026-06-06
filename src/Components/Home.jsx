import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getFollowingPosts } from "../Redux/actions";
import Loading from "./Loading";
import SinglePost from "./SinglePost";
import { Box, Button, Container, Grid, IconButton, Typography } from "@mui/material";
import { Message as MessageIcon } from "@mui/icons-material";

export const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getFollowingPosts()).then(() => setLoading(false));
  }, [dispatch]);

  if (loading) return <Loading />;

  return (
    <Container maxWidth="sm" disableGutters>
      <Box sx={{ display: "flex", alignItems: "center", padding: "16px 0" }}>
        <Typography variant="h5" sx={{ flex: 1 }} color="text.primary">
          Social Photo App
        </Typography>
        <IconButton component={Link} to="/messages">
          <MessageIcon />
        </IconButton>
      </Box>
      {posts.length === 0 ? (
        <Box sx={{ textAlign: "center", padding: "40px 20px" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your feed is empty
          </Typography>
          <Typography color="text.secondary" sx={{ marginBottom: 2 }}>
            Follow some people or check out Explore to see what&apos;s new.
          </Typography>
          <Button component={Link} to="/explore" variant="contained">
            Go to Explore
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {posts.map((post) => {
            const isLiked = post.likes?.some((l) => (l._id || l) === user._id);
            return (
              <Grid size={12} key={post._id}>
                <SinglePost post={post} isLiked={isLiked} />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default Home;
