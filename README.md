# Dev Desk

- Chatting App
- Build using Reactjs, Redux, firebase.
- Used firebase function for FCM.

### Clone the project using

git clone https://github.com/jscodelover/dev-desk-chatting-app.git

## Available Scripts

In the project directory, you can run:

### `npm install`

To install the packages

### `functions/npm install`

To install the packages for the firebase cloud messages

### `npm start`

u
Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Firebase

- create an account in firebase
- Copy the firebase credentials
- create a .env file using .envtemplate
- add firebase credentials in .env file

### Firebase storage rules

```
service firebase.storage {
  match /b/{devdesk}/o {
    match /{channelName}/images/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
    match /{userID}/{allPaths=**}{
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*') && request.auth.uid == userID;
    }
  }
}
```

### Firebase database rules

```
{
  "rules": {
    "users": {
      ".read": "auth != null",
      "$userID":{  ".write": "auth != null && auth.uid == $userID"
      }
    },
    "channels":{
        ".read": "auth != null",
     "$channelID": {   ".write": "auth.uid != null",
          ".validate": "newData.hasChildren(['channelDetail','channelName','createdBy','createdOn','id'])",
            "createdBy":{
              ".validate" : "newData.val() == auth.uid"
            },
            "createdOn": {
              ".validate": "newData.val() <= now"
            }   ,
           "id":{
             ".validate": "newData.val() == $channelID"
           },
             "channelName": {
          ".validate": "newData.val().length > 0"
        },
        "channelDetail": {
          ".validate": "newData.val().length > 0"
        }
      }
    },
    "messages": {
      ".read": "auth != null",
      "$channelID":{
        "$messageId": {
          ".write": "auth != null",
           ".validate": "(newData.hasChildren(['content','timestamp','userID']) && !newData.hasChildren(['image'])) || (newData.hasChildren(['image','timestamp','userID']) && !newData.hasChildren(['content']))",
          "content": {
            ".validate": "newData.val().length > 0"
          },
          "image": {
            ".validate": "newData.val().length > 0"
          },
            "timestamp": {
              ".validate": "newData.val() == now"
            }
        }
      }
    },
      "notification": {
        "$userID":{
          ".read": "auth != null && auth.uid == $userID",
          "$notifyID":{
        ".write": "auth != null",
          ".validate": "newData.hasChildren(['count', 'lastTotal','id'])",
            "id":{
              ".validate": "newData.val() == $notifyID"
            }
          }
        }
      },
       "presence": {
          ".read": "auth.uid != null",
           ".write": "auth.uid != null"
         },
        "typing": {
          ".read": "auth != null",
           ".write": "auth != null"
        },
    "tokens":{
      ".read": "auth.uid != null",
      ".write": "auth.uid != null",
      ".indexOn": "uid"
    }

       }
  }

```
