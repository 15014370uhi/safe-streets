import React, {Component} from 'react';
import Fire from '.././Fire';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link } from "@reach/router";

// TODO redirect to login after sign onAuthStateChanged
// TODO If user - show favourites link, Profile link and logout link
// TODO If not user - Show nothing except Logo and name that links to login page

// TODO how to check if user is logged in?

class NavBar extends Component {
  constructor (props) {
    super (props);
    this.state = {
      user: {},
    };
  }

  authListener = () => {
    Fire.auth ().onAuthStateChanged (user => {
      console.log ('authState changed');
      // If user logged in
      if (user) {
        console.log ('User found? ' + user);
        // Set state to logged in user
        this.setState ({user});
      } else {
        console.log ('NO user found? ' + user);
        // No user logged in set state to null
        this.setState ({user: null});
      }
    });
  }

  
logout = () => {
    Fire.auth().signOut();
}


  componentDidMount = () => {
    this.authListener ();
  }

  // {this.state.user ? (<Search />) : (<Login />)}

  render () {
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">Safe Streets</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#search">Search</Nav.Link>
            <Nav.Link href="#favourites">Favourites</Nav.Link>
          </Nav>
          <Nav>
            <Navbar.Text>
              Signed in as: <a href="#profile">Username Here</a>
            </Navbar.Text>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBar;
