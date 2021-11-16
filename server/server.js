const express = require ('express');
const dotenv = require ('dotenv');
const cors = require ('cors');
const routes = require ('./routers/routes');
const app = express ();
const path =require('path')

//allow environmental variables
dotenv.config ();

//set port to server env variable or port 4000
const PORT = process.env.PORT || 4000;

//middleware
app.use (express.json ());
app.use(express.static(path.join(__dirname, "../build"))); //test
app.use (
  cors ({
    origin: [
      'http://localhost:3000',
      'http://virtual-revolution.com/safe-streets/', 
      'https://safe-streets-app.herokuapp.com/',     
    ],
    credentials: true,
  })
);

//start server
app.listen (PORT, () => {
  console.log (`Server is running on port ${PORT}`);
});

//set api route
app.use ('/api/map', routes);
