import firebase from "./firebaseConfig";

export function typingAdd(message, channel, user) {
  const typingRef = firebase.database().ref("typing");
  if (message) {
    typingRef
      .child(channel.id)
      .child(user.userID)
      .set(user.username);
  } else typingRemove(channel, user);
}

export function typingRemove(channel, user) {
  const typingRef = firebase.database().ref("typing");
  typingRef
    .child(channel.id)
    .child(user.userID)
    .remove();
}
