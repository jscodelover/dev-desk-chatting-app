import firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyAJR_w_2imHciuDh66hEOE7UzpQtLEWYZQ",
  authDomain: "react-slack-for-dev.firebaseapp.com",
  databaseURL: "https://react-slack-for-dev.firebaseio.com",
  projectId: "react-slack-for-dev",
  storageBucket: "react-slack-for-dev.appspot.com",
  messagingSenderId: "879689864897"
};

firebase.initializeApp(config);

export default firebase;
