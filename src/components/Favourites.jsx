import React, {useContext, useEffect, useState} from 'react';
import Favourite from './Favourite';
import {UserContext} from '../auth/UserProvider';
import uuid from 'react-uuid';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import firebase from "firebase";

const Favourites = (props) => {
	const [localFavourites, setLocalFavourites] = useState([]);
	const user = useContext(UserContext); // Get User Context for ID
	
	// TODO TRY move the functions to the firebase - for favs etc
	// TODO REM - only use useContext Usercontext to get current user ID nothing else
	
	useEffect(() => {		
		getFavourites();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	  }, []); 

	// TODO change functions to consts

// Function which retrieves the favourites for a user
  function getFavourites() {    
      var userRef = firebase.firestore().collection('users').doc(user.uid);
      userRef.get().then(function(doc) {
          if (doc.exists) {            
              setLocalFavourites(doc.data().favourites);
          } else {
              console.log("No favourites!");
          }
      }).catch(function(error) {
          console.log("Error getting favourites:", error);
      });     
  }

  // TODO move firebase functions to firebase file
  // Function to remove a favourite from a user's collection of favourites
  function deleteFavourite(aTitle) {
	var userRef = firebase.firestore().collection('users').doc(user.uid);
    userRef.get().then(function(doc) {
		if (doc.exists) {            
			
			const favouritesToKeep = doc.data().favourites.filter(
				favourite => favourite.title !== aTitle
			)		
			// Update firestore doc with the filtered favourites
			userRef.update({
				favourites: favouritesToKeep
			});		
			
			// Update favourites state 
			setLocalFavourites(favouritesToKeep);
		} else {
			console.log("No favourites!");
		}
	}).catch(function(error) {
		console.log("Error getting favourites:", error);
	});  

  }

	return (
		<Container>
			Favourites List
			{localFavourites.length ? (
				<Container id="favouritesContainer">
					<br />
					<h2>Favourites for: {user.displayName}</h2>					
                    <br />
					<h3>Number of favourites: {localFavourites.length}</h3>
					<br />	
                    <section>		
					{localFavourites.map((favourite) => (
						<ListGroup
                        style={{border: 24}}
                        spacing={10}
							horizontal="sm"
							className="my-2"
							key={uuid()}>
							<ListGroup.Item>								
								<Favourite
									title={favourite.title}
									mapURL={favourite.mapURL}
								/>								 
     						 <Button onClick={() => deleteFavourite(favourite.title)}>X</Button>
							</ListGroup.Item>							
						</ListGroup>
					))}
                    </section>		
				</Container>
			) : (
				<div>No favourites found</div>
			)}
		</Container>
	);
};

export default Favourites;

//TODO implement Favourite component to display favourite information
