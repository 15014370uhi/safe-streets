//TODO - mapURL will be retrieved from API
//TODO - addFavourite will use mongoose schema
//TODO - add and update favourite will use mongoDB

import React, {useState, useContext} from 'react';
import {FavouritesContext} from '../context/FavouritesContext';

// UI elements import
import Button from '@material-ui/core/Button';

const AddFavourite = () => {
  // Context imported
  const [favourites, setFavourites] = useContext (FavouritesContext);

  // Set State

  // Create event handler function to update state using the state functions
  const updateTitle = e => {
    setTitle (e.target.value);
  };

  // Set state for each value of title and mapURL
  const [title, setTitle] = useState ('');
  const [mapURL, setMapURL] = useState ('');

  // Eventually** This will be called to update the mapURL from wherever it is stored after a search
  const updateMapURL = e => {
    setMapURL (e.target.value);
  };

  const addFavourite = e => {
    // Prevent default page refresh when typing in input boxes on each character - since state in changing
    e.preventDefault ();

    // To add Favourite, get previous favourites list and add a new favourite object to existing ones
    setFavourites (prevFavourites => [
      ...prevFavourites,
      {
        title: title, 
        mapURL: mapURL
      }
    ]);
  };

  // Eventually ** mapURL will be from wherever I store it after a search and not updated from user typing in form
  return (
    <form onSubmit={addFavourite}>
      <input type="text" name="title" value={title} onChange={updateTitle} />
      <input type="text" name="mapURL" value={mapURL} onChange={updateMapURL} />
      <Button variant="contained" color="primary">Submit</Button>
    </form>
  );
};

export default AddFavourite;
