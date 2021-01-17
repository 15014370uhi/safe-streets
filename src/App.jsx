/* eslint-disable default-case */
import React, {useState, useEffect} from 'react';
import fire from './util/fire';
import Login from './components/Login';
import './App.css';
import Nav from './components/Nav';
import FavouritesList from './components/FavouritesList';
import {FavouritesProvider} from './context/FavouritesContext'; //Supply favourites data to child components
import MapSection from './components/MapSection';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
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
	};

	// Listener function for user auth state change
	const authListener = () => {
		fire.auth().onAuthStateChanged((user) => {
			if (user) {
				clearInputs(); // Clear email and password states
				setUser(user);
			} else {
				setUser('');
			}
		});
	};

  // TODO fix error with dependencies
	// Set useEffect function to call authListener function after render
	useEffect(() => {
		authListener();
	}, []);

  //TODO Should actually go to searchform not nav when user is logged in
  //TODO FIX NAV BAr displaying stuff

	return (
		<div className="App">
    	<FavouritesProvider>
			{user ? (
				<Nav handleLogout={handleLogout} />
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
		
				<Router>
					<div>
						<nav>
							<ul>
								<li>
									<Link to="/search"> Search </Link>
								</li>
								<li>
									<Link to="/"> Home(NAV for testing) </Link>
								</li>
								<li>
									<Link to="/map"> Map Section </Link>
								</li>
								<li>
									<Link to="/favourites"> Favourites </Link>
								</li>
							</ul>
						</nav>

						<Switch>
							<Route path="/search">
								<SearchForm/>
							</Route>
							<Route path="/">
								<MapSection />
							</Route>
							<Route path="/favourites">
								<FavouritesList />
							</Route>
							<Route path="/">
								<Nav handleLogout={handleLogout} />
							</Route>
						</Switch>
					</div>
				</Router>
        </FavouritesProvider>		
		</div>		
  );
};

export default App;
