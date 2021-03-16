const express = require('express');
//const router = require ('express').Router ();
const dotenv = require('dotenv');
const cors = require('cors');
//const apiRoutes = require ('./routers/routes');
const mapRoutes = require ('./routers/mapRoutes');

const app = express ();

dotenv.config();
app.use (cors);
app.use (express.json ());

// Set port to environment variable or 5000
const PORT = process.env.PORT || 5000;

// Start server
app.listen (PORT, () => {
    console.log (`Server is running on port ${PORT}`);
  });

  app.get('/', (req, res) => res.send('Hello world!'));

// Set api routes
//app.use('/api/map', mapRoutes);

//app.use ('/api', apiRoutes);


