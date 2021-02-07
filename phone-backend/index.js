const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const decodeIDToken = require('./authenticateToken');
const phonesRouter = require('./controllers/phones');
const app = express();

//TODO  Move to env variable
mongoose.connect(  
    'mongodb+srv://admin:clQvA5dPg2mK2nKL@safe-streets.uvvcq.mongodb.net/safe_streets_database?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.log('Error connecting to DB', err.message);
  });
app.use(cors());
app.use(express.json());
app.use(decodeIDToken);

app.use('/api', phonesRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});