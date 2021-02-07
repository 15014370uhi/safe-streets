/* eslint-disable default-case */
import React, {useState, useEffect} from 'react';
import fire from './util/fire';
import Login from './components/Login';
import './App.css';
import {FavouritesProvider} from './context/FavouritesContext'; //Supply favourites data to child components
import SearchForm from './components/SearchForm';

// Create component App
const App = () => {
	const [user, setUser] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [isRegisteredUser, setIsRegisteredUser] = useState(false);

	// Function to clear previously entered user email and password state
	const clearInputs = () => {
		setEmail('');
		setPassword('');
	};

	// Function to clear any previously generated errors state
	const clearErrors = () => {
		setEmailError('');
		setPasswordError('');
	};

	// Handler function for user login
	const handleLogin = () => {
		clearErrors(); // Clear previous error state
		fire.auth(user)
			.signInWithEmailAndPassword(email, password)
			.catch((err) => {
				switch (err.code) {
					case 'auth/invalid-email':
					case 'auth/user-disabled':
					case 'auth/user-not-found':
						setEmailError(err.message);
						break;
					case 'auth/wrong-password':
						setPasswordError(err.message);
						break;
				}
      });     
	};

	// Handler function for new user sign up
	const handleSignup = () => {
		clearErrors(); // Clear previous error state
		fire.auth(user)
			.createUserWithEmailAndPassword(email, password)
			.catch((err) => {
				switch (err.code) {
					case 'auth/email-already-in-use':
					case 'auth/invalid-email':
						setEmailError(err.message);
						break;
					case 'auth/weak-password':
						setPasswordError(err.message);
						break;
				}
			});
	};

	// Handler function for logout
	const handleLogout = () => {
    fire.auth().signOut();
    console.log("HandleLogout function ----  User: " + fire.auth().currentUser.uid + " logged out");
	};

	// Listener function for user auth state change
	const authListener = () => {
		fire.auth().onAuthStateChanged((user) => {
			if (user) {		
        setUser(user); 
        console.log("authListener function ----- User: " + fire.auth().currentUser.uid + " now logged in");  
        	clearInputs(); // Clear email and password states     
			} else {
				setUser('');
			}
    });
	};

	// TODO fix error with dependencies
	// Set useEffect function to call authListener function after render
	useEffect(() => {
    authListener();
    clearInputs(); // Clear email and password states     
	}, []);

	//TODO Should actually go to searchform not nav when user is logged in
	//TODO FIX NAV BAr displaying stuff

	return (
		<div className="App">
			<FavouritesProvider>
				{user ? (				
          		<SearchForm handleLogout={handleLogout}/>
				) : (
					<Login
						email={email}
						setEmail={setEmail}
						password={password}
						setPassword={setPassword}
						handleLogin={handleLogin}
						handleSignup={handleSignup}
						isRegisteredUser={isRegisteredUser}
						setIsRegisteredUser={setIsRegisteredUser}
						emailError={emailError}
						passwordError={passwordError}
					/>
				)}					
			</FavouritesProvider>
		</div>
	);
};

export default App;
