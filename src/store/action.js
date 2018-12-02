export const actions = {
  SET_USER: "SET_USER",
  CLEAR_USER: "CLEAR_USER",
  SET_CHANNEL: "SET_CHANNEL",
  ALL_CHANNEL_ID: "ALL_CHANNEL_ID"
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
