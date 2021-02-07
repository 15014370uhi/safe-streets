import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import fire from './fire.js';
import Login from './components/session/Login';
import ListAllFavourites from './components/favourites/ListAllFavourites';
import AddFavourite from './components/favourites/AddFavourite';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    fire.auth().onAuthStateChanged((user) => {
      return user ? setIsLoggedIn(true) : setIsLoggedIn(false);
  });
  
  const signOut = () => {
    fire.auth().signOut()
  };
  
  console.log(isLoggedIn);
  return (
    <div className="App">
      <Router>
        {!isLoggedIn
          ? (
            <>
            <Switch>
              <Route path="/">
                <Login />
              </Route>
            </Switch>
            </>
          ) 
          : (
            <>
            <button onClick={signOut}>
              Sign out
            </button>
            <Switch>
              <Route path="/add-favourite">
                <AddFavourite />
              </Route>
              <Route path="/">
                <ListAllFavourites />
              </Route>
            </Switch>
            </>
          
          )}
      </Router>
    </div>
  );
}

export default App;
