import { actions } from "./action";
import { combineReducers } from "redux";

const USER_INITIAL_STATE = {
  user: {},
  loading: true,
  isAuthenticated: false, 
};

const user_reducer = (state = USER_INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case actions.CLEAR_USER:
      return {
        ...state,
        user: {},
        isAuthenticated: false,
        loading: false
      };
    default:
      return state;
  }
};

const CHANNEL_INITIAL_STATE = {
  channel: {}
};

const channel_reduce = (state = CHANNEL_INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.SET_CHANNEL:
      return {
        ...state,
        channel: action.payload,
        loading: false
      };
    case actions.CLEAR_CHANNEL:
      return {
        ...state,
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
