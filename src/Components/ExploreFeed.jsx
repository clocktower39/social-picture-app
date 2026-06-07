import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { getExplorePosts } from "../Redux/actions";
import SinglePost from "./SinglePost";

const ExploreFeed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const posts = useSelector((state) => state.explore.posts);
  const hasMore = useSelector((state) => state.explore.hasMore);
  const nextCursor = useSelector((state) => state.explore.nextCursor);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const startFromId = location.state?.startFromId;
  const targetRef = useRef(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (posts.length === 0) {
      const params = { sort: "random", limit: 30 };
      dispatch(getExplorePosts(params));
    }
  }, [dispatch, posts.length]);

  useEffect(() => {
    if (!hasMountedRef.current && targetRef.current) {
      hasMountedRef.current = true;
      const headerHeight = 56;
      const top = targetRef.current.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: "auto" });
    }
  }, [posts.length]);

  const handleBack = () => {
    navigate("/explore");
  };

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    dispatch(getExplorePosts({ sort: "random", limit: 30, cursor: nextCursor }, { append: true }))
      .finally(() => setLoadingMore(false));
  };

  let orderedPosts = posts;
  if (startFromId) {
    const idx = posts.findIndex((p) => p._id === startFromId);
    if (idx > 0) {
      orderedPosts = [...posts.slice(idx), ...posts.slice(0, idx)];
    }
  }

  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
      <AppBar position="sticky" color="default" elevation={1}>
        <Container maxWidth="sm" disableGutters>
          <Toolbar sx={{ gap: 1, minHeight: "56px !important", paddingLeft: "8px !important", paddingRight: "12px !important" }}>
            <IconButton edge="start" onClick={handleBack} aria-label="Back to explore">
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ flex: 1, fontSize: "1rem", fontWeight: 600 }}>
              Explore
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="sm" disableGutters sx={{ paddingBottom: "100px" }}>
        {orderedPosts.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <CircularProgress />
          </Box>
        ) : (
          orderedPosts.map((post, index) => {
            const isLiked = post.likes?.some((u) => (u._id || u) === user._id);
            const isTarget = startFromId && post._id === startFromId;
            return (
              <Box
                key={post._id}
                ref={isTarget ? targetRef : null}
                sx={{ paddingTop: index === 0 ? 2 : 0 }}
              >
                <SinglePost
                  post={post}
                  isLiked={isLiked}
                  onClose={handleBack}
                />
                {index < orderedPosts.length - 1 && <Divider sx={{ marginY: 1 }} />}
              </Box>
            );
          })
        )}

        {orderedPosts.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", padding: "24px 16px" }}>
            {hasMore ? (
              <Button variant="outlined" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? "Loading..." : "Load more"}
              </Button>
            ) : (
              <Typography variant="caption" color="text.secondary">
                You've reached the end
              </Typography>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ExploreFeed;
