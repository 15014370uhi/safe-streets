import React, {useContext, useState} from 'react';
import {UserContext} from '../../auth/UserProvider';
import {Link} from '@reach/router';
import {ReactComponent as Logo} from '../../images/logo.svg';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import {auth} from '../../firebase';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


//import { useHistory } from 'react-router-dom';
//history.push("/path/to/push");

const Navbar2 = props => {
  const user = useContext (UserContext); // Get User Context
  const [click, setClick] = useState (false);
  const handleClick = () => setClick (!click);
  const closeMobileMenu = () => setClick (false);

  //TODO replace all with Navbar stuff

  return (
    <React.Fragment>
      <Navbar className="navbar">

      <Navbar.Brand>
      <Logo />
      <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>         
          Safe Streets
        </Link>
    </Navbar.Brand>       

        {user
          ? <React.Fragment>
              <div className="menu-icon" onClick={handleClick}>
                <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
              </div>

              <ul className={click ? 'nav-menu active' : 'nav-menu'}>               
             
                <li className="nav-item">
                  <Link
                    to="/search"
                    className="nav-links"
                    onClick={closeMobileMenu}>
                    Search
                  </Link>
                </li>


                <li className="nav-item">
                  <Link
                    to="/favourites"
                    className="nav-links"
                    onClick={closeMobileMenu}>
                    Favourites
                  </Link>
                </li>

              
                <NavDropdown                   
                    title={
                      <span>
                        <i className="fa fa-user fa-fw" /> {user.email}
                      </span>
                    }
                  >

                  <NavDropdown.Item>
                    <i className="fa fa-envelope fa-lg" />
                    <Link to="/profile" className="nav-links">
                      Profile
                    </Link>
                  </NavDropdown.Item>

                  <Dropdown.Divider />

                  <NavDropdown.Item>
                    <i className="fas fa-sign-out-alt fa-lg" />
                    <Link to="/" onClick={() => auth.signOut ()} className="nav-links">
                      Logout
                    </Link>
                  </NavDropdown.Item>
                 
                </NavDropdown>
                         
              </ul>
            </React.Fragment>

          : <React.Fragment>
              <div className="menu-icon" onClick={handleClick}>
                <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
              </div>

              <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                <li className="nav-item">
                  <Link
                    to="/register"
                    className="nav-links-mobile"
                    onClick={closeMobileMenu}
                  >
                    Register
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    to="/"
                    className="nav-links-mobile"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </React.Fragment>}
      </Navbar>
    </React.Fragment>
  );
};

export default Navbar2;
