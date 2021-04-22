export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const CREATE_POST = 'CREATE_POST';
export const DELETE_POST = 'DELETE_POST';
export const UPDATE_USER = 'UPDATE_USER';
export const UPDATE_FOLLOWING = 'UPDATE_FOLLOWING';


export function loginUser(user){
    return {
        type: LOGIN_USER,
        user: user
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