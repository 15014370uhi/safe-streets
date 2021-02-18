
import React from 'react';
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import Search from '../components/Search';
import Favourites from '../components/Favourites';
import Profile from '../components/Profile';
import Login from '../components/Login';
import Register from '../components/Register';
import Navbar from '../components/Navbar';

export const appRoutes = (user) => {
    console.log("User received in appRoutes: " + user);
    const location = useLocation();
    
 
    if (user) {
        return (
            <React.Fragment>
            <Navbar />
             <Switch>
              <Route path="/search" exact>
              <Search />  
              </Route>
  
              <Route path="/profile" exact>
                <Profile />
              </Route>
  
              <Route path="/favourites">
                <Favourites />
              </Route>
  
              <Redirect to="/search" />
            </Switch>  
            </React.Fragment>  
        );
    } else
    {
        return (
            <React.Fragment>
            <Switch>
            <Route path="/" exact>
              <Login />
            </Route>

            <Route path="/register">
              <Register />
            </Route>   
            </Switch>  
            <Redirect to="/" />
            </React.Fragment> 
        );

    }
}
  
