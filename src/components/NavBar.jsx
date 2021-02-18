import React, {useContext, useState, useEffect} from 'react';
import {UserContext} from '../auth/UserProvider';
import {Router, Link} from '@reach/router';
//import {BrowserRouter as Router, Link } from "react-router-dom";
import {auth} from '../firebase';
import Favourites from './Favourites';
import Search from './Search';
import Profile from './Profile';


// TODO check CSS used in navbar 2 for here
// TODO also check out navbar 2 for logo or icon etc


import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavbarToggler,
  MDBCollapse,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBIcon,
  MDBTypography,
} from 'mdbreact';


const Navbar = props => {
  const user = useContext (UserContext); // Get User Context 
  //const [displayName, setDisplayName] = useState("");
 var displayName, email;
 
  if(user){
    console.log("user found in navbar holds: " + user);
    displayName = user.displayName;
    email = user.email;
    //setDisplayName(user.displayName);    
  } else {
    console.log ('No user found in navbar user context');
  }

  const [isOpen, setIsOpen] = useState ('false');

  const toggleCollapse = () => {
    setIsOpen (!isOpen);
  };


// useEffect(() => {
//     const clicked = () => console.log('window clicked')
//     window.addEventListener('click', clicked)

//     return () => {
//       window.removeEventListener('click', clicked)
//     }
//   }, [])



  //TODO link all the Link tos to routes at bottom
  return (
	  
    <React.Fragment>
      <MDBNavbar color="grey darken-2" dark expand="md">

        <MDBNavbarBrand>
          <Link to="/">
            <strong className="white-text">Safe Streets</strong>
          </Link>
        </MDBNavbarBrand>

        <MDBNavbarToggler onClick={() => toggleCollapse ()} />
        <MDBCollapse id="navbarCollapse3" isOpen={isOpen} navbar>

          {user
            ? <React.Fragment>
                <MDBNavbarNav left>
                  <MDBNavItem active>
                    <MDBTypography tag="h3">
                      <Link to="/search">
                       <strong>Search</strong>
                      </Link>
                    </MDBTypography>
                  </MDBNavItem>
                  <MDBNavItem>
                    <MDBTypography tag="h3">
                      <Link to="/favourites">
                       <strong>Favourites</strong>
                      </Link>
                    </MDBTypography>
                  </MDBNavItem>
                </MDBNavbarNav>
                <MDBNavbarNav right>                 
                  <MDBNavItem strong="true" className="white-text">
                    ({user.email})
                  </MDBNavItem>
                  <MDBNavItem>
                    <MDBDropdown>
                      <MDBDropdownToggle nav caret>
                        <MDBIcon icon="user" />
                      </MDBDropdownToggle>
                      <MDBDropdownMenu className="dropdown-default">
                        <MDBDropdownItem href="/profile">
                          Profile
                        </MDBDropdownItem>
                        <MDBDropdownItem>
                          <Link to="/" onClick={() => auth.signOut ()} strong="true" className="text-red">
                          Logout
                        </Link>
                        </MDBDropdownItem>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </MDBNavItem>
                </MDBNavbarNav>
              </React.Fragment>
            : <React.Fragment>
                <MDBNavbarNav right>
                  <MDBNavItem>
                    <Link to="/" strong="true" className="white-text">
                      Login
                    </Link>
                  </MDBNavItem>
                  <MDBNavItem>
                    <Link to="/register" strong="true" className="white-text">
                      Register
                    </Link>
                  </MDBNavItem>
                </MDBNavbarNav>
              </React.Fragment>}
        </MDBCollapse>
      </MDBNavbar>
      
     
    </React.Fragment>
	
  );
};

// <React.Fragment>
//     {user ? (
//       <React.Fragment>
// 	  	<Link to="/search">Search</Link>
//     	<Link to="/favourites">Favourites</Link>
//         <Link to="/profile">Account ({user.displayName})</Link>
//         <button onClick={() => auth.signOut()}>Logout</button>
//       </React.Fragment>
//     ) : (
// 		<React.Fragment>
//       <Link to="/">Login</Link>
// 	  <Link to="/register">Register</Link>
// 	  </React.Fragment>
//     )}
// </React.Fragment>

export default Navbar;
