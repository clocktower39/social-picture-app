import { LOGIN_USER, LOGOUT_USER, UPDATE_FOLLOWING, CREATE_POST, UPDATE_POSTS, ERROR } from './actions';
import { user, authenticated, posts, error } from './states'

export let reducer = (state = { user, authenticated, posts, error }, action) => {
    switch(action.type){
        case LOGIN_USER:
            return { 
                ...state,
                user: {
                    ...action.user,
                },
                authenticated: true,
            }
        case LOGOUT_USER:
            return { 
                ...state,
                user: {
                },
                authenticated: false,
            }
        case UPDATE_FOLLOWING:
            return { 
                ...state,
                user: {
                    ...state.user,
                    following: [...action.following],
                }
            }
        case CREATE_POST:
            return {
                ...state
            }
        case UPDATE_POSTS:
            return {
                ...state,
                posts: [...action.posts]
            }
        case ERROR:
            return {
                ...state,
                error: {...action.error}
            }
        default:
            return {...state};
    }
}