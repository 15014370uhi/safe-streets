import React, {useContext, useState, useEffect} from 'react';
import {UserContext} from '../auth/UserProvider';
import {ReactComponent as Logo} from '../images/logo.svg';
import Dropdown from 'react-bootstrap/Dropdown';
import {auth} from '../firebase';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import {Link, NavLink} from 'react-router-dom';
//import firebase from 'firebase';

const NavBar = props => {
  const user = useContext (UserContext); // Get User Context
  const [click, setClick] = useState (false);
  const handleClick = () => setClick (!click);
  const closeMobileMenu = () => setClick (false);

  useEffect (() => {
    // getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function which retrieves the favourites for a user
  // If user missing, exit

  // const getUserDetails = async () => {
  //   console.log("Running getUserDetails in navbar");
  //   if (user){
  //     var userRef = await firebase.firestore().collection('users').doc(user.uid);
  //     userRef
  //       .get()
  //       .then(function (doc) {
  //         if (doc.exists) {
  //           setLocalFavouritesTotal(doc.data().favourites.length);
  //         } else {
  //           console.log('No favourites!');
  //         }
  //       })
  //       .catch(function (error) {
  //         console.log('Error getting favourites:', error);
  //       });
  //     }
  // };

  //TODO replace all with Navbar stuff
  return (
    <Navbar>
      <Navbar.Brand as={Link} to="/" className="navbar-logo">
        <span className="navbar-logo-span">
          <Logo />
        </span>
        Safe Streets
      </Navbar.Brand>

      {user
        ? <Nav>
            <div className="menu-icon" onClick={handleClick}>
              <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
            </div>

            <ul className={click ? 'nav-menu active' : 'nav-menu'}>

              <li className="nav-item">
                <Nav.Link
                  as={NavLink}
                  to="/favourites"
                  onClick={closeMobileMenu}
                >
                  Favourites{' '}
                </Nav.Link>
              </li>

              <li className="nav-item">
                <Nav.Link
                  as={NavLink}
                  to="/addFavourite"
                  onClick={closeMobileMenu}
                >
                  Add Favourite
                </Nav.Link>
              </li>

              <li className="nav-item">
                <Nav.Link as={NavLink} to="/search" onClick={closeMobileMenu}>
                  Search
                </Nav.Link>
              </li>

              <NavDropdown
                title={
                  <span>
                    <i id="userIcon" className="fa fa-user fa-lg" />
                    {user.email}
                  </span>
                }              >
                <DropdownItem as={Link} to="/profile" onClick={closeMobileMenu}>
                  <i id="dropdownProfileIcon" className="fas fa-envelope fa-2x" />
                  <label className="dropdown-text">Profile</label>
                </DropdownItem>
                <Dropdown.Divider />               
                <DropdownItem as={Link} to="/" onClick={() => auth.signOut ()}>               
                  <i id="dropdownLogoutIcon" className="fas fa-sign-out-alt fa-2x" />
                  <label className="dropdown-text">Logout</label>                   
                </DropdownItem>              
              </NavDropdown>
            </ul>
          </Nav>
        : <Nav>
            <div className="menu-icon" onClick={handleClick}>
              <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
            </div>

            <ul className={click ? 'nav-menu active' : 'nav-menu'}>
              <li className="nav-item">
                <Nav.Link as={NavLink} to="/register" onClick={closeMobileMenu}>
                  Register
                </Nav.Link>
              </li>

              <li className="nav-item">
                <Nav.Link as={NavLink} to="/" onClick={closeMobileMenu}>
                  Login
                </Nav.Link>
              </li>
            </ul>
          </Nav>}
    </Navbar>
  );
};

export default NavBar;

// TODO favourites navbar link refreshes page, the search link works as intended
