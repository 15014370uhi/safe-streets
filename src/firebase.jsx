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


// TODO https://firebase.google.com/docs/auth/web/manage-users - add more user features


  // Function to create a user document
  export const generateUserDocument = async (user, additionalData) => {

     // If user missing, exit
  if (!user){
    return;
  } 

  // Get reference to current user data in firestore by UID
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  console.log("Additional data received in firebase for new user: " + additionalData.username);

  // If user is logged in but no firestore document exists
  if (!snapshot.exists) {

    // Get displayName and email of currently logged in user
   // const { email} = user;   
       const {email} = user;  
       const displayName = additionalData.displayName;   
        const username = additionalData.displayName;
    
    try {
      await userRef.set({
        displayName,
        username,  // Set user username
        email, // Set user email
        favourites: [], // Initialise empty favourites array
        ...additionalData
      });
    } 
    catch (error) {
      console.error("Error creating user firestore document", error);
    }
  }
  // Call getUserDocument function with user UID
  return getUserDocument(user.uid);
};


// Function to add a new favourite to user collection of favourites
export const addUserFavourite = async (title, mapURL) => {
  var user = firebase.auth().currentUser;

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


  // TODO get current date as string
  //const timestamp = new Date().toLocaleString();
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  const timestamp = new Date().toLocaleDateString([],options);
  //const timestamp = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();


  // Create a new favourite object
  var newFavourite = 
  {                 
          title: title, 
          mapURL: mapURL,
          timestamp: timestamp,
  };

 // Get reference to current user data in firestore by UID
 const userRef = firestore.doc(`users/${user.uid}`);
 const snapshot = await userRef.get();
 // If firestore user document found
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


// Async function to delete a user account
export const deleteUser = async () => {
  var user = firebase.auth().currentUser;

  // TODO REM user must have recently logged in user

  user.delete().then(function() {
    console.log("User " + user.email + " deleted!");
  }).catch(function(error) {
    console.log("Error deleting user account", error);
  });
}


// TODO can delete this probably
export const getCurrentUser = async () => {
  var user = firebase.auth().currentUser;
  if (!user){
    return null;
  } else {
    return user;
  }
}



// Async function which returns the latest user document from firestore
const getUserDocument = async uid => {

  // No UID supplied, return null
  if (!uid){
    return null;
  } 
  // Else user UID supplied for logged in user
  try {
    // Get reference to current user document
    const userDocument = await firestore.doc(`users/${uid}`).get();
    console.log("username: " + userDocument.data().username);
    // TODO NOTES This correctly gets displayname after adding a new favourite - interesting!!!
    return {
      uid,
      ...userDocument.data()
    };
  } 
  catch (error) {
    console.error("Error fetching user", error);
  }
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

