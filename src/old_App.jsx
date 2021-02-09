import React, {Component} from 'react';
import Fire from './Fire';
import Login from './components/Login';
import Search from './components/Search';
import NavBar from './components/NavBar';
import UserProvider from "./auth/UserProvider";

////////////////////////////////////////////////////////////////

import { Router } from "@reach/router";
import SignIn from "./components/testSignIn";
import SignUp from "./components/testSignUp";
//import ProfilePage from "./components/ProfilePage";
////////////////////////////////////////////////////

//import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
  }

authListener = () => {
  Fire.auth().onAuthStateChanged((user) => {
    console.log("authState changed");
    // If user logged in
    if(user){
      console.log("User found: " + user);
      // Set state to logged in user
      this.setState({user});
    } else {
      console.log("NO user found " + user);
      // No user logged in set state to null
      this.setState({user:null});
    }
  })
}


componentDidMount = () => {
  this.authListener();
}

// TODO maybe pass user as props?
  render() {
    return (
      this.state.user ?
        <ProfilePage />
      :
        <Router>
          <SignUp path="signUp" />
          <SignIn path="/" />
          <PasswordReset path = "passwordReset" />
        </Router>
    );
  } 
}

// // PREVIOOUS
// render() {
//   return (
//     <UserProvider>
//     <div className="App">
//     <NavBar />
//       {this.state.user ? (<Search />) : (<Login />)}
//     </div>
//     </UserProvider>
//   );
// } 

export default App;
