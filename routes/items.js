const express = require ('express');
const router = express.Router ();

// Set Item Model
const Item = require ('../models/Item');

// @route GET /items
// @desc GET All Items
router.get ('/', (req, res) => {
  Item.find ()
    .sort ({date: -1}) // Sort by date in descending order
    .then (items => res.json (items)); // Return all items
});

// @route POST /items
// @desc Create a New Item
router.post ('/', (req, res) => {
  // Create new item using model Item passing name from req args
  const newItem = new Item ({
    name: req.body.name,
  });
  // Save new Item to db
  newItem.save ().then (item => res.json (item));
});

// @route DELETE /items/:id
// @desc DELETE an Item
router.delete ('/:id', (req, res) => {
  // Find item by id from parameters
  Item.findById (req.params.id)
    .then (item => {item.remove ().then (() => res.json ({success: true, action: "Item Deleted"}))})
    .catch (err => res.status (404).json ({success: false}));
});

module.exports = router;
