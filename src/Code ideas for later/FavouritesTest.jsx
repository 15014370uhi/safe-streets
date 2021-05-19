import TextField from "@material-ui/core/TextField";
import { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import 'firebase/firestore'; //firebase firestore
import firebase from "firebase";
//import TodoListItem from "./Todo";
import ListGroup from 'react-bootstrap/ListGroup';
import Favourite from '../components/Favourite';
import uuid from 'react-uuid';




function FavouritesTest({user}) {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [localFavourites, setLocalFavourites] = useState([]);
  const [aUser, setAUser] = useState('');

  useEffect(() => {
    //setFavourites();
    getFavourites();
    console.log("Favourites length from props: " + user.favourites.length);
  }, []); // blank to run only on first launch


  function setFavourites() {
   // setLocalFavourites(user.favourites);
    setAUser(auth().currentUser);
   // console.log("Current logged in user inside: " + firebase.auth().currentUser.email);
   // console.log("Local state user " + aUser.favourites);
   // console.log("Local state favourites " + localFavourites);
  }

  function getFavourites() {
    const currentUser = auth().currentUser
    //firestore.collection("users").doc(user.uid).collection("favourites").onSnapshot(function (querySnapshot) {
    
      var userRef = firebase.firestore().collection('users').doc(currentUser.uid);
      userRef.get().then(function(doc) {
          if (doc.exists) {
             // console.log("Users email is:", doc.data().email);
             // console.log("Users favourites has length:", doc.data().favourites.length);
              doc.data().favourites.map((favourite) => console.log(favourite.title + " " + favourite.mapURL));
              setLocalFavourites(doc.data().favourites);
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
     
  }


// Function which returns the latest user document from firestore
function getUserDocument (uid) {

  // No current logged in user, return null
  if (!uid){
    return null;
  } 
  try {
    const userDocument = firestore.doc(`users/${uid}`).get();
    return {
      uid,
      ...userDocument.data()
    };
  } 
  catch (error) {
    console.error("Error fetching user", error);
  }
};


  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}>
      <div style={{ width: "90vw", maxWidth: "500px", marginTop: "24px" }}>
        {localFavourites.map((aFavourite) => (
						<ListGroup
                        style={{border: 24}}
                        spacing={10}
							horizontal="sm"
							className="my-2"
							key={uuid()}>
							<ListGroup.Item>								
								<Favourite
									title={aFavourite.title}
									mapurl={aFavourite.mapURL}
								/>
							</ListGroup.Item>							
						</ListGroup>
					))}
        </div>
             
        <div style={{ width: "90vw", maxWidth: "500px", marginTop: "24px" }}>
        {user.favourites.map((favourite) => (
						<ListGroup
                        style={{border: 24}}
                        spacing={10}
							horizontal="sm"
							className="my-2"
							key={uuid()}>
							<ListGroup.Item>								
								<Favourite
									title={favourite.title}
									mapurl={favourite.mapURL}
								/>
							</ListGroup.Item>							
						</ListGroup>
					))}
        </div>
      </div>
    </div>
  );
}

export default FavouritesTest;
