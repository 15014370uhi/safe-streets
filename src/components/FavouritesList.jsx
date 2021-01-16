import React, {useState, useContext} from 'react';
import Favourite from './Favourite';
import {FavouritesContext} from '../context/FavouritesContext';
import uuid from 'react-uuid';
import '../App.css';

const FavouritesList = () => {

	// Set the context as FavouritesContext
  const [favourites, setFavourites] = useContext (FavouritesContext);

  // List each favourite using Favourite component and data from FavouritesContext for props
  return (
    <div>
    <li className="favourite">
      {favourites.map (favourite => (
        <Favourite title={favourite.title} mapURL={favourite.mapURL} key={uuid()} />
      ))}
      </li>
    </div>
  );
};

export default FavouritesList;
