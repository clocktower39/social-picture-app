import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CardMedia, Chip, Container, Grid, IconButton, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { getPostsByTag } from "../Redux/actions";
import { postImageUrl } from "../api";
import { getFilterCss } from "../filters";
import Loading from "./Loading";
import SinglePost from "./SinglePost";

export default function TagResults() {
  const { tag } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const { tagResults } = useSelector((state) => state.explore);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    dispatch(getPostsByTag(tag)).then(() => setLoading(false));
  }, [dispatch, tag]);

  if (loading) return <Loading />;

  return (
    <Container maxWidth="sm" sx={{ paddingBottom: "100px" }}>
      <Grid container alignItems="center" sx={{ padding: "12px 0" }}>
        <Grid size={1}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
        </Grid>
        <Grid size={11}>
          <Typography variant="h5">#{tagResults.tag || tag}</Typography>
          <Typography variant="caption" color="text.secondary">
            {tagResults.count} {tagResults.count === 1 ? "post" : "posts"}
          </Typography>
        </Grid>
      </Grid>
      {tagResults.posts.length === 0 ? (
        <Box sx={{ padding: "40px 0", textAlign: "center" }}>
          <Typography color="text.secondary">No posts for this tag yet.</Typography>
        </Box>
      ) : (
        <Grid container spacing={0.5}>
          {tagResults.posts.map((post) => {
            const isLiked = post.likes?.some((l) => (l._id || l) === user._id);
            const imageId = post.image?._id || post.image;
            return (
              <Grid size={4} key={post._id}>
                <Box
                  onClick={() => setSelected(post)}
                  sx={{ position: "relative", cursor: "pointer" }}
                >
                  <CardMedia
                    sx={{
                      paddingTop: "100%",
                      backgroundSize: "cover",
                      filter: getFilterCss(post.filter),
                    }}
                    image={imageId ? postImageUrl(imageId) : null}
                  />
                  {post.tags?.length > 0 && (
                    <Chip
                      label={post.tags.length}
                      size="small"
                      sx={{ position: "absolute", top: 4, right: 4, fontSize: 10 }}
                    />
                  )}
                </Box>
                {selected?._id === post._id && (
                  <SinglePost
                    post={post}
                    isLiked={isLiked}
                    onClose={() => setSelected(null)}
                  />
                )}
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
