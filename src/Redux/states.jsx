export let user = {};

export let posts = [];

export let profile = {
  user: {},
  posts: [],
  following: [],
  followers: [],
  isFollowing: false,
};

export let relationships = {
  following: [],
  followers: [],
};

export let conversations = [];

export let notifications = {
  items: [],
  unreadCount: 0,
};

export let explore = {
  posts: [],
  trendingTags: [],
  tagResults: { tag: null, posts: [], count: 0 },
  userSearch: [],
  nextCursor: null,
  hasMore: false,
};

export const error = {};
