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

  export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    const { email, displayName, photoURL } = user;
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();
    return {
      uid,
      ...userDocument.data()
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};



  // PREVIOUS
  //const Fire = Firebase.initializeApp(firebaseConfig);
   // export default Fire;

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();

