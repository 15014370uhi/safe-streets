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
import { useHistory, Switch } from "react-router-dom"; // TODO use either reach router of react-dom stuff 


function Application() {
	const user = useContext(UserContext);
	// TODO change profile to search form Page
	// If user is logged in, display profile page, else show sign up page
	// TODO NOTE:  <ComponentName path="browserAddress" />

	const history = useHistory();

	//TODO fix the jump to login screen after registering -think I need a switcher <Router>
    //         <Router>
	// 		<Switch>
	// 		<Route exact path="/" component={Login} />
	// 		<App>
	// 			<Route path="/timeline" component={Timeline} />
	// 			<Route path="/chat/:id" component={Chat} />
	// 		</App>
	// 	</Switch>
	// </Router>

	return (
		
		<React.Fragment>
			<Navbar2 />
			{user ? (				
				<Router history={history}>
			
						<Search path="search" />
						<Redirect noThrow from="/" to="search" />											
						<Profile exact path="/profile" />
						<Favourites exact path="/favourites" />
						
					</Router>			
			) : (
				<Router history={history}>		
				<Login exact path="/" />
					<Redirect noThrow from="/search" to="/" />
					<Redirect noThrow from="/favourites" to="/" />
					<Redirect noThrow from="/profile" to="/" /> 
					<Register exact path="/register" />
				</Router>
			)}
		</React.Fragment>
		
	);
}

export default Application;
