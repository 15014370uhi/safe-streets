import React from "react";
import Application from './components/Application';
import UserProvider from "./auth/UserProvider";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <UserProvider>
      <Application />
    </UserProvider>
  );
}
export default App;