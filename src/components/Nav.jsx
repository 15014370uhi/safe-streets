//TODO - If favourites has length - show navigation 'view favourites' else hide the option
// TODO https://material-ui.com/components/bottom-navigation/
// TODO pop sideways snackbars https://material-ui.com/components/snackbars/
// TODO social links https://mui-treasury.com/components/social-link/
// TODO https://material-ui.com/components/paper/
//TODO https://material-ui.com/components/material-icons/

import React, {useContext} from 'react';
import {FavouritesContext} from '../context/FavouritesContext';
//import FavoriteIcon from '@material-ui/icons/Favorite';
import policeIcon from '../images/police-icon.svg';
import 'fontsource-roboto';

const Nav = props => {

  // Use Favourites context to get Favourites, to find and display length of favourites list
  const [favourites, setFavourites] = useContext (FavouritesContext);

  return (
    <nav>
      <img src={policeIcon} alt="Police Helmet Logo" width="45" height="40" />     
      <button onClick={props.handleLogout}>Logout</button>
      <p>Number of Favourites: {favourites.length}  </p>
    </nav>
  );
};

export default Nav;
