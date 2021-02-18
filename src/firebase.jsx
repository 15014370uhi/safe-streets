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

  // Function to create a user document
  export const generateUserDocument = async (user, additionalData) => {

    // If no current user passed, exit
  if (!user) return;
  // Get reference to current user data in firestore by UID
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    const { email, displayName} = user;
    //TEST
    console.log("Firebase.jsx received: " + user.email + " " + user.displayName);
    
    try {
      await userRef.set({
        displayName,  // Initialise user displayName
        email, // initialise user email
        favourites: [], // Initialise empty favourites array
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};



// Get user document from firestore
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





// ADD new map URL to user collection of favourites
export const addFavourite = async (user, mapURL) => {

   // If no current user passed, exit
   if (!user) {
    console.log("user missing") ;
    return;
   }
   if(!mapURL){
    console.log("mapURL missing") ;
    return;
   } 
 
  // Get reference to current user data in firestore by UID
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    //const { email, displayName} = user;
    try {
      await userRef.update({
        favourites: firebase.firestore.FieldValue.arrayUnion(mapURL)
    })   
    } catch (error) {
      console.error("Error adding favourite", error);
    }
  }
  return getUserDocument(user.uid);
};






// Initialise firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app(); // if already initialized, use that one
}


//firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();

