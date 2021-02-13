import React, {useContext} from 'react';
import {UserContext} from '../auth/UserProvider';
import {Router, Link} from '@reach/router';
import {auth} from '../firebase';

const Navbar = (props) => {

	const user = useContext(UserContext); // Get User Context
	//const auth = useAuth();
	//import { useAuth } from "./use-auth.js";
	
  return (
    <React.Fragment>             
        {user ? (
          <React.Fragment>
		  	<Link to="/search">Search</Link>
        	<Link to="/favourites">Favourites</Link>
            <Link to="/profile">Account ({user.displayName})</Link>
            <button onClick={() => auth.signOut()}>Logout</button>
          </React.Fragment>
        ) : (
			<React.Fragment>
          <Link to="/">Login</Link>
		  <Link to="/register">Register</Link>
		  </React.Fragment>
        )}     
    </React.Fragment>
  );
}

export default Navbar;