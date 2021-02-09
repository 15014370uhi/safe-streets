import React from "react";
import TestApplication from './components/TestApplication';
import UserProvider from "./auth/UserProvider";

function App() {
  return (
    <UserProvider>
      <TestApplication />
    </UserProvider>
  );
}
export default App;