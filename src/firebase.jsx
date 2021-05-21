import firebase from 'firebase/app'; //firebase
import 'firebase/auth'; //firebase authentication
import 'firebase/firestore'; //firebase firestore

const firebaseConfig = {
	apiKey: 'AIzaSyBT4RoXDLZ505dMhCPkEuYPEeL1EUF_Wh0',
	authDomain: 'safe-streets-app.firebaseapp.com',
	projectId: 'safe-streets-app',
	storageBucket: 'safe-streets-app.appspot.com',
	messagingSenderId: '400130243033',
	appId: '1:400130243033:web:3439d32591167991e041c8',
};


//function to create a new user with email and password
export const createUserWithEmailAndPassword = async (email, password) => {
	try {
		const {user} = await auth.createUserWithEmailAndPassword(
			email,
			password
		);
		console.log('Created user with email: ' + user.email); // TEST
		return generateUserDocument(user);
	} catch (error) {
		console.log(
			'Error creating user with email and password' + error.message
		);
	}
};

//function to create a user document
export const generateUserDocument = async (user, additionalData) => {
	//if user missing, exit
	if (!user) {
		return;
	}
	//get reference to current user data in firestore by UID
	const userRef = firestore.doc(`users/${user.uid}`);
	const snapshot = await userRef.get();

	//if user is logged in but no firestore document exists
	if (!snapshot.exists) {
		//get email of currently logged in user
		const {email} = user;
		try {
			await userRef.set({
				email, //set user email
				favourites: [], //initialise empty favourites array
				...additionalData,
			});
		} catch (error) {
			console.error('Error creating user firestore document', error);
		}
	}
	//call getUserDocument function with user UID
	return getUserDocument(user.uid);
};

//function to add a new favourite to user collection of favourites
export const addUserFavourite = async (title, mapurl) => {
	var user = firebase.auth().currentUser;

	//if no current user passed, exit
	if (!user) {
		console.log('user missing');
		return;
	}
	if (!mapurl) {
		console.log('map URL missing');
		return;
	}
	if (!title) {
		console.log('title missing');
		return;
	}

	// TODO get current date as string
	//const timestamp = new Date().toLocaleString();
	var options = {year: 'numeric', month: 'long', day: 'numeric'};
	const timestamp = new Date().toLocaleDateString([], options);
	//const timestamp = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();

	// Create a new favourite object
	var newFavourite = {
		title: title,
		mapURL: mapurl,
		timestamp: timestamp,
	};

	// Get reference to current user data in firestore by UID
	const userRef = firestore.doc(`users/${user.uid}`);
	const snapshot = await userRef.get();
	//if firestore user document found
	if (snapshot.exists) {
		try {
			await userRef.update({
				favourites: firebase.firestore.FieldValue.arrayUnion(
					Object.assign({}, newFavourite)
				),
			});
		} catch (error) {
			console.error('Error adding favourite', error);
		}
	}
	return getUserDocument(user.uid); // TODO
};

// Async function to delete a user account
// TODO Might not need this here can call from components
export const deleteUser = async (password) => {
	var user = firebase.auth().currentUser;

	var credentials = firebase.auth.EmailAuthProvider.credential(
		user.email,
		password
	);
	user.reauthenticateWithCredential(credentials)
		.then(function () {
			// User re-authenticated - delete account
			user.delete()
				.then(function () {
					console.log('User ' + user.email + ' deleted!');
				})
				.catch(function (error) {
					console.log('Error deleting user account', error);
				});
		})
		.catch(function (error) {
			console.log('Error reauthenticating user account', error); // user Password input incorrect wrong?
			return false; // Return false - meaning password is incorrect - prompt user of this in profile page
		});
};

// TODO can delete this probably
export const getCurrentUser = async () => {
	var user = firebase.auth().currentUser;
	if (!user) {
		return null;
	} else {
		return user;
	}
};

// Async function which returns the latest user document from firestore
const getUserDocument = async (uid) => {
	// No UID supplied, return null
	if (!uid) {
		return null;
	}
	// Else user UID supplied for logged in user
	try {
		// Get reference to current user document
		const userDocument = await firestore.doc(`users/${uid}`).get();
		return {
			uid,
			...userDocument.data(),
		};
	} catch (error) {
		console.error('Error fetching user', error);
	}
};

// Initialise firebase
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
} else {
	firebase.app(); // if already initialized, use that one
}

//firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
