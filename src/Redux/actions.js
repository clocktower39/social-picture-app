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
const serverURL = `http:${currentIP}:3003`;

export function signupUser(newUser) {
  return async (dispatch, getState) => {
    const response = await fetch(`${serverURL}/signup`,
      {
        method: "post",
        dataType: "json",
        body: newUser,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    const data = await response.json();
    if (data.error) {
      if (data.error.username) {
        data.error.username = "Please enter a username";
      }
      if (data.error.firstName) {
        data.error.firstName = "Please enter your first name";
      }
      if (data.error.lastName) {
        data.error.lastName = "Please enter your last name";
      }
      if (data.error.email) {
        data.error.email = "Please enter your email";
      }
      if (data.error.password) {
        data.error.password = "Please enter a password";
      }

      return dispatch({
        type: ERROR,
        error: data.error,
      });
    }
    return dispatch({
      type: LOGIN_USER,
      user: data.user,
    });
  };
}

export function loginUser(loginCredentials) {
  return async (dispatch, getState) => {
    const response = await fetch(`${serverURL}/login`,
      {
        method: "post",
        dataType: "json",
        body: loginCredentials,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    const data = await response.json();

    if (!data.authenticated) {
      localStorage.setItem("authenticated", data.authenticated);
      return dispatch({
        type: ERROR,
        error: data.error,
      });
    } else {
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("authenticated", data.authenticated);

      let targetUser = JSON.stringify({ username: data.user.username });

      const requestFollowers = await fetch(`${serverURL}/followers`,
        {
          method: "post",
          dataType: "json",
          body: targetUser,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const followers = await requestFollowers.json();
      data.user.followers = followers.followers;
    }
    return dispatch({
      type: LOGIN_USER,
      user: data.user,
    });
  };
}

export function logoutUser() {
  return {
    type: LOGOUT_USER,
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

export function getPosts(following) {
  return async (dispatch, getState) => {
    let request = JSON.stringify({ following });
    const response = await fetch(`${serverURL}/getPosts`,
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
    return dispatch({
      type: UPDATE_POSTS,
      posts: data.posts,
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
