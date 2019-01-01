export const actions = {
  SET_USER: "SET_USER",
  SET_OTHER_USERS: "SET_OTHER_USERS",
  CLEAR_USER: "CLEAR_USER",
  SET_CHANNEL: "SET_CHANNEL",
  ALL_CHANNEL_ID: "ALL_CHANNEL_ID",
  SET_PRIVATE_CHANNEL: "SET_PRIVATE_CHANNEL"
};

/* User actions */
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

export function setOtherUsers(payload) {
  return {
    type: actions.SET_OTHER_USERS,
    payload
  };
}

/* Channel actions */
export function setChannel(payload) {
  return {
    type: actions.SET_CHANNEL,
    payload
  };
}

export function setChannelID(payload) {
  return {
    type: actions.ALL_CHANNEL_ID,
    payload
  };
}

export function setPrivateChannel(payload) {
  return {
    type: actions.SET_PRIVATE_CHANNEL,
    payload
  };
}
