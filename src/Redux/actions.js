export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const CREATE_POST = 'CREATE_POST';
export const DELETE_POST = 'DELETE_POST';
export const UPDATE_USER = 'UPDATE_USER';
export const UPDATE_FOLLOWING = 'UPDATE_FOLLOWING';

//not finished
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
        }
        else {
            localStorage.setItem('username', data.user.username);
            localStorage.setItem('authenticated', data.authenticated);
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

export function updateFollowing(following){
    return {
        type: UPDATE_FOLLOWING,
        following: following,
    }
}

export function createPost(){
    return {
        type: CREATE_POST
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