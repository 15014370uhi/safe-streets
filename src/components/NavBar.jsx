import React, {useContext, useState} from 'react';
import {UserContext} from '../auth/UserProvider';
import {ReactComponent as Logo} from '../images/logo.svg';
import Dropdown from 'react-bootstrap/Dropdown';
import {auth} from '../firebase';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';

//import ReactDOM from "react-dom";
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

  //	<Route path="/" exact component={Search} />
  //<Route path="/search" exact component={Search} />
  //	<Route path="/favourites" exact component={Favourites} />

  // TODO issue with navbar could be due to it not being given routes in the
  // TODO applicaiton top path - check where routes are defined
  //<Route path="/favourites" exact component={Favourites} />
  //<Route exact path="/" component={Search} />

  // return (
  //   <React.Fragment>
  //     <nav className="navbar navbar-expand-lg">

  //       <Navbar.Brand>
  //         <a className="navbar-brand" href="/" onClick={closeMobileMenu}>
  //           <div className="d-inline-block align-top">
  //             <Logo />
  //             Safe Streets
  //           </div>
  //         </a>
  //       </Navbar.Brand>

  //       {user
  //        // ? <React.Fragment>
  //             <div className="menu-icon" onClick={handleClick}>
  //               <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
  //             </div>

  //             <ul className={click ? 'nav-menu active' : 'nav-menu'}>

  //               <li className="nav-item">
  //                 <Nav.Link
  //                 as={Link}
  //                   to="/search"
  //                   className="nav-links"
  //                   onClick={closeMobileMenu}
  //                 >
  //                   Search
  //                 </Nav.Link>
  //               </li>

  //               <li className="nav-item">
  //               <Nav.Link
  //                 as={Link}
  //                   to="/favourites" onClick={closeMobileMenu}>
  //                   Favourites
  //                 </Nav.Link>
  //               </li>

  //               <NavDropdown
  //                 title={
  //                   <span>
  //                     <i className="fa fa-user fa-fw" /> {user.email}
  //                   </span>
  //                 }
  //               >

  //                 <NavDropdown.Item>
  //                   <li>
  //                   <Nav.Link
  //                 as={Link}
  //                   to="/profile" onClick={closeMobileMenu}>
  //                       <i className="fa fa-envelope fa-lg" /> Profile
  //                     </Nav.Link>
  //                   </li>
  //                 </NavDropdown.Item>

  //                 <Dropdown.Divider />

  //                 <NavDropdown.Item>
  //                   <i className="fas fa-sign-out-alt fa-lg" />
  //                   <Nav.Link
  //                 as={Link}
  //                   to="/"
  //                     onClick={() => auth.signOut ()}
  //                     className="nav-links"
  //                   >
  //                     Logout
  //                   </Nav.Link>
  //                 </NavDropdown.Item>
  //               </NavDropdown>
  //             </ul>
  //           </React.Fragment>
  //         : <React.Fragment>
  //             <div className="menu-icon" onClick={handleClick}>
  //               <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
  //             </div>

  //             <ul className={click ? 'nav-menu active' : 'nav-menu'}>
  //               <li className="nav-item">
  //                 <Link
  //                   to="/register"
  //                   className="nav-links-mobile"
  //                   onClick={closeMobileMenu}
  //                 >
  //                   Register
  //                 </Link>
  //               </li>

  //               <li className="nav-item">
  //                 <Link
  //                   to="/"
  //                   className="nav-links-mobile"
  //                   onClick={closeMobileMenu}
  //                 >
  //                   Login
  //                 </Link>
  //               </li>
  //             </ul>
  //           </React.Fragment>}
  //     </nav>
  //   </React.Fragment>
  // );
};

export default NavBar;

// TODO favourites navbar link refreshes page, the search link works as intended
