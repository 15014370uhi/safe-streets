//TODO - Implementation to be replaced with mongoose schema for favourite

import React from 'react';
//import 'fontsource-roboto';

/**
 * A favourite search result for a user
 * 
 * @param {string} title - Title for this favourite  
 * @param {string} mapURL - URL for map image
 */
const Favourite = ({title, mapURL}) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>{mapURL}</p>
    </div>
  );
};

export default Favourite;
