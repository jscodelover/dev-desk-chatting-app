import { actions } from "./action";
import { combineReducers } from "redux";

const USER_INITIAL_STATE = {
  currentUser: {},
  loading: true,
  otherUsers: [],
  isAuthenticated: false
};

const user_reducer = (state = USER_INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.SET_USER:
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case actions.CLEAR_USER:
      return {
        ...state,
        currentUser: {},
        isAuthenticated: false,
        loading: false
      };
    case actions.SET_OTHER_USERS:
      return {
        ...state,
        otherUsers: action.payload
      };
    default:
      return state;
  }
};

const CHANNEL_INITIAL_STATE = {
  currentChannel: {},
  otherChannels: [],
  channelIDs: [],
  privateChannel: false,
  activeChannelID: ""
};

const channel_reduce = (state = CHANNEL_INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.SET_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload
      };
    case actions.CLEAR_CHANNEL:
      return {
        ...state,
        currentChannel: {}
      };
    case actions.ACTIVE_CHANNEL_ID:
      return {
        ...state,
        activeChannelID: action.payload
      };
    case actions.ALL_CHANNEL_ID:
      return {
        ...state,
        channelIDs: state.channelIDs.concat(action.payload)
      };
    case actions.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        privateChannel: action.payload
      };
    case actions.SET_OTHER_CHANNELS:
      return {
        ...state,
        otherChannels: action.payload
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reduce
});

export default rootReducer;
