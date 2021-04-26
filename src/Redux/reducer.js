import { LOGIN_USER, LOGOUT_USER, UPDATE_FOLLOWING, SIGNUP_USER } from './actions';
import { user, authenticated, posts } from './states'

export let reducer = (state = { user, authenticated, posts }, action) => {
    switch(action.type){
        case LOGIN_USER:
            return { 
                ...state,
                user: {
                    ...action.user,
                    followers: ['Kearns39'],
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
                    following: action.following,
                }
            }
        case SIGNUP_USER:
            return {
                ...state
            }
        default:
            return {...state};
    }
}