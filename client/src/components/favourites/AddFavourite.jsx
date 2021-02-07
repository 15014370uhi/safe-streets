import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addToFavourites} from '../../services/favouritesServices';

const AddFavourite = () => {
  const [title, setTitle] = useState();
  const [mapURL, setMapURL] = useState();
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (title && mapURL) {
      return addToFavourites(title, mapURL);
    }
    return console.log('You must enter a title and a mapURL');
  };
  
  return (
    <div>
      <Link to="/">View Favourites</Link>
    <h2>Add Favourite</h2>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        onChange={({ target }) => setTitle(target.value)}
      /><br />
      <input
        type="text"
        placeholder="MapURL"
        onChange={({ target }) => setMapURL(target.value)}
      /><br />
      
      <button type="submit">
        Add Favourite
      </button>
    </form>
    </div>
  )
};

export default AddFavourite;