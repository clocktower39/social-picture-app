import { LOGIN_USER, LOGOUT_USER, UPDATE_POSTS, ERROR, UPDATE_USER, UPDATE_PROFILE, UPDATE_RELATIONSHIPS, UPDATE_CONVERSATIONS, UPDATE_CONVERSATION_MESSAGES, } from './actions';
import { user, posts, relationships, profile, conversations, error } from './states'

export let reducer = (state = { user, posts, relationships, profile, conversations, error }, action) => {
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
        case UPDATE_RELATIONSHIPS:
            return {
                ...state,
                relationships: {
                    following: [...action.following],
                    followers: [...action.followers],
                }
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
                    following: [...action.following],
                    followers: [...action.followers],
                }
            }
        case UPDATE_CONVERSATIONS:
            return {
                ...state,
                conversations: [...action.conversations]
            }
        case UPDATE_CONVERSATION_MESSAGES:
            const updatedConversations = [...state.conversations.map(c => {
                if( c._id === action.conversation._id){
                    c.messages = action.conversation.messages
                }
                return c;
            })];

            return {
                ...state,
                conversations: [...updatedConversations],
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