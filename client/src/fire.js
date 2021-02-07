import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBT4RoXDLZ505dMhCPkEuYPEeL1EUF_Wh0",
  authDomain: "safe-streets-app.firebaseapp.com",
  projectId: "safe-streets-app",
  storageBucket: "safe-streets-app.appspot.com",
  messagingSenderId: "400130243033",
  appId: "1:400130243033:web:3439d32591167991e041c8"
};

try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack);
  }
}

const fire = firebase;
export default fire;