const router = require ('express').Router ();
const User = require ('../models/userModel');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');


// Register new user
router.post ('/', async (req, res) => {
  try {
    const {email, password, passwordVerify} = req.body;

    // Validation
    if (!email || !password || !passwordVerify) {
      return res
        .status (400) // Bad Request
        .json ({errorMessage: 'Please complete all fields'}); // Incomplete form
    } else if (password.length < 6) {
      return res.status (400).json ({
        errorMessage: 'Please enter a password of at least 6 characters',
      }); // Bad Request
    } else if (password !== passwordVerify) {
      return res
        .status (400) // Bad Request
        .json ({errorMessage: 'Please enter the same password twice'}); // Mismatched Passwords
    }

    // Check if at least one other user has the same email in database
    const existingUser = await User.findOne ({email});
    if (existingUser) {
      return res
        .status (400) // Bad Request
        .json ({errorMessage: 'Account with this email already exists'}); // Existing user with email found
    }

    // Hash the passwords
    const salt = await bcrypt.genSalt (10);
    const passwordHash = await bcrypt.hash (password, salt);

    // Create new user using user model with the data
    const newUser = new User ({
      email,
      passwordHash,
    });

    // Save new user account to DB
    const savedUser = await newUser.save ();

    // Sign JWT token
    const token = jwt.sign (
      {
        user: savedUser._id,
      },
      process.env.JWTSECRET
    );

    // Send token in HTTP-only cookie
    res
      .cookie ('token', token, {
        httpOnly: true,
      })
      .send ();
  } catch (err) {
    console.error (err);
    res.status (500).send (); // Server Error
  }
});


// Login User
router.post ('/login', async (req, res) => {
  try {
    const {email, password} = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status (400) // Bad Request
        .json ({errorMessage: 'Please complete all fields'}); // Incomplete Form
    }

    // Check that an account with supplied email exists on server
    const existingUser = await User.findOne ({email});

    // If no user found with that email
    if (!existingUser) {
      return res
        .status (401) // Unauthorised
        .json ({errorMessage: 'Wrong email or password'}); // Wrong email entered
    } else {
      const passwordCorrect = await bcrypt.compare (
        password,
        existingUser.passwordHash
      );

      // If incorrect password entered
      if (!passwordCorrect) {
        return res
          .status (401) // Unauthorised
          .json ({errorMessage: 'Wrong email or password'}); // Wrong password entered
      }

      // Sign JWT token
      const token = jwt.sign (
        {
          user: existingUser._id,
        },
        process.env.JWTSECRET
      );

      // Send token in HTTP-only cookie
      res
        .cookie ('token', token, {
          httpOnly: true,
        })
        .send ();
    }
  } catch (err) {
    console.error (err);
    res.status (500).send (); // Server Error
  }
});


// Logout user (Clear Cookie by setting date to the past)
router.get('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    }).send();
})


module.exports = router;
