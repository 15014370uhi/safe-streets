const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
  title: String,
  mapURL: String,
});

favouriteSchema.set('toJSON', {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Favourite', favouriteSchema);