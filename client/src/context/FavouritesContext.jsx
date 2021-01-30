import React,{useState, createContext} from 'react';

// Import the FavouriteContext to access the FavouriteProvider data below
export const FavouritesContext = createContext();

// Provider - providing the data
export const FavouritesProvider = props => {
const [favourites, setFavourites] = useState ([
    {
      title: 'My running route',
      mapURL: 'https://www.mapquestapi.com/staticmap/v5/map?key=HaI8dvLBtirhMstWmwrcbkRmltyyHAT2&locations=England&size=@2x'
      
    },
    {
      title: 'My cycling area',
      mapURL: 'https://www.mapquestapi.com/staticmap/v5/map?key=HaI8dvLBtirhMstWmwrcbkRmltyyHAT2&locations=England&size=@2x'
      
    },
    {
      title: 'House for sale',
      mapURL: 'https://www.mapquestapi.com/staticmap/v5/map?key=HaI8dvLBtirhMstWmwrcbkRmltyyHAT2&locations=England&size=@2x'
      
    }
  ]);

//Put this in the map display component once done
// $apiKey = "HaI8dvLBtirhMstWmwrcbkRmltyyHAT2";
 // $baseURL = "http://open.mapquestapi.com/geocoding/v1/address?key=";
  //$URLGeocode = $baseURL . $apiKey . "&location=" . $locationName . ",UK";

  // Default uk map
  //https://www.mapquestapi.com/staticmap/v5/map?key=HaI8dvLBtirhMstWmwrcbkRmltyyHAT2&locations=England&size=@2x

  
  return(   
      <FavouritesContext.Provider value={[favourites, setFavourites]}>
          {props.children}
      </FavouritesContext.Provider>       
    );
}