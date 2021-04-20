import { LOGIN_USER, LOGOUT_USER } from './actions';
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
        default:
            return {...state};
    }
}