import jwt from "jwt-decode";
import axios from "axios";

export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const UPDATE_USER = "UPDATE_USER";
export const UPDATE_POSTS = "UPDATE_POSTS";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const UPDATE_RELATIONSHIPS = "UPDATE_RELATIONSHIPS";
export const ERROR = "ERROR";

// dev server
const currentIP = window.location.href.split(":")[1];
export const serverURL = `http:${currentIP}:3003`;

// live server
// export const serverURL = 'https://social-picture-app.herokuapp.com';

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

    const text = await response.text().then(item => item);
    if (text === "Authorized") {
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

export function getFollowingPosts() {
  return async (dispatch, getState) => {
    const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;

    const response = await fetch(`${serverURL}/post/followingPosts`,
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

export function updateUser(user) {
  return async (dispatch, getState) => {
    return dispatch({
      type: UPDATE_USER,
      user: user,
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

export function getUserProfilePage(username) {
  return async (dispatch, getState) => {
    const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;
    axios
      .get(`${serverURL}/user/profile/${username}`, { headers: { Authorization: bearer } })
      .then(async (res) => {
        const data = res.data;

        return dispatch({
          type: UPDATE_PROFILE,
          posts: data.posts,
          user: data.user,
          following: data.following,
          followers: data.followers,
        });
      })
  }
}

export function requestFollow(user) {
  return async (dispatch, getState) => {
    const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;

    const response = await fetch(`${serverURL}/follow`, {
      method: "post",
      dataType: "json",
      body: JSON.stringify({ user }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": bearer,
      },
    });
    const data = await response.json();
    console.log(data);
  }
}

export function requestUnfollow(user) {
  return async (dispatch, getState) => {
    const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;

    const response = await fetch(`${serverURL}/unfollow`, {
      method: "post",
      dataType: "json",
      body: JSON.stringify({ user }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": bearer,
      },
    });
    const data = await response.json();
    console.log(data);
  }
}

export function getMyRelationships() {
  return async (dispatch, getState) => {
    const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;

    const response = await fetch(`${serverURL}/myRelationships`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": bearer,
      },
    });
    const data = await response.json();
    if (data.error) {
      return dispatch({
        type: ERROR,
        error: data.error,
      });
    }

    return dispatch({
      type: UPDATE_RELATIONSHIPS,
      following: data.following,
      followers: data.followers,
    });
  }
}

export function likePost(id, user) {
  return async (dispatch, getState) => {
    const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;
    const posts = getState().posts;

    const response = await fetch(`${serverURL}/post/like`, {
      method: "post",
      dataType: "json",
      body: JSON.stringify({ id }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": bearer,
      },
    });
    if (response.status === 200) {
      const updatedLikes = posts.map(post => {
        if (post._id === id) {
          if (!post.likes.includes(user._id)) {
            post.likes.push({
              _id: user._id,
              username: user.username,
              profilePicture: user.profilePicture || null,
            });
          }
        }
        return post;
      });

      return dispatch({
        type: UPDATE_POSTS,
        posts: updatedLikes,
      });
    }
  }
}

export function unlikePost(id, user) {
  return async (dispatch, getState) => {
    const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;
    const posts = getState().posts;

    const response = await fetch(`${serverURL}/post/unlike`, {
      method: "post",
      dataType: "json",
      body: JSON.stringify({ id }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": bearer,
      },
    });
    if (response.status === 200) {
      const removedLikes = posts.map(post => {
        if (post._id === id) {
          const removeLike = post.likes.filter(like => like._id !== user._id);
          post.likes = removeLike;
        }
        return post;
      })


      return dispatch({
        type: UPDATE_POSTS,
        posts: removedLikes,
      });
    }
  };
}

export function commentPost(id, user, comment) {
  return async (dispatch, getState) => {
    const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;
    const posts = getState().posts;

    const response = await fetch(`${serverURL}/post/comment`, {
      method: "post",
      dataType: "json",
      body: JSON.stringify({ id, comment }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": bearer,
      },
    });
    if (response.status === 200) {
      const updatedComments = posts.map(post => {
        if (post._id === id) {
          if (!post.likes.includes(user._id)) {
            post.comments.push({
              user,
              comment,
              likes: [],
            });
          }
        }
        return post;
      });

      return dispatch({
        type: UPDATE_POSTS,
        posts: updatedComments,
      });
    }
  }
}

export function deletePost(postId, imageId) {
  return async (dispatch, getState) => {
    const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;

    const response = await fetch(`${serverURL}/post/delete`, {
      method: "post",
      dataType: "json",
      body: JSON.stringify({ postId, imageId }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": bearer,
      },
    });
    if (response.status === 200) {
      return dispatch(getFollowingPosts());
    }
  }
}