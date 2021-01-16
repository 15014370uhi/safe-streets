//TODO - If favourites has length - show navigation 'view favourites' else hide the option

import React, {useContext} from 'react';
import { FavouritesContext } from '../context/FavouritesContext';
import policeIcon from '../images/police-icon.svg'; 
import '../App.css';
import 'fontsource-roboto';

const Nav = () => {

  // Use Favourites context to get Favourites, to find and display length of favourites list
  const [favourites, setFavourites] = useContext (FavouritesContext);

  return (
    <div className="nav navbar-nav">
     <img src={policeIcon} alt="Police Helmet Logo" width="45" height="45" />
      <h3>My Nav Bar</h3>
      <p>Number of Favourites: {favourites.length}</p>
    </div>
  );
};

export default Nav;
