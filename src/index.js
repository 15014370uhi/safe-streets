import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css'; 
import App from './App.js';
import {BrowserRouter as Router} from 'react-router-dom';

ReactDOM.render (
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById ('root')
);
