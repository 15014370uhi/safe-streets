import React, {useState} from 'react';
import '../App.css';

// TODO - put this in a container which can display the title if favourited
// TODO -Will need state>?  with default as UK wide map - then if back button from account
// TODO -page etc can reload current map from state?  what about history?

/**
 * Component to display a static map image 
 * 
 * @param {string} mapURL - URL for map image
 */
const MapImage = ({mapURL}) => {

var mapImageURL = 'https://www.mapquestapi.com/staticmap/v5/map?key=HaI8dvLBtirhMstWmwrcbkRmltyyHAT2&locations=England&size=@2x';

if(mapURL !== undefined){
  mapImageURL = mapURL;
}

return (   
      <img className="mapImg" src={mapImageURL} alt="Map" />    
  );
};

export default MapImage;
