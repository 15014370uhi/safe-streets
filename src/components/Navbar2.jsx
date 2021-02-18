import React, { useContext, useState } from 'react';
import {UserContext} from '../auth/UserProvider';
import { Button } from 'react-bootstrap';
import {Link} from '@reach/router';
import { ReactComponent as Logo } from '../images/logo.svg';
import {auth} from '../firebase';



const Navbar2 = props => {
    const user = useContext (UserContext); // Get User Context
    const [click, setClick] = useState(false); 
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <React.Fragment>
      <nav className='navbar'>
      
        <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>             
        <Logo />         
          Safe Streets         
        </Link>      
     

        <div className='menu-icon' onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className='nav-item'>
            <Link to='/search' className='nav-links' onClick={closeMobileMenu}>
              Search
            </Link>
          </li>
          <li
            className='nav-item'          
          >
            <Link
              to='/favourites'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              Favourites <i className='fas fa-caret-down' />
            </Link>
                    </li>
          <li className='nav-item'>
            <Link
              to='/profile'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              Profile
            </Link>
          </li>
         

          <li>
            <Link
              to='/register'
              className='nav-links-mobile'
              onClick={closeMobileMenu}
            >
              Register
            </Link>
          </li>

          <li>
            <Link
              to='/'
              className='nav-links-mobile'
              onClick={closeMobileMenu}
            >
              Login
            </Link>
          </li>

        </ul>
      
      </nav>
    </React.Fragment>
  );
}

export default Navbar2;
