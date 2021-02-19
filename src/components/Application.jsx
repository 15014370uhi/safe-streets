import React, {useContext} from 'react';
import {Router, Redirect} from '@reach/router';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import {UserContext} from '../auth/UserProvider';
import Navbar from './nav/Navbar';
import Navbar2 from './nav/Navbar2';
//import Navbar3 from './nav/Navbar3';
import Navbar4 from './nav/Navbar4';
import Search from './Search';
import Favourites from './Favourites';


function Application() {
	const user = useContext(UserContext);
	// TODO change profile to search form Page
	// If user is logged in, display profile page, else show sign up page
	// TODO NOTE:  <ComponentName path="browserAddress" />

	return (
		<React.Fragment>
			<Navbar2 />
			{user ? (
				
					<Router>
						<Redirect noThrow from="/" to="search" />
						<Search path="search" />
						<Profile exact path="/profile" />
						<Favourites exact path="/favourites" />
					</Router>
			
			) : (
				<Router>				
					<Login path="/" />
					<Register exact path="/register" />
				</Router>
			)}
		</React.Fragment>
	);
}

export default Application;
