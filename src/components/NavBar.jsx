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
import firebase from 'firebase';

const NavBar = props => {
  const user = useContext (UserContext); // Get User Context
  const [click, setClick] = useState (false);
  const handleClick = () => setClick (!click);
  const closeMobileMenu = () => setClick (false);

  const [localFavouritesTotal, setLocalFavouritesTotal] = useState([]);
	const [localUserName, setLocalUserName] = useState(null);
	const [localDisplayName, setLocalDisplayName] = useState(null);

  
	useEffect(() => {  
      getUserDetails();  
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

// Function which retrieves the favourites for a user
 // If user missing, exit
 

const getUserDetails = async () => {
  if (user){
    var userRef = await firebase.firestore().collection('users').doc(user.uid);
    userRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          setLocalFavouritesTotal(doc.data().favourites.length);
          setLocalUserName(doc.data().username);
          setLocalDisplayName(doc.data().displayName);
         // setLocalEmail(doc.data().displayName);

        } else {
          console.log('No favourites!');
        }
      })
      .catch(function (error) {
        console.log('Error getting favourites:', error);
      });  
    }  
};



  //TODO replace all with Navbar stuff
  return (
    <Navbar>
      <Navbar.Brand as={Link} to="/" className="navbar-logo">
        <Logo />
        Safe Streets
      </Navbar.Brand>

      {user ? (
		  <Nav>
            <div className="menu-icon" onClick={handleClick}>
              <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
            </div>

            <ul className={click ? 'nav-menu active' : 'nav-menu'}>   
                      
             <li className="nav-item">
                <Nav.Link as={NavLink} to="/favourites" onClick={closeMobileMenu}>
                  Favourites 
                </Nav.Link>               
              </li>

              <li className="nav-item">
                <Nav.Link as={NavLink} to="/addFavourite" onClick={closeMobileMenu}>
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
                    <i className="fa fa-user fa-lg" />
                    {user.email}
                  </span>
                }
              >
                <DropdownItem as={Link} to="/profile" onClick={closeMobileMenu}>
                  <i className="fas fa-envelope fa-lg" />
                  Profile
                </DropdownItem>
                <Dropdown.Divider />
                <DropdownItem as={Link} to="/" onClick={() => auth.signOut ()}>
                  <i className="fas fa-sign-out-alt fa-lg" />
                  Logout
                </DropdownItem>

              </NavDropdown>
            </ul>
          </Nav>
	   ) : ( 
		   
		   <Nav>		  
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
          </Nav>
	   )}
    </Navbar>
  );
};

export default NavBar;

// TODO favourites navbar link refreshes page, the search link works as intended
