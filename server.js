const express = require ('express');
const mongoose = require ('mongoose');
const bodyParser = require ('body-parser');

const app = express ();

// BodyParser Middleware
app.use (bodyParser.json ());

// Mongo DB configuration
const db = require ('./config/keys').mongoURI;

// Connect to Mongo Server
mongoose
  .connect (db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then (() => console.log ('Mongo DB is connected'))
  .catch (err => console.log (err));

  const port = process.env.PORT || 5000;

  app.listen(port, () => console.log(`Server started on port ${port}`));
