import React, { Component, createContext } from "react";
import {auth, generateUserDocument} from '../firebase';

// Context for user status
export const UserContext = createContext({ user: null });

class UserProvider extends Component {
  state = {
    user: null
  };

   
  componentDidMount = async () => {
    auth.onAuthStateChanged(async userAuth => {
      const user = await generateUserDocument(userAuth);
      console.log("UserProvider setting user to: " + user);
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