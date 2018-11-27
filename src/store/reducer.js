import { actions } from "./action";
import { combineReducers } from "redux";

const USER_INITIAL_STATE = {
  currentUser: {},
  loading: true,
  isAuthenticated: false, 
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
    default:
      return state;
  }
};

const CHANNEL_INITIAL_STATE = {
  currentChannel: {}
};

const channel_reduce = (state = CHANNEL_INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.SET_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload,
      };
    case actions.CLEAR_CHANNEL:
      return {
        ...state,
        currentChannel: {}
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reduce
})

export default rootReducer;
