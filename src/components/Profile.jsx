import React, {useContext} from 'react';
import {UserContext} from '../auth/UserProvider';
import {Redirect} from '@reach/router';
import {auth} from '../firebase';
import uuid from 'react-uuid';

import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardLink,
  MDBListGroup,
  MDBListGroupItem,
  MDBCardFooter,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
} from 'mdb-react-ui-kit';

const Profile = () => {
  const user = useContext (UserContext); // Get User Context
  var displayName, email;
  if(user){
    displayName = user.displayName;
    email = user.email; // Deconstruct user document elements
  } else {
    console.log ('Not authenticated');
  }
 
    // TODO also get favourites array from user
  // TODO move signout to a function
  // TODO delete account from
  // TODO logout using Auth
  // TODO move logout to function

  // // Get user favourited locations
  // const getFavourites = async () => {

  //     var docRef = db.collection("users").doc(userID);
  //     docRef.get()
  //         .then(function (doc) {
  //             if (doc.exists) {
  //                 var returnedFavourites;
  //                 var favouritesList = [];
  //                 jQuery.each(doc.data(), function (key, value) {
  //                     if (key == "favourites") {
  //                         returnedFavourites = value.toString();
  //                     }
  //                 });

  //                 if (returnedFavourites.length > 0) {
  //                     favouritesList = returnedFavourites.split("https://");
  //                     favouritesList.forEach(aFavourite => {
  //                         if (aFavourite.length > 10) { // Ignore empty first element caused by split action
  //                             alert("A Favourite: \n" + aFavourite);
  //                         }
  //                     });
  //                 } else {
  //                     alert("You have no favourites saved!");
  //                 }

  //                 // return favourites array
  //                 return favouritesList;

  //             } else {
  //                 alert("You have no favourites saved!");
  //                 console.log("No such document!");
  //             }
  //         })
  //         .catch(function (error) {
  //             console.error("Error getting document: ", error);
  //         });
  // }

  return (
    <React.Fragment>
      {user
        ? (<React.Fragment>
            <MDBCard style={{maxWidth: '22rem'}}>
              <MDBCardHeader><h2>Profile</h2></MDBCardHeader>
              <MDBCardBody>
                <MDBCardTitle>
                  {displayName}
                </MDBCardTitle>
                <MDBCardText>
                  {email}
                </MDBCardText>
              </MDBCardBody>
              <MDBCardHeader>Favourites</MDBCardHeader>
              <MDBListGroup flush>
                <MDBListGroupItem key={uuid ()}>
                  <MDBCardLink href="/">Running Route</MDBCardLink>
                </MDBListGroupItem>
                <MDBListGroupItem>
                  <MDBCardLink href="/">Walking Route</MDBCardLink>
                </MDBListGroupItem>
                <MDBListGroupItem>
                  <MDBCardLink href="/">New House Location</MDBCardLink>
                </MDBListGroupItem>
              </MDBListGroup>
              <MDBCardFooter>
                <MDBBtn
                  color="light-blue"
                  className="mb-3"
                  type="submit"
                  onClick={() => {
                    auth.signOut ();
                  }}
                >
                  Logout
                </MDBBtn>
              </MDBCardFooter>
            </MDBCard>
          </React.Fragment>
        ):(        
          <Redirect noThrow to="/" />   
          )}
         
    </React.Fragment>
  );
};
export default Profile;

// TODO add favourites using actual favourites list