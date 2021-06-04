const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require ('./routers/routes');
const app = express();

//allow environmental variables
dotenv.config();

//set port for local testing and enviornmental variable
const PORT = process.env.PORT || 5000;

//middleware
app.use (express.json ()); // Body parser json
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://virtual-revolution.com/safe-streets/",  
    ],
    credentials: true,
  })
);

//start server
app.listen (PORT, () => {
    console.log (`Server is running on port ${PORT}`);
  });

  app.get('/', (req, res) => res.send('Hello world!'));

//set api route
app.use('/api/map', routes);
