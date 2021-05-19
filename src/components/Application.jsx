import React, {useContext} from 'react';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import {UserContext} from '../auth/UserProvider';
import Navbar from './NavBar';
import Search from './Search';
import Favourites from './Favourites';
import AddFavourite from './AddFavourite';
import MapDisplay from './MapDisplay';
import ShowFavourite from './ShowFavourite';
import {Route, Switch, Redirect} from 'react-router-dom';

// TODO rem pass props if needed - maybe user?

function Application () {
  const user = useContext (UserContext);

  //TODO TEST removal of extra path routes when user not logged in

  return (
    <React.Fragment>
      <Navbar />
      {user
        ? <div>
            <Switch>
              <Route exact path="/results" component={MapDisplay} />
              <Route exact path="/search" component={Search} />
              <Route exact path="/favourite" component={ShowFavourite} />
              <Route exact path="/addFavourite" component={AddFavourite} />
              <Route exact path="/favourites" component={Favourites} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/">
                <Redirect to="/search" /> : <Search />
              </Route>
            </Switch>
          </div>
        : <div>
            <Switch>
              <Route exact path="/" component={Login} />

              <Route exact path="/search">
                <Redirect to="/" /> : <Login />
              </Route>

              <Route exact path="/favourites">
                <Redirect to="/" /> : <Login />
              </Route>

              <Route exact path="/profile">
                <Redirect to="/" /> : <Login />
              </Route>

              <Route exact path="/results">
                <Redirect to="/" /> : <Login />
              </Route>

              <Route exact path="/favourite">
                <Redirect to="/" /> : <Login />
              </Route>

              <Route exact path="/register">
                <Redirect to="/register" /> : <Register />
              </Route>
            </Switch>
          </div>}
    </React.Fragment>
  );
}

export default Application;
