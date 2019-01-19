const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.sendNotifications = functions.database
  .ref("messages/{channelID}")
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
          if (context.auth.token.user_id !== snapshot[key].uid)
            tokens.push(snapshot[key].token);
        }
        console.log(tokens);
        return admin
          .messaging()
          .sendToDevice(tokens, payload)
          .then(function(response) {
            console.log("Successfully sent message:", response);
          })
          .catch(function(error) {
            console.log("Error sending message:", error);
          });
      });
  });
