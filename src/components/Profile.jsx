import React, {useContext, useState, useEffect} from 'react';
import {UserContext} from '../auth/UserProvider';
import {Redirect} from '@reach/router';
import {auth, deleteUser} from '../firebase';
import uuid from 'react-uuid';
import firebase from 'firebase';
import {useHistory} from 'react-router-dom';

import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardLink,
  MDBListGroup,
  MDBListGroupItem,
  MDBCardFooter,
  MDBCardText,
  MDBBtn,
  MDBContainer,
  MDBIcon,
  MDBInput,
} from 'mdb-react-ui-kit';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Profile = () => {
  const [localFavourites, setLocalFavourites] = useState ([]);
  const [password, setPassword] = useState ('');
  const [error, setError] = useState (null);  
  const user = useContext (UserContext); // Get User Context

  //TODO add icon choice for favourite - Long Term

  // Modal dialog state for user account deletion
  const [show, setShow] = useState (false);
  const handleClose = () => setShow (false);
  const handleShow = () => setShow (true);
  const history = useHistory ();

  useEffect (() => {
    getUserDetails ();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function which retrieves the favourites for a user
  const getUserDetails = async () => {
    if (user) {
      var userRef = await firebase
        .firestore ()
        .collection ('users')
        .doc (user.uid);
      userRef
        .get ()
        .then (function (doc) {
          if (doc.exists) {
            // Set favourites to user favourites
            setLocalFavourites (doc.data ().favourites);
          } else {
            console.log ('No favourites!');
          }
        })
        .catch (function (error) {
          console.log ('Error getting favourites:', error);
        });
    }
  };

  // Function which handles user input changes
  const onChangeHandler = e => {
    const {value} = e.currentTarget;
    setPassword (value);
  };

  // TODO move to firebase if possible
  // Sign out user
  const onSignOutHandler = async () => {
    await auth
      .signOut ()
      .then (data => console.log (data))
      .catch (err => console.log (err));
  };

  // Function to delete the current user's account
  const deleteUserHandler = async e => {
    deleteUser (password)
      .then (function () {
        // Redirect to home page
        let path = `/register`;
        history.push (path);
        console.log ('User ' + user.email + ' deleted!');
      })
      .catch (function (error) {
        setError (error.message);
        console.log ('Error deleting user account', error);
      });
  };

  // TODO also get favourites array from user
  // TODO move signout to a function
  // TODO delete account from
  // TODO logout using Auth
  // TODO move logout to function

  const loadFavourite = (aMapURL, title) => {
    //console.log("loading favourite with: " + aMapURL + " " + title);
    history.push (`/results`, {
      mapurl: aMapURL,
      title: title, //TODO needed?
      isfavourite: 'true', //TODO needed?? is map a previously favourited map or new search result
    });
  };

  return (
    <React.Fragment>
      {user
        ? <MDBCard className="profile-card">
            <MDBCardHeader className="profile-heading">
              <h1 className='profile-main-heading'>Profile</h1>
            </MDBCardHeader>
            <MDBCardBody>
              <MDBCardText><label className="profile-text">Email: {user.email}</label></MDBCardText>
            </MDBCardBody>
            <MDBCardHeader className="profile-heading"><h2 className='profile-main-heading'>Favourites</h2></MDBCardHeader>
            <MDBListGroup flush>
              {localFavourites.map (favourite => (
                <div key={uuid ()} className="profile-list-favourite-item" onClick={() => {
                      loadFavourite (favourite.mapURL, favourite.title);
                    }}>
                <MDBListGroupItem className="profile-favourites-list" >               
                <MDBCardLink         
                  >
                    <label className="profile-text  profile-favourite-entry">{favourite.title}</label>
                  </MDBCardLink>  
                </MDBListGroupItem>
                </div>
              ))}
            </MDBListGroup>

            <MDBCardFooter className="profile-footer">
              <MDBBtn
                color="primary" 
                className="mb-3 profile-footer-button"
                type="submit"
                onClick={onSignOutHandler}
              >
                Logout
              </MDBBtn>
              <MDBBtn 
                color="danger"
                className="mb-3 profile-footer-button"
                type="submit"
                onClick={handleShow}
              >
                Delete Account
              </MDBBtn>
            </MDBCardFooter>

            <Modal show={show} onHide={handleClose} animation={false}>
              <MDBContainer>
                <MDBIcon size="3x" icon="user" />
                {user.email}
                <br />
                <Modal.Title>
                  <p>
                    To permanently delete your account, please
                    confirm your password.
                  </p>
                </Modal.Title>
              </MDBContainer>

              <Modal.Body>
                <div>
                  <MDBInput
                    icon="lock"
                    type="password"
                    name="password"
                    placeholder="Enter your password..."
                    value={password}
                    onChange={e => onChangeHandler (e)}
                  />
                </div>

                <div className="text-center mt-4">
                  {error !== null &&
                    <div className="py-4 bg-red-600 w-full text-red text-center mb-3">
                      {error}
                    </div>}
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={deleteUserHandler}>
                  Delete My Account
                </Button>
              </Modal.Footer>
            </Modal>
          </MDBCard>
        : <Redirect noThrow to="/" />}
    </React.Fragment>
  );
};
export default Profile;

// TODO add favourites using actual favourites list
