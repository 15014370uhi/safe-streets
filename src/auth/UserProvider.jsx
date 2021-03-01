import React, { Component, createContext } from "react";
import {auth, firebase} from '../firebase';

// Context for user 
export const UserContext = createContext({ user: null });

class UserProvider extends Component {

  // State to hold a reference to the currently logged in user
  state = {
    user: null
  };
   
  // TODO The firebase version seems to work better than
  // TODO also try maybe using the authstatechanged in each component where its needed
  // TODO to try get displayname that way>?
  
  componentDidMount = async () => {
    await auth.onAuthStateChanged(user => {
      this.setState({ user: user});
      console.log("displayname in userProvider: " + user.displayName); // TODO this doesnt read displayName like..ever!
    });

    // OLD VERSION
    // auth.onAuthStateChanged(async userAuth => {
    //   const user = await generateUserDocument(userAuth);     
    //   this.setState({ user });
    // });

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