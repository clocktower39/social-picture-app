import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  CardMedia,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Skeleton,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
  TrendingUp,
} from "@mui/icons-material";
import {
  getMyRelationships,
  getExplorePosts,
  getTrendingTags,
  requestFollow,
  requestUnfollow,
} from "../Redux/actions";
import { postImageUrl, profilePictureUrl } from "../api";
import { getFilterCss } from "../filters";


export const UserCard = ({ account }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const relationships = useSelector((state) => state.relationships);
  const isFollowing = relationships.following.some((r) => r._id === account._id);
  const isSelf = user._id === account._id;

  const handleFollow = (e) => {
    e.stopPropagation();
    dispatch(requestFollow(account._id));
  };
  const handleUnfollow = (e) => {
    e.stopPropagation();
    dispatch(requestUnfollow(account._id));
  };
  const goToProfile = () => navigate(`/profile/${account.username}`);

  return (
    <Box
      onClick={goToProfile}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: "10px 4px",
        cursor: "pointer",
        borderRadius: 1,
        "&:hover": { backgroundColor: "action.hover" },
      }}
    >
      <Avatar
        src={profilePictureUrl(account.profilePicture)}
        sx={{ width: 44, height: 44, flexShrink: 0 }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body1" color="text.primary" noWrap>
          {account.username}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {account.firstName} {account.lastName}
        </Typography>
      </Box>
      {!isSelf && (
        isFollowing ? (
          <Button
            variant="outlined"
            size="small"
            onClick={handleUnfollow}
            sx={{ minWidth: 100 }}
          >
            Following
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            onClick={handleFollow}
            sx={{ minWidth: 100 }}
          >
            Follow
          </Button>
        )
      )}
    </Box>
  );
};

const SectionHeader = ({ icon, title, action }) => (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px" }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      {icon}
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
    </Box>
    {action}
  </Box>
);

const FollowingRow = ({ posts, onPostClick }) => {
  if (!posts || posts.length === 0) return null;
  const followingPosts = posts.filter((p) => p._source === "following");
  if (followingPosts.length === 0) return null;

  return (
    <Box>
      <SectionHeader
        icon={<AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 24, height: 24, fontSize: 12 } }}>{followingPosts.slice(0, 4).map((p) => (
          <Avatar key={p._id} src={profilePictureUrl(p.user?.profilePicture)} />
        ))}</AvatarGroup>}
        title="From people you follow"
      />
      <Box sx={{ display: "flex", gap: 1, overflowX: "auto", paddingBottom: 1, scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
        {followingPosts.map((post) => {
          const imageId = post.image?._id || post.image;
          return (
            <Box
              key={post._id}
              onClick={() => onPostClick(post)}
              sx={{
                flex: "0 0 auto",
                width: 140,
                height: 180,
                borderRadius: 2,
                backgroundImage: imageId ? `url(${postImageUrl(imageId)})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: getFilterCss(post.filter),
                position: "relative",
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.65) 100%)",
                }}
              />
              <Box sx={{ position: "absolute", bottom: 8, left: 8, right: 8, color: "white" }}>
                <Typography variant="caption" fontWeight={600} sx={{ display: "block" }} noWrap>
                  @{post.user?.username}
                </Typography>
                {post.caption && (
                  <Typography variant="caption" sx={{ display: "block", opacity: 0.85, fontSize: 10 }} noWrap>
                    {post.caption}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
      <Divider sx={{ marginTop: 1 }} />
    </Box>
  );
};

const GridSkeleton = ({ count = 6 }) => (
  <Grid container spacing={0.5} sx={{ marginTop: 0.5 }}>
    {Array.from({ length: count }).map((_, i) => (
      <Grid size={4} key={i}>
        <Skeleton variant="rectangular" sx={{ paddingTop: "100%", borderRadius: 1 }} />
      </Grid>
    ))}
  </Grid>
);

export const Explore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const posts = useSelector((state) => state.explore.posts);
  const trending = useSelector((state) => state.explore.trendingTags);
  const hasMore = useSelector((state) => state.explore.hasMore);
  const nextCursor = useSelector((state) => state.explore.nextCursor);
  const [sort, setSort] = useState("random");
  const [tagFilter, setTagFilter] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const load = (params, append = false) => {
    if (append) setLoadingMore(true);
    setLoadError(null);
    return dispatch(getExplorePosts(params, { append }))
      .then((action) => {
        setInitialLoading(false);
        setLoadingMore(false);
        if (action?.type === "ERROR") {
          setLoadError(action.error || "Couldn't load posts");
        }
      })
      .catch(() => {
        setInitialLoading(false);
        setLoadingMore(false);
        setLoadError("Couldn't load posts");
      });
  };

  useEffect(() => {
    dispatch(getMyRelationships());
    if (trending.length === 0) dispatch(getTrendingTags());
  }, [dispatch, trending.length]);

  useEffect(() => {
    setInitialLoading(true);
    const params = { sort, limit: 30 };
    if (tagFilter) params.tag = tagFilter;
    load(params, false);
  }, [dispatch, sort, tagFilter]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    const params = { sort, limit: 30, cursor: nextCursor };
    if (tagFilter) params.tag = tagFilter;
    load(params, true);
  };

  const handleRefresh = () => {
    setInitialLoading(true);
    const params = { sort, limit: 30 };
    if (tagFilter) params.tag = tagFilter;
    load(params, false);
  };

  const followingPosts = posts.filter((p) => p._source === "following");
  const discoverPosts = posts.filter((p) => p._source !== "following");

  return (
    <Container maxWidth="sm" sx={{ paddingBottom: "100px" }}>
      <Box sx={{ display: "flex", alignItems: "center", padding: "12px 0", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search"
          onClick={() => navigate("/explore/search")}
          onFocus={() => navigate("/explore/search")}
          readOnly
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            sx: { cursor: "pointer" },
          }}
        />
        <Tooltip title="Refresh" placement="bottom-end">
          <span>
            <IconButton onClick={handleRefresh} disabled={initialLoading}>
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {trending.length > 0 && (
        <Box sx={{ paddingBottom: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
            <TrendingUp sx={{ fontSize: 18 }} />
            <Typography variant="overline" color="text.secondary">
              Trending
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {trending.slice(0, 8).map((t) => (
              <Chip
                key={t.tag}
                size="small"
                label={`#${t.tag}`}
                clickable
                onClick={() => navigate(`/tag/${t.tag}`)}
                variant={tagFilter === t.tag ? "filled" : "outlined"}
                color={tagFilter === t.tag ? "primary" : "default"}
              />
            ))}
          </Box>
        </Box>
      )}

      <Tabs
        value={sort}
        onChange={(_, v) => setSort(v)}
        variant="fullWidth"
        sx={{ minHeight: 36, mb: 1 }}
      >
        <Tab value="random" label="For you" />
        <Tab value="recent" label="Recent" />
        <Tab value="popular" label="Popular" />
      </Tabs>

      {tagFilter && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Chip
            label={`#${tagFilter}`}
            onDelete={() => setTagFilter(null)}
            color="primary"
          />
        </Box>
      )}

      {loadError && (
        <Box sx={{ padding: 2, textAlign: "center" }}>
          <Typography color="error" variant="body2" gutterBottom>
            {loadError}
          </Typography>
          <Button size="small" onClick={handleRefresh}>Try again</Button>
        </Box>
      )}

      {initialLoading ? (
        <>
          <SectionHeader icon={<TrendingUp sx={{ fontSize: 18 }} />} title="Loading..." />
          <GridSkeleton count={9} />
        </>
      ) : posts.length === 0 ? (
        <Box sx={{ padding: "40px 20px", textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No posts to show
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
            Try switching tabs, or follow more people to fill your explore feed.
          </Typography>
          <Button variant="outlined" onClick={handleRefresh}>Refresh</Button>
        </Box>
      ) : (
        <>
          {sort === "random" && followingPosts.length > 0 && (
            <FollowingRow
              posts={followingPosts}
              onPostClick={(post) => navigate("/explore/feed", { state: { startFromId: post._id } })}
            />
          )}

          {sort === "random" && discoverPosts.length > 0 && (
            <SectionHeader
              icon={<TrendingUp sx={{ fontSize: 18 }} />}
              title="Discover"
            />
          )}

          {sort !== "random" && discoverPosts.length > 0 && (
            <SectionHeader
              icon={<TrendingUp sx={{ fontSize: 18 }} />}
              title={
                sort === "recent" ? "Recent posts" : "Popular posts"
              }
            />
          )}

          <Grid container spacing={0.5}>
            {(sort === "random" ? discoverPosts : posts).map((post) => {
              const imageId = post.image?._id || post.image;
              return (
                <Grid size={4} key={post._id}>
                  <Box
                    onClick={() => navigate("/explore/feed", { state: { startFromId: post._id } })}
                    sx={{ position: "relative", cursor: "pointer" }}
                  >
                    <CardMedia
                      sx={{
                        paddingTop: "100%",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: getFilterCss(post.filter),
                      }}
                      image={imageId ? postImageUrl(imageId) : null}
                    />
                    {post.tags?.length > 0 && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 4,
                          left: 4,
                          background: "rgba(0,0,0,0.6)",
                          color: "white",
                          borderRadius: 1,
                          padding: "0 6px",
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        {post.tags.length} 🏷
                      </Box>
                    )}
                    {post._source === "following" && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          background: "rgba(0,0,0,0.6)",
                          color: "white",
                          borderRadius: 1,
                          padding: "0 6px",
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        Following
                      </Box>
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          {hasMore && (
            <Box sx={{ display: "flex", justifyContent: "center", padding: "16px 0" }}>
              <Button variant="outlined" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? "Loading..." : "Load more"}
              </Button>
            </Box>
          )}

          {!hasMore && posts.length > 12 && (
            <Box sx={{ textAlign: "center", padding: "16px 0" }}>
              <Typography variant="caption" color="text.secondary">
                You've reached the end
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Explore;
