import axios from "axios";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../context/UserContext";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");  // TODO Change to user context to hold this stuff  
  const [passwordVerify, setPasswordVerify] = useState("");  // TODO get rid of this verify stuff

// TODO create context for user data returned from login and register
  const { getLoggedIn } = useContext(UserContext);
  const history = useHistory();

  async function register(e) {
    e.preventDefault();

    try {
      const registerData = {
        email,
        password,
        passwordVerify,        
      };

      await axios.post("http://localhost:5000/auth/", registerData);
     // await axios.post(
        //"https://virtual-revolution.com/safe-streets/auth/",
      //  registerData
    //  );
      await getLoggedIn();
      history.push("/"); // TODO remind myself what history does
    } catch (err) {
      console.error("Register Error: " + err);
    }
  }

  return (
    <div>
      <h1>Register a new account</h1>
      <form onSubmit={register}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />      
        <input
          type="password"
          placeholder="Re-Enter Password"
          onChange={(e) => setPasswordVerify(e.target.value)}
          value={passwordVerify}
        />        
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
