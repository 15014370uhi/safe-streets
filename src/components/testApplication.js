import React from "react";
import { Router } from "@reach/router";
import SignIn from "./testSignIn";
import SignUp from "./testSignUp";
import ProfilePage from "./testProfilePage";
import PasswordReset from "./testPasswordReset";
function testApplication() {
  const user = null;
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
export default testApplication;