import React from 'react';

/**
 * A favourite for a user
 * 
 * @param {string} title - Title for this favourite  
 * @param {string} mapURL - URL for map image
 */
const Favourite = ({title, mapURL}) => {
  return (
    <div>
      <h2>{title}</h2>     
      <h2>{mapURL}</h2>
    </div>
  );
};

export default Favourite;
