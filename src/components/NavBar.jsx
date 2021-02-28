import React, {useContext, useState} from 'react';
import {UserContext} from '../auth/UserProvider';
import {ReactComponent as Logo} from '../images/logo.svg';
import Dropdown from 'react-bootstrap/Dropdown';
import {auth} from '../firebase';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import {Link, NavLink} from 'react-router-dom';

const NavBar = props => {
  const user = useContext (UserContext); // Get User Context
  const [click, setClick] = useState (false);
  const handleClick = () => setClick (!click);
  const closeMobileMenu = () => setClick (false);

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
