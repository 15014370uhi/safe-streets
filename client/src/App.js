import React, {useState, Fragment} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import fire from './fire.js';
import Login from './components/session/Login';
import SignUp from './components/session/SignUp';
import ListAllFavourites from './components/favourites/ListAllFavourites';
import AddFavourite from './components/favourites/AddFavourite';

function App () {
  const [isLoggedIn, setIsLoggedIn] = useState (false);

  fire.auth ().onAuthStateChanged (user => {
    return user ? setIsLoggedIn (true) : setIsLoggedIn (false);
  });

  // Sign out current user
  const signOut = () => {
    fire.auth ().signOut ();
  };

  //TEST
  //console.log ('User is logged in? ' + isLoggedIn);

  // TODO Modal login/signup form
  // TODO check bootstrap classes for navbar

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={'/sign-in'}>Safe Streets</Link>
            <div className="collapse navbar-collapse" id="navbar">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-in'}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-up'}>Sign up</Link>
                </li>
				<button onClick={signOut}>Sign out</button>
              </ul>
            </div>
          </div>
        </nav>

        <div className="auth-wrapper">
          <div className="auth-inner">
            <Switch>
              <Route exact path="/" component={Login} />
              <Route path="/sign-in" component={Login} />
              <Route path="/sign-up" component={SignUp} />
            </Switch>
          </div>
        </div>
      </div>

    </Router>
  );
}

export default App;

// // {/* <div className="App">
// <Router>
// 	{!isLoggedIn?
////
// <Fragment>

// 		<Switch>
// 			<Route path="/">

// 			<Login />
// 			<Signup />
// 			</Route>
// 		</Switch>

// 		</Fragment>
// 	: <Fragment>
// 		<button onClick={signOut}>Sign out</button>

// 		<Switch>
// 			<Route path="/add-favourite">
// 			<AddFavourite />
// 			</Route>

// 			<Route path="/">
// 			<ListAllFavourites />
// 			</Route>
// 		</Switch>

// 		</Fragment>}
// </Router>
// </div> */}
