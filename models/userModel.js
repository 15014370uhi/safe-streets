const mongoose = require ('mongoose');


const userSchema = new mongoose.Schema({   
    email: {
        type: 'string',
        required: true
    },
    passwordHash: {
        type: 'string',
        required: true
    },
    favourites: []
});

module.exports = mongoose.model ('user', userSchema);

