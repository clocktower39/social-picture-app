import { jwtDecode as jwt } from "jwt-decode";
import axios from "axios";

export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const UPDATE_USER = "UPDATE_USER";
export const UPDATE_POSTS = "UPDATE_POSTS";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const UPDATE_RELATIONSHIPS = "UPDATE_RELATIONSHIPS";
export const UPDATE_CONVERSATIONS = "UPDATE_CONVERSATIONS";
export const UPDATE_CONVERSATION_MESSAGES = "UPDATE_CONVERSATION_MESSAGES";
export const ERROR = "ERROR";

// dev server
// const currentIP = window.location.href.split(":")[1];
// export const serverURL = `http:${currentIP}:3003`;

// live server
export const serverURL = 'https://social-picture-app.herokuapp.com';

export function signupUser(user) {
  return async (dispatch) => {
    const response = await fetch(`${serverURL}/signup`, {
      method: "post",
      dataType: "json",
      body: JSON.stringify(user),
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

    return dispatch(loginUser({ email: user.email, password: user.password }));
  };
}

// Retrieves new JWT Token from username and password post request
export function loginUser(user) {
  return async (dispatch) => {
    const response = await fetch(`${serverURL}/login`, {
      method: "post",
      dataType: "json",
      body: JSON.stringify(user),
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
    const refreshToken = data.refreshToken;
    const decodedAccessToken = jwt(accessToken);

    localStorage.setItem("JWT_AUTH_TOKEN", accessToken);
    localStorage.setItem("JWT_REFRESH_TOKEN", refreshToken);
    return dispatch({
      type: LOGIN_USER,
      user: decodedAccessToken,
    });
  };
}

export function changePassword(currentPassword, newPassword) {
  return async (dispatch, getState) => {
    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;

    const response = await fetch(`${serverURL}/changePassword`, {
      method: "post",
      dataType: "json",
      body: JSON.stringify({ currentPassword, newPassword }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: bearer,
      },
    });
    const data = await response.json();
    if (data.error) return data;

    const accessToken = data.accessToken;
    const decodedAccessToken = jwt(accessToken);

    localStorage.setItem("JWT_AUTH_TOKEN", accessToken);
    return dispatch({
      type: LOGIN_USER,
      agent: decodedAccessToken,
    });
  };
}

// Logs into account with JWT token
export const loginJWT = () => {
  return async (dispatch) => {
    const refreshToken = localStorage.getItem("JWT_REFRESH_TOKEN");

    const response = await fetch(`${serverURL}/refresh-tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify({ refreshToken }), // Send the refresh token in the request body
    });

    const data = await response.json();
    if (data.accessToken) {
      const decodedAccessToken = jwt(data.accessToken);
      localStorage.setItem("JWT_AUTH_TOKEN", data.accessToken);
      return dispatch({
        type: LOGIN_USER,
        user: decodedAccessToken,
      });
    } else {
      return dispatch({
        type: LOGOUT_USER,
      });
    }
  };
};


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
  return async (dispatch) => {
    const bearer = `Bearer ${localStorage.getItem("JWT_AUTH_TOKEN")}`;

    const response = await fetch(`${serverURL}/user/update`, {
      method: "post",
      dataType: "json",
      body: JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        description: user.description,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: bearer,
      },
    });
    const data = await response.json();

    if (data.status === "error") {
      return dispatch({
        type: ERROR,
        error: "User not updated",
      });
    } else {
      localStorage.setItem("JWT_AUTH_TOKEN", data.accessToken);
      const decodedAccessToken = jwt(data.accessToken);
      return dispatch({
        type: LOGIN_USER,
        user: decodedAccessToken,
      });
    }
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

export function getConversations() {
  return async (dispatch, getState) => {
    const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;

    const response = await fetch(`${serverURL}/conversation/getConversations`, {
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
      type: UPDATE_CONVERSATIONS,
      conversations: data
    });
  }
}

export function sendMessage(conversationId, message) {
  return async (dispatch, getState) => {
    const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;

    const response = await fetch(`${serverURL}/conversation/message/send`, {
      method: "post",
      dataType: "json",
      body: JSON.stringify({ conversationId, message }),
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
      type: UPDATE_CONVERSATION_MESSAGES,
      conversation: { ...data }
    });
  }
}

export function socketMessage(conversation) {
  return async (dispatch) => {
    return dispatch({
      type: UPDATE_CONVERSATION_MESSAGES,
      conversation
    })
  }
}

export function deleteMessage(conversationId, messageId) {
  return async (dispatch, getState) => {
    const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;

    const response = await fetch(`${serverURL}/conversation/message/delete`, {
      method: "post",
      dataType: "json",
      body: JSON.stringify({ conversationId, messageId }),
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
      type: UPDATE_CONVERSATION_MESSAGES,
      conversation: { ...data }
    });
  }
}

export function updateThemeMode(mode) {
  return async (dispatch) => {
    const bearer = `Bearer ${localStorage.getItem('JWT_AUTH_TOKEN')}`;
    const response = await fetch(`${serverURL}/user/update`, {
      method: 'post',
      dataType: 'json',
      body: JSON.stringify({ themeMode: mode }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": bearer,
      }
    })
    const data = await response.json();
    if (data.error) {
      return dispatch({
        type: ERROR,
        error: data.error
      });
    }
    const accessToken = data.accessToken;
    const decodedAccessToken = jwt(accessToken);

    localStorage.setItem('JWT_AUTH_TOKEN', accessToken);
    return dispatch({
      type: LOGIN_USER,
      user: decodedAccessToken,
    });
  }
}
