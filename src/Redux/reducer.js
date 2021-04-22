import { LOGIN_USER, LOGOUT_USER, UPDATE_FOLLOWING } from './actions';
import { user, authenticated, posts } from './states'

export let reducer = (state = { user, authenticated, posts }, action) => {
    switch(action.type){
        case LOGIN_USER:
            return { 
                ...state,
                user: {
                    ...action.user,
                    followers: ['q','w','e','a','s','t','u','y','i','p','o','m','n','b','v','c','x','z','l'],
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
        default:
            return {...state};
    }
}