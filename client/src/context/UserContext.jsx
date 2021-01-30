import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const UserContext = createContext();

function UserContextProvider(props) {        // TODO maybe use token isntead of loggedin stuff - or set it false
  const [loggedIn, setLoggedIn] = useState(undefined); // TODO -- Actually this might be a good idea!!!!
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");  // TODO user context to hold this stuff  

  const [token, setToken] = useState("");  // TODO uMight not need the above stuf - and clear token when logging out?


  async function getLoggedIn() {
    const loggedInResponse = await axios.get("http://localhost:5000/auth/login"); // WAS loggedIn - as a check to find out if logged in
    ////Might need to check out if I need to find out if user is logged in or just save here I rekon
    //const loggedInRes = await axios.get(
     // "https://virtual-revolution.com/safe-streets/auth/loggedIn" //TODO change to my website
   // );
    setLoggedIn(loggedInResponse.data);
  }

  useEffect(() => {
    getLoggedIn();
  }, []);

  return (
    <UserContext.Provider value={{ loggedIn, getLoggedIn }}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContext;
export { UserContextProvider };
