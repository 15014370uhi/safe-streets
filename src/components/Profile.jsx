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
 

  const onSignOutHandler = async (e) => {
    //e.preventDefault();
    console.log("onSignOutHandler clicked");
    await auth.signOut()
        .then(data => console.log(data))
        .catch(err => console.log(err));
   }

    // TODO also get favourites array from user
  // TODO move signout to a function
  // TODO delete account from
  // TODO logout using Auth
  // TODO move logout to function

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
                  onClick={onSignOutHandler}
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