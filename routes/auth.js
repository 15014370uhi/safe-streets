// Endpoints for /api/user

const router = require ('express').Router ();
const User = require ('../models/User');

// Validation
const Joi = require ('@hapi/joi');
const schema = {
  username: Joi.string ().min (3).required (),
  email: Joi.string ().min (6).required ().email (),
  password: Joi.string ().min (6).required ()
};

// Register new user
router.post ('/register', async (req, res) => {

    // Validate data before user creation
    const {error} = Joi.validate(req.body, schema);
    res.send(error.details[0].message); // Output error type


//   // Create new user
//   const user = new User ({
//     username: req.body.username,
//     email: req.body.email,
//     password: req.body.password,
//   });

//   // Submit user
//   try {
//     const savedUser = await user.save ();
//     res.send (savedUser);
//   } catch (err) {
//     res.status (404).send (err);
//   }
});

module.exports = router;
