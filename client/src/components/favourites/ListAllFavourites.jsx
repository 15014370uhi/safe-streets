import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFavourites } from '../../services/favouritesServices';
import uuid from 'react-uuid'

const ListFavourites = () => {
  const [favourites, setFavourites] = useState();

  useEffect(() => {
    const fetchFavourites = async () => {
      const fetchedFavourites = await getFavourites();
      setFavourites(fetchedFavourites);
    }
    fetchFavourites();
  }, [])

  if (favourites === undefined) {
    return null;
  }

  return (
    <div>
      <Link to="/add-favourite">Add Favourite</Link>
      <h2>Favourites</h2>      
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>mapURL</th>
          </tr>
        </thead>
        <tbody>
          {favourites.map((entry) => (
          <tr key={uuid()}>
            <td>{entry.title}</td>
            <td>{entry.mapURL}</td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) 
};

export default ListFavourites;