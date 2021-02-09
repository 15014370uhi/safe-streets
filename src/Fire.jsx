// Previous
//import Firebase from "firebase/app";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBT4RoXDLZ505dMhCPkEuYPEeL1EUF_Wh0",
    authDomain: "safe-streets-app.firebaseapp.com",
    projectId: "safe-streets-app",
    storageBucket: "safe-streets-app.appspot.com",
    messagingSenderId: "400130243033",
    appId: "1:400130243033:web:3439d32591167991e041c8"
  };

  // PREVIOUS
  //const Fire = Firebase.initializeApp(firebaseConfig);
   // export default Fire;

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();

