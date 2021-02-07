const express = require ('express');
const dotenv = require ('dotenv');
const mongoose = require ('mongoose');
const cookieParser = require("cookie-parser");
const cors = require ('cors');

dotenv.config ();

const app = express ();
const PORT = process.env.PORT || 5000;

// Middleware
app.use (express.json ()); // Body parser json
app.use(cookieParser());
//app.use (cors ());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://virtual-revolution.com/safe-streets/",  
    ],
    credentials: true,
  })
);

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
app.use('/user', require("./routers/userRouter"));