import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from '../auth/UserProvider';
//import firebase from 'firebase';


const Search = () => {
 const user = useContext (UserContext); // Get User Context
 //const {displayName, username, email} = user; // Deconstruct user document elements
 
 //const [localFavouritesTotal, setLocalFavouritesTotal] = useState([]);
 //const [localUserName, setLocalUserName] = useState(null);
// const [localDisplayName, setLocalDisplayName] = useState(null);


 useEffect(() => {  
 // getUserDetails();  
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  return (
    <React.Fragment>   
      This is the Search Page     
    </React.Fragment>
  );
};

export default Search;
