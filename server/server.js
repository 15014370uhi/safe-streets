const express = require ('express');
const mongoose = require ('mongoose');
const cors = require ('cors');
const dotenv = require('dotenv');
const decodeUserToken = require ('./decodeUserToken');
const favouritesRouter = require ('./controllers/favourites');

dotenv.config();
const app = express ();

app.use (cors ());
app.use (express.json ());
app.use (decodeUserToken);

// Connect to MongoDB
mongoose.connect (
  process.env.MONGO_URI,
  {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false},
  err => {
    if (err) return console.error (err);
    console.log ('Connected to Mongo DB');
  }
);

app.use ('/api', favouritesRouter);

const PORT = process.env.PORT || 5000;

app.listen (PORT, () => {
  console.log (`Server is running on port ${PORT}`);
});
