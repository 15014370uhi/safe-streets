import React, {useContext} from 'react';
//import {Router, Redirect} from '@reach/router';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import {UserContext} from '../auth/UserProvider';
import Navbar from './nav/Navbar';
import Navbar2 from './nav/Navbar2';
import Search from './Search';
import Favourites from './Favourites';
import {    
  Route,
  Redirect
} from 'react-router-dom';

function Application () {
  const user = useContext (UserContext);
  // TODO change profile to search form Page
  // If user is logged in, display profile page, else show sign up page
  // TODO NOTE:  <ComponentName path="browserAddress" />


  //TODO fix the jump to login screen after registering -think I need a switcher <Router>

  return (
    <React.Fragment>	
      <Navbar2 />	 
      {user ?  (  
		<React.Fragment>   
		User: {user.email} 
		<br /><br />		            
			  <Route path="/search" component={Search} /> 
			  <Redirect noThrow from="/register" to="/" />
			  <Route path="/favourites" component={Favourites} /> 
        <Route path="/profile" component={Profile} />
			  <Route exact path="/" component={Search} /> 			
			  </React.Fragment>              
	   ) : (
		<React.Fragment>  
		No USER		
              <Route exact path="/" component={Login} />             
              <Route path="/register" component={Register} />  
		</React.Fragment> 
		)}    	             
    </React.Fragment>	
  );
}
//TODO maybe dont need route for user above - just load search component if user?



  // TODO issue with navbar could be due to it not being given routes in the
  // TODO applicaiton top path - check where routes are defined - 
  //TODO Define routes outside of the user? bit - within a switch maybe - 
  // TODO and then define the paths within each bit? maybe need to define paths
  // todo for each bit

export default Application;

//<Route exact path="/search" component={Search} />
             // <Route path="/profile" component={Profile} />
           //   <Route path="/favourites" component={Favourites} />