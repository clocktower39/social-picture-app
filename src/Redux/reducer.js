import { LOGIN_USER, LOGOUT_USER, UPDATE_POSTS, ERROR, UPDATE_USER, UPDATE_PROFILE, } from './actions';
import { user, posts, profile, error } from './states'

export let reducer = (state = { user, posts, profile, error }, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...state,
                user: {
                    ...action.user,
                },
            }
        case LOGOUT_USER:
            return {
                ...state,
                user: {
                },
            }
        case UPDATE_POSTS:
            return {
                ...state,
                posts: [...action.posts]
            }
        case UPDATE_USER:
            return {
                ...state,
                user: { ...state.user, ...action.user }
            }
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: {
                    ...state.profile,
                    user: { ...action.user },
                    posts: [...action.posts],
                }
            }
        case ERROR:
            return {
                ...state,
                error: { ...action.error }
            }
        default:
            return { ...state };
    }
}