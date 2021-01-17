//TODO - mapURL will be retrieved from API
//TODO - addFavourite will use mongoose schema
//TODO - add and update favourite will use mongoDB

import React, {useState, useContext} from 'react';
import {FavouritesContext} from '../context/FavouritesContext';

// UI elements import
import Button from '@material-ui/core/Button';

const AddFavourite = () => {

  // Favourites context imported
  const [favourites, setFavourites] = useContext (FavouritesContext);

  // Set local state for each value of title and mapURL
  const [title, setTitle] = useState ('');
  const [mapURL, setMapURL] = useState ('');

  // Event handler to update title local state with user input
  const updateTitle = e => {
    setTitle (e.target.value);
  };

  // Event handler to update mapURL local state with user input
  const updateMapURL = e => {
    setMapURL (e.target.value);
  };

  // Event handler to add new favourite to favourites context state
  const addFavourite = e => {
    e.preventDefault ();

    // Get previous favourites state and add a new favourite object
    setFavourites (prevFavourites => [...prevFavourites,
      {
        title: title,
        mapURL: mapURL,
      },
    ]);
  };

  // Eventually ** mapURL will be from wherever I store it after a search and not updated from user typing in form

  // title and mapURL local state updated on each keystroke, then new favourite added when form submitted using
  // local variables
  return (
    <form onSubmit={addFavourite}>
      <input
        type="text"
        name="title"
        value={title}
        placeholder="Note..."
        onChange={updateTitle}
      />

      <input
        type="text"
        name="mapURL"
        value={mapURL}
        placeholder="TEST URL..."
        onChange={updateMapURL}
      />
      <Button variant="contained" color="primary">Submit</Button>
    </form>
  );
};

export default AddFavourite;
