export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const CREATE_POST = 'CREATE_POST';
export const DELETE_POST = 'DELETE_POST';
export const UPDATE_USER = 'UPDATE_USER';
export const UPDATE_POSTS = 'UPDATE_POSTS';
export const UPDATE_FOLLOWING = 'UPDATE_FOLLOWING';
export const ERROR = 'ERROR';

export function signupUser(newUser){
    return async (dispatch, getState) => {
        const response = await fetch('http://mattkearns.ddns.net:3000/signup', {
            method: 'post',
            dataType: 'json',
            body: newUser,
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          })
          const data = await response.json();
          if(data.error){
            if(data.error.username){data.error.username='Please enter a username'}
            if(data.error.firstName){data.error.firstName='Please enter your first name'}
            if(data.error.lastName){data.error.lastName='Please enter your last name'}
            if(data.error.email){data.error.email='Please enter your email'}
            if(data.error.password){data.error.password='Please enter a password'}
            
            return dispatch({
                type: ERROR,
                error: data.error
            });
          }
          return dispatch({
              type: LOGIN_USER,
              user: data.user
          })

    }
}

export function loginUser(loginCredentials){
    return async (dispatch, getState) => {
        const response = await fetch('http://mattkearns.ddns.net:3000/login', {
            method: 'post',
            dataType: 'json',
            body: loginCredentials,
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          })
        const data = await response.json();

        if(!data.authenticated){
            localStorage.setItem('authenticated', data.authenticated);
            return dispatch({
                type: ERROR,
                error: data.error
            });
        }
        else {
            localStorage.setItem('username', data.user.username);
            localStorage.setItem('authenticated', data.authenticated);
            
            let targetUser = JSON.stringify({username: data.user.username});

            const requestFollowers = await fetch('http://mattkearns.ddns.net:3000/followers', {
                method: 'post',
                dataType: 'json',
                body: targetUser,
                headers: {
                "Content-type": "application/json; charset=UTF-8"
                }
            })
            const followers = await requestFollowers.json();
            data.user.followers = followers.followers;
        }
        return dispatch({
            type: LOGIN_USER,
            user: data.user
        });
    }
}

export function logoutUser(){
    return {
        type: LOGOUT_USER
    }
}

export function updateFollowing(username, following){
    return async (dispatch, getState) => {
        let request = JSON.stringify({username, following});
        const response = await fetch('http://mattkearns.ddns.net:3000/followUser', {
            method: 'post',
            dataType: 'json',
            body: request,
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          })
          const data = await response.json();
          console.log(data);
        return dispatch({
            type: UPDATE_FOLLOWING,
            following,
        })
    }
}

export function getPosts(following){
    return async (dispatch, getState) => {
        let request = JSON.stringify({following});
        const response = await fetch('http://mattkearns.ddns.net:3000/getPosts', {
            method: 'post',
            dataType: 'json',
            body: request,
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          })
          const data = await response.json();
          console.log(data.posts);
          return dispatch({
              type: UPDATE_POSTS,
              posts: data.posts
          })
    }
}

export function createPost(post){
    return {
        type: CREATE_POST,
        post,
    }
}

export function deletePost(){
    return {
        type: DELETE_POST
    }
}

export function updateUser(){
    return {
        type: UPDATE_USER,
    }
}