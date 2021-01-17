import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyAIgWIwHYfKu37-iJDGL_-zsyegilbU-sE",
    authDomain: "safe-streets-c9fa9.firebaseapp.com",
    projectId: "safe-streets-c9fa9",
    storageBucket: "safe-streets-c9fa9.appspot.com",
    messagingSenderId: "724482348204",
    appId: "1:724482348204:web:4c82c44903dad6bd097b09"
  };

  const fire = firebase.initializeApp(firebaseConfig);

  export default fire;