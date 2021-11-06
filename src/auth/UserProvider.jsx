import React, { Component, createContext } from "react";
import { auth } from "../firebase"; // firebase authentication

// context for user
export const UserContext = createContext({ user: null });

class UserProvider extends Component {
	// hold reference to the currently logged in user
	state = {
		user: null,
	};

	componentDidMount = async () => {
		await auth.onAuthStateChanged((user) => {
			this.setState({ user: user });
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
