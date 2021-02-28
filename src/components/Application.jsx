import React, {useContext} from 'react';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import {UserContext} from '../auth/UserProvider';
import Navbar from './NavBar';
import Search from './Search';
import Favourites from './Favourites';
import AddFavourite from './AddFavourite';
import {Route, Switch} from 'react-router-dom';

function Application() {
	const user = useContext(UserContext);

	return (
		<React.Fragment>
			<Navbar />
			{user ? (
				<div>
					User: {user.email}
					<br />
					<br />
					<Switch>
						<Route exact path="/search" component={Search} />
						<Route exact path="/addFavourite" component={AddFavourite} />
						<Route exact path="/favourites" component={Favourites} />
						<Route exact path="/profile" component={Profile} />
						<Route exact path="/" component={Search} />
					</Switch>
					</div>
			) : (
				<div>
					<Switch>
						<Route exact path="/" component={Login} />
						<Route exact path="/register" component={Register} />
					</Switch>
				</div>
			)}
		</React.Fragment>
	);
}

export default Application;
