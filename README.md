# Dev Desk

- Chatting App

### Clone the project using

git clone https://github.com/jscodelover/dev-desk-chatting-app.git

## Available Scripts

In the project directory, you can run:

### `npm install`

To install the packages

### `functions/npm install`

To install the packages for the firebase cloud messages

### `npm start`

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
