import React, {useContext, useState} from 'react';
import {UserContext} from '../../auth/UserProvider';
import {Link} from '@reach/router';
import {ReactComponent as Logo} from '../../images/logo.svg';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import {auth} from '../../firebase';

const Navbar2 = props => {
  const user = useContext (UserContext); // Get User Context
  const [click, setClick] = useState (false);
  const handleClick = () => setClick (!click);
  const closeMobileMenu = () => setClick (false);

  return (
    <React.Fragment>
      <nav className="navbar">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <Logo />
          Safe Streets
        </Link>

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
                    onClick={closeMobileMenu}
                  >
                    Search
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    to="/favourites"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    Favourites
                  </Link>
                </li>
                <FontAwesomeIcon icon="user" />

                <li className="nav-item">
                  <DropdownButton
                    id="dropdown-basic-button"
                    title={user.displayName}
                    icon="fas fa-user"
                  >

                    <Button>
                      <Link to="/profile" className="nav-links">
                        Profile
                      </Link>
                    </Button>

                    <Dropdown.Divider />

                    <Button>
                      <Link
                        to="/"
                        className="nav-links"
                        onClick={() => auth.signOut ()}
                      >
                        Logout
                      </Link>
                    </Button>

                  </DropdownButton>
                </li>
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
      </nav>
    </React.Fragment>
  );
};

export default Navbar2;
