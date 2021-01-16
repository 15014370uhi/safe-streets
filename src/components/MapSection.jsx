//TODO - will contain map image, favourite options and filter buttons components

import React, {useState, useContext} from 'react';
import Nav from './Nav';
import MapImage from './MapImage';
import FilterButtonsList from './FilterButtonsList';
import AddFavourite from './AddFavourite';
import {FiltersProvider} from '../context/FiltersContext';
import '../App.css';

const MapSection = () => {
  return (
    <div>
      <Nav />
      <div className="MapImage">
        <MapImage />
      </div>

      <FiltersProvider>
        <div className="FilterButtons">
         <FilterButtonsList />
        </div>
        <div className="AddFavourite">
          <AddFavourite />
        </div>
      </FiltersProvider>
      
    </div>
  );
};

export default MapSection;
