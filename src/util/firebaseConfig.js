import firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const config = {
  apiKey: process.env.REACT_APP_FIRE_apiKey,
  authDomain: process.env.REACT_APP_FIRE_authDomain,
  databaseURL: process.env.REACT_APP_FIRE_databaseURL,
  projectId: process.env.REACT_APP_FIRE_projectId,
  storageBucket: process.env.REACT_APP_FIRE_storageBucket,
  messagingSenderId: process.env.REACT_APP_FIRE_messagingSenderId
};

console.log(process.env);

firebase.initializeApp(config);

export default firebase;
