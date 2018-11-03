import { actions } from "./action";

const INITIAL_STATE = {
  user: {},
  loading: true,
  isAuthenticated: false
};

const reducer = (state = INITIAL_STATE, action) => {
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

export default reducer;
