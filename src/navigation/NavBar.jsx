import React, {useContext, useState} from 'react';
import {UserContext} from '../auth/UserProvider';
import {ReactComponent as Logo} from '../images/logo.svg';
import {auth} from '../firebase';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import {NavLink} from 'react-router-dom';

const NavBar = (props) => {
	const user = useContext(UserContext);
	const [click, setClick] = useState(false);
	const handleClick = () => setClick(!click);
	const closeMobileMenu = () => setClick(false);

	return (
		<Navbar className="navbar-full" fixed="top"> 
			<Navbar.Brand as={NavLink} to="/" className="navbar-logo">
				<Logo />
				<div className="navbar-logo-text">
					<h1>Safe Streets</h1>
				</div>
			</Navbar.Brand>
			{user ? (
				<Nav>
					<div className="menu-icon" onClick={handleClick}>
						<i className={click ? 'fas fa-times' : 'fas fa-bars'} />
					</div>

					<li className="nav-item mobile-show mobile-nav-search">
						<Nav.Link
							as={NavLink}
							to="/search"							
							onClick={closeMobileMenu}>
							<i className="fas fa-search fa-2x mobile-search" />
							<label className="nav-icon-label search-icon-label">
								Search
							</label>
						</Nav.Link>
					</li>

					<ul className={click ? 'nav-menu active' : 'nav-menu'}>
						<li className="nav-item mobile-hide">
							<Nav.Link
								as={NavLink}
								to="/search"
								onClick={closeMobileMenu}>
								<i className="fas fa-search fa-2x mobile-icon" />
								<label className="nav-icon-label search-icon-label">
									Search
								</label>
							</Nav.Link>
						</li>

						<li className="nav-item">
							<Nav.Link
								as={NavLink}
								to="/favourites"
								onClick={closeMobileMenu}>
								<i className="fas fa-bookmark fa-2x mobile-icon" />
								<label className="nav-icon-label label-dropdown">
									Favourites
								</label>
							</Nav.Link>
						</li>

						<li className="nav-item mobile-show">
							<Nav.Link
								className="user-dropdown-button"
								as={NavLink}
								to="/profile"
								onClick={closeMobileMenu}>
								<i className="fas fa-user fa-2x mobile-icon" />
								<label className="nav-icon-label label-dropdown">
									Profile
								</label>
							</Nav.Link>
						</li>

						<li className="nav-item mobile-show">
							<Nav.Link
								className="user-dropdown-button"
								as={NavLink}
								to="/"
								onClick={() => auth.signOut()}>
								<i className="fas fa-sign-out-alt fa-2x mobile-icon" />
								<label className="nav-icon-label label-dropdown">
									Logout
								</label>
							</Nav.Link>
						</li>

						<NavDropdown
							className="mobile-hide"
							title={
								<i className="fa fa-user fa-2x mobile-icon" />
							}>
							<DropdownItem
								className="dropdown-button"
								as={NavLink}
								to="/profile"
								onClick={closeMobileMenu}>
								<i
									id="dropdownProfileIcon"
									className="fas fa-user fa-lg"
								/>
								<label className="dropdown-text">Profile</label>
							</DropdownItem>
							<DropdownItem
								className="dropdown-button"
								as={NavLink}
								to="/"
								onClick={() => auth.signOut()}>
								<i
									id="dropdownLogoutIcon"
									className="fas fa-sign-out-alt fa-2x"
								/>
								<label className="dropdown-text">Logout</label>
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
							<Nav.Link
								as={NavLink}
								to="/register"
								onClick={closeMobileMenu}>
								Register
							</Nav.Link>
						</li>

						<li className="nav-item">
							<Nav.Link
								as={NavLink}
								to="/"
								onClick={closeMobileMenu}>
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