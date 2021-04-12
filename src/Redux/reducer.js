import { LOGIN_USER, LOGOUT_USER } from './actions';
import { user, authenticated } from './states'

export let reducer = (state = { user, authenticated }, action) => {
    switch(action.type){
        case LOGIN_USER:
            return { 
                ...state,
                user: {
                    ...action.user,
                    username: action.user.username
                },
            }
        case LOGOUT_USER:
            return { 
                ...state,
                user: {
                },
            }
        default:
            return {...state};
    }
}