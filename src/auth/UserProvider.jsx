import React, { Component, createContext } from "react";
import {auth, generateUserDocument} from '../firebase';

// Context for user 
export const UserContext = createContext({ user: null });

class UserProvider extends Component {

  // State to hold a reference to the currently logged in user
  state = {
    user: null
  };
   
  componentDidMount = async () => {
    auth.onAuthStateChanged(async userAuth => {
      const user = await generateUserDocument(userAuth);     
      this.setState({ user });
    });
  };

  render() {
    return (
      <UserContext.Provider value={this.state.user}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
export default UserProvider;