import React, {useContext} from 'react';
import {Router} from '@reach/router';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import {UserContext} from '../auth/UserProvider';
import Navbar from './Navbar';
import Search from './Search';
import Favourites from './Favourites';

function Application () {
  const user = useContext (UserContext);
  // TODO change profile to search form Page
  // If user is logged in, display profile page, else show sign up page
  // TODO NOTE:  <ComponentName path="browserAddress" />
  return (
    <React.Fragment>
      <Navbar />
      {user ? (<React.Fragment>
            <Profile />
          </React.Fragment>
          ) : ( 
            <Router>
            <Search path="/search" />
            <Favourites path="/favourites" />
            <Register path="/register" />
            <Login path="/" />            
          </Router>
          )}
    </React.Fragment>
  );
}

export default Application;
