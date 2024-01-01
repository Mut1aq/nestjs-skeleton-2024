export const ROUTES = {
  AUTH: {
    CONTROLLER: 'auth',
    REGISTER_USER: 'register-user',
    LOG_USER_IN: 'login-user',
    LOG_OUT: 'logout',
  },

  USERS: {
    CONTROLLER: 'users',
    FIND_ALL: '',
    FIND_ONE: ':userID',
    UPDATE_ONE: 'update',
    DELETE_ONE: 'delete',
    FOLLOW_UNFOLLOW: 'follow-unfollow/:userIDToPerformActionOn',
    FOLLOWERS: 'followers/:userIDToView',
    FOLLOWINGS: 'followings/:userIDToView',
  },

  POSTS: {
    CONTROLLER: 'posts',
    CREATE: '',
    FIND_ALL: '',
    FIND_ONE: ':postID',
    UPDATE_ONE: ':postID',
    DELETE_ONE: ':postID',
    FEED: 'feed',
  },
};
