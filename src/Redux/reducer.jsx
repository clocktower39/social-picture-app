import { LOGIN_USER, LOGOUT_USER, UPDATE_POSTS, ERROR, UPDATE_USER, UPDATE_PROFILE, UPDATE_RELATIONSHIPS, UPDATE_CONVERSATIONS, UPDATE_CONVERSATION_MESSAGES, UPDATE_NOTIFICATIONS, PUSH_NOTIFICATION, MARK_NOTIFICATIONS_READ, } from './actions';
import { user, posts, relationships, profile, conversations, notifications, error } from './states'

export let reducer = (state = { user, posts, relationships, profile, conversations, notifications, error }, action) => {
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
        case UPDATE_NOTIFICATIONS:
            return {
                ...state,
                notifications: {
                    items: [...action.notifications],
                    unreadCount: action.unreadCount ?? 0,
                }
            }
        case PUSH_NOTIFICATION:
            if (state.notifications.items.some((item) => item._id === action.notification._id)) {
                return state;
            }
            return {
                ...state,
                notifications: {
                    items: [action.notification, ...state.notifications.items],
                    unreadCount: (state.notifications.unreadCount || 0) + 1,
                }
            }
        case MARK_NOTIFICATIONS_READ:
            const markAll = action.updatedIds === "all";
            const updatedItems = state.notifications.items.map((item) => {
                if (markAll || (Array.isArray(action.updatedIds) && action.updatedIds.includes(item._id))) {
                    return { ...item, read: true };
                }
                return item;
            });
            return {
                ...state,
                notifications: {
                    items: updatedItems,
                    unreadCount: action.unreadCount ?? 0,
                }
            }
        case UPDATE_CONVERSATION_MESSAGES:
            const updatedConversations = [...state.conversations.map(c => {
                if( c._id === action.conversation._id){
                    c.messages = action.conversation.messages
                    console.log(c)
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
