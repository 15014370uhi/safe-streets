import React, { useContext } from "react";
import { Router } from "@reach/router";
import Login from "./Login";
import Register from "./Register";
import ProfilePage from "./TestProfile";
import PasswordReset from "./TestPasswordReset";
import UserProvider from "../auth/UserProvider";
import { UserContext } from "../auth/UserProvider";

function TestApplication() {

  const user = useContext(UserContext);
// TODO change profile to search form Page
  // If user is logged in, display profile page, else show sign up page
  // TODO NOTE:  <ComponentName path="browserAddress" />
  return (
        user ?
        <ProfilePage />
      :
        <Router>
          <Register path="register" />
          <Login path="/" />
          <PasswordReset path = "passwordReset" />
        </Router>

  );
}
export default TestApplication;