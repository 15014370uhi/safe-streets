//TODO - will contain map image, favourite options and filter buttons components

import React from 'react';
import Nav from './Nav';
import MapImage from './MapImage';
import FilterButtonsList from './FilterButtonsList';
import AddFavourite from './AddFavourite';
import '../App.css';

const MapSection = () => {
  return (
    <div>      
      <div className="MapImage">
        <MapImage />
      </div>    
        <div className="FilterButtons">
         <FilterButtonsList />
        </div>
        <div className="AddFavourite">
          <AddFavourite />
        </div>
    </div>
  );
};

export default MapSection;
