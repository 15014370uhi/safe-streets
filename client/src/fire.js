import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBT4RoXDLZ505dMhCPkEuYPEeL1EUF_Wh0',
  authDomain: 'safe-streets-app.firebaseapp.com',
  projectId: 'safe-streets-app',
  storageBucket: 'safe-streets-app.appspot.com',
  messagingSenderId: '400130243033',
  appId: '1:400130243033:web:3439d32591167991e041c8',
};
firebase.initializeApp (firebaseConfig);

const fire = firebase;
export default fire;
