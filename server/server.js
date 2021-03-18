const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
//const apiRoutes = require ('./routers/routes');
const mapRoutes = require ('./routers/mapRoutes');
const app = express();

// Allow environmental variables
dotenv.config();

// Set port for local testing and enviornmental variable
const PORT = process.env.PORT || 5000;

// Middleware
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

//app.use(cors(corsOptions));

// Start server
app.listen (PORT, () => {
    console.log (`Server is running on port ${PORT}`);
  });

  app.get('/', (req, res) => res.send('Hello world!'));

// Set api routes
app.use('/api/map', mapRoutes);
//app.use('/api/user', userRoute);

//app.use ('/api', apiRoutes);


