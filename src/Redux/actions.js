import jwt from "jwt-decode";
import axios from "axios";

export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const CREATE_POST = "CREATE_POST";
export const DELETE_POST = "DELETE_POST";
export const UPDATE_USER = "UPDATE_USER";
export const UPDATE_POSTS = "UPDATE_POSTS";
export const UPDATE_FOLLOWING = "UPDATE_FOLLOWING";
export const ERROR = "ERROR";

// dev server
const currentIP = window.location.href.split(":")[1];
export const serverURL = `http:${currentIP}:3003`;

export function signupUser(user) {
  return async (dispatch) => {
    const response = await fetch(`${serverURL}/signup`, {
      method: "post",
      dataType: "json",
      body: user,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const data = await response.json();
    if (data.error) {
      return dispatch({
        type: ERROR,
        error: data.error,
      });
    }

    return dispatch(loginUser(user));
  };
}

// Retrieves new JWT Token from username and password post request
export function loginUser(user) {
  return async (dispatch) => {
    const response = await fetch(`${serverURL}/login`, {
      method: "post",
      dataType: "json",
      body: user,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const data = await response.json();
    if (data.error) {
      return dispatch({
        type: ERROR,
        error: data.error,
      });
    }
    const accessToken = data.accessToken;
    const decodedAccessToken = jwt(accessToken);

    localStorage.setItem("JWT_AUTH_TOKEN", accessToken);
    return dispatch({
      type: LOGIN_USER,
      user: decodedAccessToken,
    });
  };
}

// Logs into account with JWT token
export const loginJWT = (token) => {
  return async (dispatch, getState) => {
      const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;

      const response = await fetch(`${serverURL}/checkAuthToken`, {
          headers: {
              "Authorization": bearer,
          }
      })

      const text = await response.text().then(item=>item);
      if(text === "Authorized"){
          const decodedAccessToken = jwt(token);
          return dispatch({
              type: LOGIN_USER,
              user: decodedAccessToken,
          });
      }
      else {
          localStorage.removeItem('JWT_AUTH_TOKEN');
          return dispatch({
              type: LOGOUT_USER
          })
      }
  }
}

export function logoutUser() {
  return async (dispatch) => {
    localStorage.removeItem("JWT_AUTH_TOKEN");
    return dispatch({
      type: LOGOUT_USER,
    });
  };
}

export function updateFollowing(username, following) {
  return async (dispatch, getState) => {
    let request = JSON.stringify({ username, following });
    const response = await fetch(`${serverURL}/followUser`,
      {
        method: "post",
        dataType: "json",
        body: request,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    const data = await response.json();
    console.log(data);
    return dispatch({
      type: UPDATE_FOLLOWING,
      following,
    });
  };
}

export function getFollowingPosts(following) {
  return async (dispatch, getState) => {
    const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;

    const response = await fetch(`${serverURL}/followingPosts`,
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": bearer,
        },
      }
    );
    const data = await response.json();
    return dispatch({
      type: UPDATE_POSTS,
      posts: data,
    });
  };
}

export function createPost(post) {
  return {
    type: CREATE_POST,
    post,
  };
}

export function deletePost() {
  return {
    type: DELETE_POST,
  };
}

export function updateUser(user) {
  return async (dispatch, getState) => {
    return dispatch({
      type: UPDATE_USER,
      user: user,
    });
  };
}

export function likePost(post) {
  return async (dispatch, getState) => {
    const state = getState();

    const posts = state.posts.map((p) => {
      if (post.src === p.src) {
        p.likes.push(state.user.username);
      }
      return p;
    });

    return dispatch({
      type: UPDATE_POSTS,
      posts,
    });
  };
}

export function removeLikeFromPost(post) {
  return async (dispatch, getState) => {
    const state = getState();

    const posts = state.posts.map((p) => {
      if (post.src === p.src) {
        p.likes = p.likes.filter((like) => like !== state.user.username);
      }
      return p;
    });

    return dispatch({
      type: UPDATE_POSTS,
      posts,
    });
  };
}

export function commentOnPost(post, remark) {
  return async (dispatch, getState) => {
    const state = getState();

    const posts = state.posts.map((p) => {
      if (post.src === p.src) {
        p.comments.push(remark);
      }
      return p;
    });

    return dispatch({
      type: UPDATE_POSTS,
      posts,
    });
  };
}

export function uploadProfilePicture(formData) {
  return async (dispatch, getState) => {
      const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;

      axios
          .post(`${serverURL}/user/upload/profilePicture`, formData, { headers: { Authorization: bearer } })
          .then((res) => {
              console.log(res);
          })
          .catch((err) => {
              console.log(err);
          });
  }
}

export function uploadUserPost(formData) {
  return async (dispatch, getState) => {
      const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;

      axios
          .post(`${serverURL}/post/upload`, formData, { headers: { Authorization: bearer } })
          .then((res) => {
              console.log(res);
          })
          .catch((err) => {
              console.log(err);
          });
  }
}