import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  AppBar,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { ArrowBack, Search as SearchIcon, TrendingUp } from "@mui/icons-material";
import { searchUsers, getPostsByTag, getTrendingTags, requestFollow, requestUnfollow } from "../Redux/actions";
import { postImageUrl, debounce } from "../api";
import { getFilterCss } from "../filters";

const SearchPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState(0);
  const users = useSelector((state) => state.explore.userSearch);
  const trending = useSelector((state) => state.explore.trendingTags);
  const [tagPosts, setTagPosts] = useState([]);

  useEffect(() => {
    if (trending.length === 0) dispatch(getTrendingTags());
  }, [dispatch, trending.length]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value, currentTab) => {
        if (currentTab === 0) {
          dispatch(searchUsers(value));
        } else if (currentTab === 1) {
          const tag = value.startsWith("#") ? value.slice(1) : value;
          if (tag) {
            dispatch(getPostsByTag(tag)).then((action) => {
              if (action?.posts) setTagPosts(action.posts);
              else setTagPosts([]);
            });
          } else {
            setTagPosts([]);
          }
        }
      }, 300),
    [dispatch]
  );

  useEffect(() => {
    debouncedSearch(query, tab);
  }, [query, tab, debouncedSearch]);

  const handleBack = () => {
    navigate("/explore");
  };

  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar sx={{ gap: 1, minHeight: "56px !important", paddingLeft: "8px !important", paddingRight: "12px !important" }}>
          <IconButton
            edge="start"
            onClick={handleBack}
            aria-label="Back to explore"
            data-testid="search-back-button"
          >
            <ArrowBack />
          </IconButton>
          <TextField
            autoFocus
            fullWidth
            size="small"
            placeholder="Search users, tags, or locations"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            variant="standard"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              disableUnderline: true,
            }}
            sx={{ marginLeft: 1 }}
          />
        </Toolbar>
      </AppBar>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
        <Tab label="People" />
        <Tab label="Tags" />
        <Tab label="Places" />
      </Tabs>
      <Box sx={{ padding: 2 }}>
        {tab === 0 && (
          <>
            {query.length === 0 ? (
              <Typography color="text.secondary" variant="body2">
                Type to find people
              </Typography>
            ) : users.length === 0 ? (
              <Typography color="text.secondary" variant="body2">
                No users found
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {users.map((account) => (
                  <SearchUserCard key={account._id} account={account} />
                ))}
              </Grid>
            )}
          </>
        )}
        {tab === 1 && (
          <>
            {query.length === 0 ? (
              <Box>
                <Typography variant="overline" color="text.secondary">
                  <TrendingUp sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.5 }} />
                  Trending tags
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {trending.map((t) => (
                    <Chip
                      key={t.tag}
                      label={`#${t.tag} (${t.count})`}
                      clickable
                      onClick={() => setQuery(`#${t.tag}`)}
                    />
                  ))}
                </Box>
              </Box>
            ) : tagPosts.length === 0 ? (
              <Typography color="text.secondary" variant="body2">
                No posts for this tag
              </Typography>
            ) : (
              <Grid container spacing={0.5}>
                {tagPosts.map((post) => {
                  const imageId = post.image?._id || post.image;
                  return (
                    <Grid size={4} key={post._id}>
                      <CardMedia
                        sx={{
                          paddingTop: "100%",
                          backgroundSize: "cover",
                          filter: getFilterCss(post.filter),
                        }}
                        image={imageId ? postImageUrl(imageId) : null}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </>
        )}
        {tab === 2 && (
          <Typography color="text.secondary" variant="body2">
            Place search coming soon. Try a tag like #paris for now.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const SearchUserCard = ({ account }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  return (
    <Box
      onClick={() => navigate(`/profile/${account.username}`)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: "8px 0",
        cursor: "pointer",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Box sx={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "action.hover" }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body1" color="text.primary" noWrap>
          {account.username}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {account.firstName} {account.lastName}
        </Typography>
      </Box>
      {!isSelf &&
        (isFollowing ? (
          <Chip label="Following" onClick={handleUnfollow} />
        ) : (
          <Chip label="Follow" color="primary" onClick={handleFollow} />
        ))}
    </Box>
  );
};

export default SearchPage;
