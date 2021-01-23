const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Item Schema
const ItemSchema = new Schema({
    name: {
        type: 'string',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// Export Schema
module.exports = Item = mongoose.model('item', ItemSchema);