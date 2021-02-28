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

    // If user missing, exit
  if (!user){
    return;
  } 

  // Get reference to current user data in firestore by UID
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  // If user is logged in but no firestore document exists
  if (!snapshot.exists) {

    // User logged in but no document contents exist, generate firestore document for user
    const { email, displayName} = user;   
    
    try {
      await userRef.set({
        displayName,  // Initialise user displayName
        email, // initialise user email
        favourites: [], 
        ...additionalData
      });
    } 
    catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};


// Function which returns the latest user document from firestore
const getUserDocument = async uid => {

  // No current logged in user, return null
  if (!uid){
    return null;
  } 
  // Else user logged in 
  try {
    // Get current user document
    const userDocument = await firestore.doc(`users/${uid}`).get();
    return {
      uid,
      ...userDocument.data()
    };
  } 
  catch (error) {
    console.error("Error fetching user", error);
  }
};

// Function to add a new favourite to user collection of favourites
export const addUserFavourite = async (user, title, mapURL) => {

   // If no current user passed, exit
   if (!user) {
    console.log("user missing") ;
    return;
   }
   if(!mapURL){
    console.log("mapURL missing") ;
    return;
   } 
   if(!title){
    console.log("title missing") ;
    return;
   } 
 
   // Create a new favourite object
   var newFavourite = 
   {                 
           title: title, 
           mapURL: mapURL
   };

  // Get reference to current user data in firestore by UID
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  // If firestore User document found
  if (snapshot.exists) {
    try {
      await userRef.update({
        favourites: firebase.firestore.FieldValue.arrayUnion(Object.assign({}, newFavourite)),     
    })   
    } catch (error) {
      console.error("Error adding favourite", error);
    }
  }
  return getUserDocument(user.uid);  // TODO 
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

