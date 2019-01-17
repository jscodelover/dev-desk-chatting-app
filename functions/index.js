const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.sendNotifications = functions.database
  .ref("messages/{channelID}/{key}/{data }")
  .onWrite((change, context) => {
    const payload = {
      notification: {
        title: `New Message from ${context.auth.token.name}!`,
        icons: context.auth.token.picture
      }
    };

    console.log(payload);

    return admin
      .database()
      .ref("tokens")
      .once("value")
      .then(data => {
        if (!data.val()) return;

        const snapshot = data.val();
        const tokens = [];

        for (let key in snapshot) {
          tokens.push(snapshot[key].token);
        }
        return admin.messaging().sendToDevice(tokens, payload);
      });
  });
