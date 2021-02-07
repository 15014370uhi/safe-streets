const favouritesRouter = require('express').Router();
const Favourite = require('../models/favourite');

favouritesRouter.get('/', async (req, res) => {
  //console.log(req);
  const auth = req.currentUser;
  if (auth) {
    console.log("user_id :" + auth.user_id); // Get user ID
    //console.log("User information received at backend: ");
 // console.log(auth);
    const favourites = await Favourite.find({});
    return res.json(favourites.map((favourite) => favourite.toJSON()));
  }
  return res.status(403).send('Not authorized');
});

favouritesRouter.post('/', async (req, res) => {
  const auth = req.currentUser;
 console.log("req: " + req);
  console.log("req.current: " + req.currentUser);
  
  if (auth) {
    
  console.log("user_id :" + auth.user_id);
    const favourite = new Favourite(req.body);
    const savedFavourite = await favourite.save();
   // console.log("req.body: ");
   // console.log(req.body);

    return res.status(201).json(savedFavourite);
  }
  return res.status(403).send('Not authorized');
});

module.exports = favouritesRouter;
