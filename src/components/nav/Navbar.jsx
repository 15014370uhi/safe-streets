import React, {useContext, useState, useEffect} from 'react';
import {UserContext} from '../../auth/UserProvider';
import {Router, Link} from '@reach/router';
//import {BrowserRouter as Router, Link } from "react-router-dom";
import {auth} from '../../firebase';
import Favourites from '../../components/Favourites';
import Search from '../../components/Search';
import Profile from '../../components/Profile';
import {ReactComponent as Logo} from '../../images/logo.svg';

// TODO check CSS used in navbar 2 for here
// TODO also check out navbar 2 for logo or icon etc


const Navbar = (props) => {
	const user = useContext(UserContext); // Get User Context
	const [click, setClick] = useState(false);
	const handleClick = () => setClick(!click);
	const closeMobileMenu = () => setClick(false);
	//const [displayName, setDisplayName] = useState("");
	var displayName, email;

	if (user) {
		console.log('user found in navbar holds: ' + user);
		displayName = user.displayName;
		email = user.email;
		//setDisplayName(user.displayName);
	} else {
		console.log('No user found in navbar user context');
	}

	const [isOpen, setIsOpen] = useState('false');

	const toggleCollapse = () => {
		setIsOpen(!isOpen);
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
			<nav className='navbar'>
				<Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
					<Logo />
					Safe Streets
				</Link>

				{user ? (
					<React.Fragment>
						<ul className={click ? 'nav-menu active' : 'nav-menu'}>
							<li className='nav-item'>
								<Link
									to="/search"
									className='nav-links'
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
									<i className="fas fa-caret-down" />
								</Link>
							</li>
							({user.email})
							<li className="nav-item">
								<Link
									to="/profile"
									className="nav-links"
									onClick={closeMobileMenu}>
									Profile
								</Link>
							</li>
							<li>
								<Link
									to="/"
									className="nav-links-mobile"
									onClick={closeMobileMenu}>
									Logout
								</Link>
							</li>
						</ul>
					</React.Fragment>
				) : (
					<React.Fragment>
						<ul className={click ? 'nav-menu active' : 'nav-menu'}>
							<li>
								<Link
									to="/"
									className="nav-links-mobile"
									onClick={closeMobileMenu}>
									Login
								</Link>
							</li>
							<li>
								<Link
									to="/register"
									className="nav-links-mobile"
									onClick={closeMobileMenu}>
									Register
								</Link>
							</li>
						</ul>
					</React.Fragment>
				)}
			</nav>
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
