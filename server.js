const express = require ('express');
const dotenv = require ('dotenv');
const mongoose = require ('mongoose');
const cors = require ('cors');

dotenv.config ();

const app = express ();
const PORT = process.env.PORT || 5000;

// Middleware
app.use (express.json ()); // Body parser json
app.use (cors ());

// Connect to MongoDB
mongoose.connect (
  process.env.ATLAS_URI,
  {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false},
  err => {
    if (err) return console.error (err);
    console.log ('Connected to Mongo DB');
  }
);

app.listen (PORT, () => console.log (`Server started on port ${PORT}`));

// Routes
app.use('/auth', require("./routers/userRouter"));