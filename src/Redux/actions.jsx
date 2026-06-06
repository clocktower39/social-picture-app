import { jwtDecode as jwt } from "jwt-decode";
import axios from "axios";
import { request, serverURL } from "../api";

export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const UPDATE_USER = "UPDATE_USER";
export const UPDATE_POSTS = "UPDATE_POSTS";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const UPDATE_RELATIONSHIPS = "UPDATE_RELATIONSHIPS";
export const UPDATE_CONVERSATIONS = "UPDATE_CONVERSATIONS";
export const UPDATE_CONVERSATION_MESSAGES = "UPDATE_CONVERSATION_MESSAGES";
export const ADD_CONVERSATION = "ADD_CONVERSATION";
export const UPDATE_NOTIFICATIONS = "UPDATE_NOTIFICATIONS";
export const PUSH_NOTIFICATION = "PUSH_NOTIFICATION";
export const MARK_NOTIFICATIONS_READ = "MARK_NOTIFICATIONS_READ";
export const SET_EXPLORE = "SET_EXPLORE";
export const SET_TRENDING_TAGS = "SET_TRENDING_TAGS";
export const SET_TAG_RESULTS = "SET_TAG_RESULTS";
export const SET_USER_SEARCH = "SET_USER_SEARCH";
export const ERROR = "ERROR";

export { serverURL };

const persistToken = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem("JWT_AUTH_TOKEN", accessToken);
  if (refreshToken) localStorage.setItem("JWT_REFRESH_TOKEN", refreshToken);
};

const errorDispatch = (dispatch, err) => {
  const message = err?.data?.error || err?.message || "Unknown error";
  return dispatch({ type: ERROR, error: message });
};

export function signupUser(user) {
  return async (dispatch) => {
    try {
      await request("/signup", { method: "POST", body: user });
      return dispatch(loginUser({ username: user.username, password: user.password }));
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function loginUser(user) {
  return async (dispatch) => {
    try {
      const data = await request("/login", { method: "POST", body: user });
      persistToken(data.accessToken, data.refreshToken);
      const decoded = jwt(data.accessToken);
      return dispatch({ type: LOGIN_USER, user: decoded });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}export function changePassword(currentPassword, newPassword) {
  return async (dispatch) => {
    try {
      const data = await request("/user/changePassword", {
        method: "POST",
        body: { currentPassword, newPassword },
      });
      persistToken(data.accessToken);
      const decoded = jwt(data.accessToken);
      return dispatch({ type: LOGIN_USER, user: decoded });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export const loginJWT = () => {
  return async (dispatch) => {
    const refreshToken = localStorage.getItem("JWT_REFRESH_TOKEN");
    if (!refreshToken) {
      return dispatch({ type: LOGOUT_USER });
    }
    try {
      const data = await request("/refresh-tokens", { method: "POST", body: { refreshToken } });
      persistToken(data.accessToken);
      const decoded = jwt(data.accessToken);
      return dispatch({ type: LOGIN_USER, user: decoded });
    } catch {
      localStorage.removeItem("JWT_AUTH_TOKEN");
      localStorage.removeItem("JWT_REFRESH_TOKEN");
      return dispatch({ type: LOGOUT_USER });
    }
  };
};

export function logoutUser() {
  return async (dispatch) => {
    localStorage.removeItem("JWT_AUTH_TOKEN");
    localStorage.removeItem("JWT_REFRESH_TOKEN");
    return dispatch({ type: LOGOUT_USER });
  };
}

export function getFollowingPosts() {
  return async (dispatch) => {
    try {
      const data = await request("/post/followingPosts");
      return dispatch({ type: UPDATE_POSTS, posts: data });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function updateUser(user) {
  return async (dispatch) => {
    try {
      const data = await request("/user/update", { method: "POST", body: user });
      persistToken(data.accessToken);
      const decoded = jwt(data.accessToken);
      return dispatch({ type: LOGIN_USER, user: decoded });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function uploadProfilePicture(formData) {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${serverURL}/user/upload/profilePicture`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}` },
      });
      const { accessToken, refreshToken } = response.data;
      persistToken(accessToken, refreshToken);
      if (accessToken) {
        const decoded = jwt(accessToken);
        return dispatch({ type: LOGIN_USER, user: decoded });
      }
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function uploadUserPost(formData) {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${serverURL}/post/upload`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}` },
      });
      return dispatch({ type: UPDATE_POSTS, posts: undefined, prepend: response.data });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function getUserProfilePage(username) {
  return async (dispatch) => {
    try {
      const data = await request(`/user/profile/${username}`);
      return dispatch({
        type: UPDATE_PROFILE,
        user: data.user,
        posts: data.posts,
        following: data.following,
        followers: data.followers,
        isFollowing: data.isFollowing,
      });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function requestFollow(userId) {
  return async (dispatch) => {
    try {
      await request("/follow", { method: "POST", body: { user: userId } });
      return dispatch(getMyRelationships());
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function requestUnfollow(userId) {
  return async (dispatch) => {
    try {
      await request("/unfollow", { method: "POST", body: { user: userId } });
      return dispatch(getMyRelationships());
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function getMyRelationships() {
  return async (dispatch) => {
    try {
      const data = await request("/myRelationships");
      return dispatch({ type: UPDATE_RELATIONSHIPS, followers: data.followers, following: data.following });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function likePost(id, user) {
  return async (dispatch, getState) => {
    try {
      await request("/post/like", { method: "POST", body: { id } });
      const posts = getState().posts;
      const updated = posts.map((post) => {
        if (post._id !== id) return post;
        if (post.likes.some((l) => (l._id || l) === user._id)) return post;
        return { ...post, likes: [...post.likes, { _id: user._id, username: user.username, profilePicture: user.profilePicture }] };
      });
      return dispatch({ type: UPDATE_POSTS, posts: updated });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function unlikePost(id, user) {
  return async (dispatch, getState) => {
    try {
      await request("/post/unlike", { method: "POST", body: { id } });
      const posts = getState().posts;
      const updated = posts.map((post) =>
        post._id === id
          ? { ...post, likes: post.likes.filter((l) => (l._id || l) !== user._id) }
          : post
      );
      return dispatch({ type: UPDATE_POSTS, posts: updated });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function commentPost(id, user, comment, mentions = []) {
  return async (dispatch, getState) => {
    try {
      const data = await request("/post/comment", {
        method: "POST",
        body: { id, comment, mentions },
      });
      const posts = getState().posts;
      const updated = posts.map((post) => (post._id === id ? data.post : post));
      return dispatch({ type: UPDATE_POSTS, posts: updated });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function deleteComment(postId, commentId) {
  return async (dispatch, getState) => {
    try {
      await request("/post/deleteComment", {
        method: "POST",
        body: { id: postId, commentId },
      });
      const posts = getState().posts;
      const updated = posts.map((post) =>
        post._id === postId
          ? { ...post, comments: post.comments.filter((c) => c._id !== commentId) }
          : post
      );
      return dispatch({ type: UPDATE_POSTS, posts: updated });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function likeComment(postId, commentId) {
  return async (dispatch) => {
    try {
      await request("/post/likeComment", {
        method: "POST",
        body: { id: postId, commentId },
      });
      return { success: true };
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function deletePost(postId, imageId) {
  return async (dispatch) => {
    try {
      await request("/post/delete", { method: "POST", body: { postId, imageId } });
      return dispatch(getFollowingPosts());
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function getExplorePosts(params = {}, options = {}) {
  return async (dispatch) => {
    try {
      const search = new URLSearchParams(params).toString();
      const data = await request(`/explore${search ? `?${search}` : ""}`);
      if (options.append) {
        return dispatch({
          type: SET_EXPLORE,
          posts: undefined,
          append: data.posts || [],
          nextCursor: data.nextCursor || null,
          hasMore: Boolean(data.hasMore),
        });
      }
      return dispatch({
        type: SET_EXPLORE,
        posts: data.posts || [],
        nextCursor: data.nextCursor || null,
        hasMore: Boolean(data.hasMore),
      });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function getTrendingTags() {
  return async (dispatch) => {
    try {
      const data = await request("/explore/tags/trending?limit=12");
      return dispatch({ type: SET_TRENDING_TAGS, tags: data.tags });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function getPostsByTag(tag) {
  return async (dispatch) => {
    try {
      const data = await request(`/explore/tags/${encodeURIComponent(tag)}?limit=60`);
      return dispatch({ type: SET_TAG_RESULTS, tag, posts: data.posts, count: data.count });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function searchUsers(query) {
  return async (dispatch) => {
    if (!query) {
      return dispatch({ type: SET_USER_SEARCH, users: [] });
    }
    try {
      const data = await request("/search", { method: "POST", body: { username: query } });
      return dispatch({ type: SET_USER_SEARCH, users: data.users });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function getConversations() {
  return async (dispatch) => {
    try {
      const data = await request("/conversation/getConversations");
      return dispatch({ type: UPDATE_CONVERSATIONS, conversations: data });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function createConversation({ userIds = [], name = null, isGroup = false }) {
  return async (dispatch) => {
    try {
      const conversation = await request("/conversation/create", {
        method: "POST",
        body: { userIds, name, isGroup },
      });
      return dispatch({ type: ADD_CONVERSATION, conversation });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function sendMessage(conversationId, message, mentions = []) {
  return async (dispatch) => {
    try {
      const conversation = await request("/conversation/message/send", {
        method: "POST",
        body: { conversationId, message, mentions },
      });
      return dispatch({ type: UPDATE_CONVERSATION_MESSAGES, conversation });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function socketMessage(conversation) {
  return async (dispatch) => {
    return dispatch({ type: UPDATE_CONVERSATION_MESSAGES, conversation });
  };
}

export function deleteMessage(conversationId, messageId) {
  return async (dispatch) => {
    try {
      const conversation = await request("/conversation/message/delete", {
        method: "POST",
        body: { conversationId, messageId },
      });
      return dispatch({ type: UPDATE_CONVERSATION_MESSAGES, conversation });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function addConversationMembers(conversationId, userIds) {
  return async (dispatch) => {
    try {
      const conversation = await request("/conversation/addMembers", {
        method: "POST",
        body: { conversationId, userIds },
      });
      return dispatch({ type: UPDATE_CONVERSATION_MESSAGES, conversation });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function removeConversationMember(conversationId, userId) {
  return async (dispatch) => {
    try {
      const conversation = await request("/conversation/removeMember", {
        method: "POST",
        body: { conversationId, userId },
      });
      return dispatch({ type: UPDATE_CONVERSATION_MESSAGES, conversation });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function leaveConversation(conversationId) {
  return async (dispatch, getState) => {
    try {
      await request("/conversation/leave", { method: "POST", body: { conversationId } });
      const conversations = getState().conversations.filter((c) => c._id !== conversationId);
      return dispatch({ type: UPDATE_CONVERSATIONS, conversations });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function renameGroup(conversationId, name) {
  return async (dispatch) => {
    try {
      const conversation = await request("/conversation/rename", {
        method: "POST",
        body: { conversationId, name },
      });
      return dispatch({ type: UPDATE_CONVERSATION_MESSAGES, conversation });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function getNotifications() {
  return async (dispatch) => {
    try {
      const data = await request("/notifications");
      return dispatch({
        type: UPDATE_NOTIFICATIONS,
        notifications: data.notifications || [],
        unreadCount: data.unreadCount || 0,
      });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function markNotificationsRead(ids = [], markAll = false) {
  return async (dispatch) => {
    try {
      const data = await request("/notifications/read", {
        method: "POST",
        body: { ids, all: markAll },
      });
      return dispatch({
        type: MARK_NOTIFICATIONS_READ,
        updatedIds: data.updatedIds,
        unreadCount: data.unreadCount,
      });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}

export function socketNotification(notification) {
  return async (dispatch) => {
    return dispatch({ type: PUSH_NOTIFICATION, notification });
  };
}

export function updateThemeMode(mode) {
  return async (dispatch) => {
    try {
      const data = await request("/user/update", { method: "POST", body: { themeMode: mode } });
      persistToken(data.accessToken);
      const decoded = jwt(data.accessToken);
      return dispatch({ type: LOGIN_USER, user: decoded });
    } catch (err) {
      return errorDispatch(dispatch, err);
    }
  };
}
