import React, { useContext } from "react";
import { Router } from "@reach/router";
import SignIn from "./TestSignIn";
import SignUp from "./TestSignUp";
import ProfilePage from "./TestProfile";
import PasswordReset from "./TestPasswordReset";
import UserProvider from "../auth/UserProvider";
import { UserContext } from "../auth/UserProvider";

function TestApplication() {

  const user = useContext(UserContext);

  return (
        user ?
        <ProfilePage />
      :
        <Router>
          <SignUp path="signUp" />
          <SignIn path="/" />
          <PasswordReset path = "passwordReset" />
        </Router>

  );
}
export default TestApplication;