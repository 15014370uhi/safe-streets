import React from "react";
import Application from './components/Application';
import UserProvider from "./auth/UserProvider";
import './App.css';

import axios from "axios"; //TEST
axios.defaults.withCredentials = true; //TEST


function App() {
  return (
    <UserProvider>
      <Application />
    </UserProvider>
  );
}
export default App;