// Endpoints for /api/user
const router = require ('express').Router ();
const User = require ('../models/User');
const {registerValidation, loginValidation} = require ('../validation');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');

// Add to favourites
router.put ('/add', async (req, res) => {
  var favourite = {
    mapURL: 'www.mapurlstring.com',
    title: 'my walking router',
  };

  // find by document id and update
  User.updateOne (
    {_id: '601314af988f89553c1e31c9'},
    {$push: {favourites: favourite}},
    {safe: true, upsert: true},
    function (err, auser) {
      if (err) {
        console.log ("ERRER: " + err);
      } else {
        res.send ("RESPONSE: " + auser.favourites);
      }
    }
  );
});

// // Register new user
// router.post ('/register', async (req, res) => {
//   // Call register user validation function
//   const {error} = registerValidation (req.body);

//   // If error during validation, display error type
//   if (error) {
//     return res.status (400).send (error.details[0].message);
//   }

//   // Check if user email is already registered in database
//   const emailExists = await User.findOne ({email: req.body.email});
//   if (emailExists) {
//     return res.status (400).send ('Email already registered');
//   }

//   // Encrypt password with salt
//   const salt = await bcrypt.genSalt (10);
//   const hashedPassword = await bcrypt.hash (req.body.password, salt);

//   // Validation passed, create new user details
//   const user = new User ({
//     username: req.body.username,
//     email: req.body.email,
//     password: hashedPassword,
//   });

//   // Save new user to database
//   try {
//     const savedUser = await user.save ();
//     res.send ({user: user._id});
//   } catch (err) {
//     res.status (404).send ('Error saving user: ' + err);
//   }
// });

// // Login user
// router.post ('/login', async (req, res) => {
//   // Call login validation function
//   const {error} = loginValidation (req.body);

//   // If error during validation, display error type
//   if (error) {
//     return res.status (400).send (error.details[0].message);
//   }

//   // Check that email exists
//   const user = await User.findOne ({email: req.body.email});

//   // If email does not exist
//   if (!user) {
//     return res.status (400).send ('Email not found');
//   } else {
//     // User found, compare entered password to password in database
//     const validPass = await bcrypt.compare (req.body.password, user.password);
//     if (!validPass) {
//       return res.status (400).send ('Invalid password');
//     } else {
//       // Password valid for user - Set JWT token
//       const token = jwt.sign ({_id: user._id}, process.env.TOKEN_SECRET);

//       // Set token in resonse header
//       res.header ('auth-token', token).send (token);
//     }
//   }
// });

// module.exports = router;








// User.js



// const mongoose = require ('mongoose');

// const userSchema = new mongoose.Schema (
//   {
//     username: {
//       type: String,
//       required: true,
//       minLength: 3,
//     },
//     email: {
//       type: String,
//       required: true,
//       maxLength: 255,
//       minLength: 6,
//     },
//     password: {
//       type: String,
//       required: true,
//       maxLength: 100,
//       minLength: 6,
//     },
//     testArray: [],
//     favourties: []
//   },
//   {
//     usePushEach: true,
//   }
// );

// module.exports = mongoose.model ('User', userSchema);














