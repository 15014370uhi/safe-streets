import React, {useContext} from 'react';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import {UserContext} from '../auth/UserProvider';
import Navbar from './NavBar';
import Search from './Search';
import Favourites from './Favourites';
import AddFavourite from './AddFavourite';
import {    
  Route,
  Redirect
} from 'react-router-dom';

function Application () {
  const user = useContext (UserContext);

  return (
    <React.Fragment>	
      <Navbar />	 
      {user ?  (  
		<React.Fragment>   
		User: {user.email} 
		<br /><br />		            
			  <Route path="/search" component={Search} /> 
			  <Redirect noThrow from="/register" to="/" />
        <Route path="/addFavourite" component={AddFavourite} /> 
			  <Route path="/favourites" component={Favourites} />        
        <Route path="/profile" component={Profile} />
			  <Route exact path="/" component={Search} /> 			
			  </React.Fragment>              
	   ) : (
		<React.Fragment>  
              <Route exact path="/" component={Login} />             
              <Route path="/register" component={Register} />  
		</React.Fragment> 
		)}    	             
    </React.Fragment>	
  );
}

export default Application;
