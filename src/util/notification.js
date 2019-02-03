import firebase from "./firebaseConfig";

export function createNotificationArray(
  children,
  channelID,
  userID,
  activeChannelID
) {
  const notificationRef = firebase.database().ref("notification");
  notificationRef.child(userID).once("value", snap => {
    if (!snap.hasChild(channelID)) {
      notificationRef
        .child(userID)
        .child(channelID)
        .update({
          id: channelID,
          lastTotal: children,
          count: 0,
          total: children
        });
    } else {
      let notification = snap.val()[channelID];
      let newNotification = {
        id: channelID,
        total: children
      };
      if (
        notification.id === activeChannelID ||
        notification["id"].includes(activeChannelID)
      ) {
        newNotification.count = 0;
        newNotification.lastTotal = children;
        notificationRef
          .child(userID)
          .child(channelID)
          .set({ ...newNotification });
      } else {
        newNotification.count = children - notification.lastTotal;
        newNotification.lastTotal = notification.lastTotal;
        notificationRef
          .child(userID)
          .child(channelID)
          .set({ ...newNotification });
      }
    }
  });
}

export function clearNotification(channelID, userID) {
  const notificationRef = firebase.database().ref("notification");
  notificationRef
    .child(userID)
    .child(channelID)
    .once("value", snap => {
      let notification = snap.val();
      notificationRef
        .child(userID)
        .child(channelID)
        .set({
          id: channelID,
          lastTotal: notification.total,
          count: 0,
          total: notification.total
        });
    });
}
