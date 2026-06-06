import {
  LOGIN_USER,
  LOGOUT_USER,
  UPDATE_POSTS,
  ERROR,
  UPDATE_USER,
  UPDATE_PROFILE,
  UPDATE_RELATIONSHIPS,
  UPDATE_CONVERSATIONS,
  UPDATE_CONVERSATION_MESSAGES,
  ADD_CONVERSATION,
  UPDATE_NOTIFICATIONS,
  PUSH_NOTIFICATION,
  MARK_NOTIFICATIONS_READ,
  SET_EXPLORE,
  SET_TRENDING_TAGS,
  SET_TAG_RESULTS,
  SET_USER_SEARCH,
} from './actions';
import {
  user,
  posts,
  relationships,
  profile,
  conversations,
  notifications,
  explore,
  error,
} from './states';

export let reducer = (
  state = { user, posts, relationships, profile, conversations, notifications, explore, error },
  action
) => {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, user: { ...action.user } };

    case LOGOUT_USER:
      return {
        ...state,
        user: {},
        posts: [],
        conversations: [],
        notifications: { items: [], unreadCount: 0 },
      };

    case UPDATE_POSTS: {
      if (action.prepend) {
        return { ...state, posts: [action.prepend, ...state.posts] };
      }
      if (action.posts === undefined) return state;
      return { ...state, posts: [...action.posts] };
    }

    case UPDATE_RELATIONSHIPS:
      return {
        ...state,
        relationships: {
          following: [...(action.following || [])],
          followers: [...(action.followers || [])],
        },
      };

    case UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.user } };

    case UPDATE_PROFILE:
      return {
        ...state,
        profile: {
          ...state.profile,
          user: { ...(action.user || {}) },
          posts: [...(action.posts || [])],
          following: [...(action.following || [])],
          followers: [...(action.followers || [])],
          isFollowing: Boolean(action.isFollowing),
        },
      };

    case UPDATE_CONVERSATIONS:
      return { ...state, conversations: [...(action.conversations || [])] };

    case ADD_CONVERSATION: {
      const existing = state.conversations.find((c) => c._id === action.conversation._id);
      if (existing) {
        return {
          ...state,
          conversations: state.conversations.map((c) =>
            c._id === action.conversation._id ? action.conversation : c
          ),
        };
      }
      return { ...state, conversations: [action.conversation, ...state.conversations] };
    }

    case UPDATE_CONVERSATION_MESSAGES: {
      const conversation = action.conversation;
      if (!conversation) return state;
      const exists = state.conversations.some((c) => c._id === conversation._id);
      const conversations = exists
        ? state.conversations.map((c) => (c._id === conversation._id ? conversation : c))
        : [conversation, ...state.conversations];
      return { ...state, conversations };
    }

    case UPDATE_NOTIFICATIONS:
      return {
        ...state,
        notifications: {
          items: [...(action.notifications || [])],
          unreadCount: action.unreadCount ?? 0,
        },
      };

    case PUSH_NOTIFICATION: {
      if (!action.notification) return state;
      if (state.notifications.items.some((item) => item._id === action.notification._id)) {
        return state;
      }
      return {
        ...state,
        notifications: {
          items: [action.notification, ...state.notifications.items],
          unreadCount: (state.notifications.unreadCount || 0) + 1,
        },
      };
    }

    case MARK_NOTIFICATIONS_READ: {
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
        },
      };
    }

    case SET_EXPLORE: {
      if (action.append) {
        const existing = state.explore.posts || [];
        const existingIds = new Set(existing.map((p) => p._id));
        const newPosts = action.append.filter((p) => !existingIds.has(p._id));
        return {
          ...state,
          explore: {
            ...state.explore,
            posts: [...existing, ...newPosts],
            nextCursor: action.nextCursor ?? state.explore.nextCursor,
            hasMore: action.hasMore ?? state.explore.hasMore,
          },
        };
      }
      return {
        ...state,
        explore: {
          ...state.explore,
          posts: [...(action.posts || [])],
          nextCursor: action.nextCursor || null,
          hasMore: action.hasMore || false,
        },
      };
    }

    case SET_TRENDING_TAGS:
      return { ...state, explore: { ...state.explore, trendingTags: [...(action.tags || [])] } };

    case SET_TAG_RESULTS:
      return {
        ...state,
        explore: {
          ...state.explore,
          tagResults: { tag: action.tag, posts: [...(action.posts || [])], count: action.count || 0 },
        },
      };

    case SET_USER_SEARCH:
      return { ...state, explore: { ...state.explore, userSearch: [...(action.users || [])] } };

    case ERROR:
      return { ...state, error: action.error };

    default:
      return { ...state };
  }
};
