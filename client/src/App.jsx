import {useState, useEffect, Fragment} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Register from './components/Register';

import './App.css';

function App () {
  const [token, setToken] = useState (); // TODO instead of username and pasword <<<<<<
  // TODO  all I need is the token thing saved in user context and maybe favourties context <<<<

  if (!token) {
    return <Register setToken={setToken} />;
  }

  return (
    <div className="wrapper">
      <h1>Application</h1>
      <Router>
       
      </Router>
    </div>
  );
}

export default App;
