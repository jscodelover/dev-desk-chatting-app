export const actions = {
  SET_USER: "SET_USER",
  SET_OTHER_USERS: "SET_OTHER_USERS",
  CLEAR_USER: "CLEAR_USER",

  SET_CHANNEL: "SET_CHANNEL",
  SET_OTHER_CHANNELS: "SET_OTHER_CHANNELS",
  ALL_CHANNEL_ID: "ALL_CHANNEL_ID",
  SET_PRIVATE_CHANNEL: "SET_PRIVATE_CHANNEL",
  ACTIVE_CHANNEL_ID: "ACTIVE_CHANNEL_ID",
  SET_USERS_IN_CHANNEL: "SET_USERS_IN_CHANNEL",
  SHOW_CHANNEL_INFO: "SHOW_CHANNEL_INFO",

  SET_NOTIFICATION: "SET_NOTIFICATION"

  SET_MESSAGES: "SET_MESSAGES"
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

export function setActiveChannelID(payload) {
  return {
    type: actions.ACTIVE_CHANNEL_ID,
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

export function setOtherChannels(payload) {
  return {
    type: actions.SET_OTHER_CHANNELS,
    payload
  };
}

export function setUsersInChannel(payload) {
  return {
    type: actions.SET_USERS_IN_CHANNEL,
    payload
  };
}

export function setShowChannelInfo(payload) {
  return {
    type: actions.SHOW_CHANNEL_INFO,
    payload
  }
}

/* Notification */

export function setNotification(payload) {
  return {
    type: actions.SET_NOTIFICATION,
    payload
  };
}


/*Messages */
export function setMessages(payload){
  return {
    type: actions.SET_MESSAGES,
    payload
  }
}