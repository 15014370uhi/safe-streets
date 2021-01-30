const router = require ('express').Router ();
const User = require ('../models/userModel');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const {loginValidation, registerValidation} = require ('../util/validation'); // Form validation

// Register new user
router.post ('/', async (req, res) => {
  try {
    const {email, password, passwordVerify} = req.body;

    if (password !== passwordVerify) {
      return res
        .status (400) // Bad Request
        .json ({errorMessage: 'Please enter the same password twice'}); // Mismatched Passwords
    }

    // Validate form data using validation function
    const {error} = registerValidation (req.body);

    // If error during validation, display error type
    if (error) {
      return res.status (400).send (error.details[0].message);
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

    // Sign in new registered user with JWT token
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

    // Validate form data using validation function
    const {error} = loginValidation (req.body);

    // If error during validation, display error type
    if (error) {
      return res.status (400).send (error.details[0].message);
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
      const token = jwt.sign ({user: existingUser._id}, process.env.JWTSECRET);

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

// Logout user (Clear cookie by setting expiry date to the far past)
router.get ('/logout', (req, res) => {
  res
    .cookie ('token', '', {
      httpOnly: true,
      expires: new Date (0),
    })
    .send ();
});

// Add to favourites array
router.put ('/favourites', async (req, res) => {
  const {mapURL, title} = req.body;

  // Validation
  if (!mapURL || !title) {
    return res
      .status (400) // Bad Request
      .json ({errorMessage: 'mapURL or title missing'}); // Incomplete Form
  } else {
    // Get user ID from cookie
    const rawCookie = req.header ('cookie').split ('=');
    const token = rawCookie[1];
    let payload; // Declare variable to hold payload

    // if cookie not set, return unauthorized error
    if (!rawCookie) {
      console.log ('No token found');
      return res.status (401).end ();
    } else {
      try {
        payload = jwt.verify (token, process.env.JWTSECRET);
      } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
          //JWT unauthorized return 401 error
          return res.status (401).end ();
        }
        // Otherwise, return bad request error
        return res.status (400).end ();
      }
    }
    // Create favourite object with supplied data
    favouriteToAdd = {
      mapURL: mapURL,
      title: title,
    };

    // Add new favourite to user array of favourites
    await User.findOneAndUpdate (
      {_id: payload.user}, // User ID
      {
        $push: {favourites: favouriteToAdd}, // Push favourite object to database
      },
      {safe: true, upsert: true, new: true}
    )
      .then (doc => {
        if (!doc) {
          return res.status (404).end (); // No docuement found
        }
        doc.save (); // Save document
        return res.status (200).json (doc.favourites); // Return updated favourites array
      })
      .catch (err => next (err));
  }
});

//TODO use cookie-parser module

// (Protected Route) Get favourites of logged in user
router.get ('/favourites/', async (req, res) => {
  // Check user is logged in before allowing protected route

  // Get user ID from cookie // TODO move to external function file
  const rawCookie = req.header ('cookie').split ('=');
  const token = rawCookie[1];
  let payload; // Declare variable to hold payload

  //if cookie not set, return unauthorized error
  if (!rawCookie) {
    console.log ('No token found');
    return res.status (401).end (); // Unauthorised
  } else {
    try {
      payload = jwt.verify (token, process.env.JWTSECRET);
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        //JWT unauthorized return 401 error
        return res.status (401).end (); // Unauthorised
      }
      // Otherwise, return bad request error
      return res.status (400).end (); // Bad request
    }
  }
});

// TODO check token protected route
// Delete a favourite entry by favourite ID
router.delete ('/favourites/:id', async (req, res) => {
  // Get user ID from cookie
  const rawCookie = req.header ('cookie').split ('=');
  const token = rawCookie[1];
  let payload; // Declare variable to hold payload

  // if cookie not set, return unauthorized error
  if (!rawCookie) {
    console.log ('No token found');
    return res.status (401).end (); // Unauthorised
  } else {
    try {
      payload = jwt.verify (token, process.env.JWTSECRET);
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        //JWT unauthorized return 401 error
        return res.status (401).end (); // Unauthorised
      }
      // Otherwise, return bad request error
      return res.status (400).end (); // Bad request
    }
  }
});

module.exports = router;
