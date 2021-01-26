const express = require ('express');
const app = express ();
const mongoose = require ('mongoose');
const dotenv = require ('dotenv');

// Import routes
const authRoute = require ('./routes/auth');

dotenv.config ();

// Connect to MongoDB
mongoose.connect (process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
  console.log ('connected to Mongo DB')
);

// Middleware
app.use(express.json());  // Body parser json

// Routes Middlewares - define const (from above) to use for each route
app.use ('/api/user', authRoute);

app.listen (3000, () => console.log ('Server is running'));
