export const actions = { SET_USER: "SET_USER", CLEAR_USER: "CLEAR_USER" };

export function setUser(payload) {
  return {
    type: actions.SET_USER,
    payload
  };
}

export function clearUser() {
  return {
    type: actions.CLEAR_USER
  };
}
