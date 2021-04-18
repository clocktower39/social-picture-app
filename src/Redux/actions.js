export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const CREATE_POST = 'CREATE_POST';
export const DELETE_POST = 'DELETE_POST';


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

