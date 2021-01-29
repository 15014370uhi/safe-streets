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
        password, existingUser.passwordHash
      );
      // If incorrect password entered
      if (!passwordCorrect) {
        return res
          .status (401) // Unauthorised
          .json ({errorMessage: 'Wrong email or password'}); // Wrong password entered
      }

      // Sign JWT token
      const token = jwt.sign (
        {user: existingUser._id},
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
      title: title
    };

    // Push new favourite to user's array of favourites
    User.updateOne (
      {_id: payload.user},
      {$push: {favourites: favouriteToAdd}},
      {safe: true, upsert: true},
      function (err, res) {
        if (err) {
          console.log ('ERROR: in updateOne line 173 ' + err);
        } else {
          console.log ('Sucessfully added Favourite');
        }        
      }      
    );

    // Retrieve updated list of user favourites
    const currentUser = await User.findById ({_id: payload.user}); // Replace with _id once know how to get form cookie
    if (!currentUser) {
      console.log("No user found with supplied ID");
    } else {
     // console.log(currentUser.favourites);
     res.json (currentUser.favourites); // Return favourites to client side
    }
  }
});

// // Delete a favourite entry by favourite ID
// router.delete ('/favourites/:id', async (req, res) => {
//   //TODO check if logged in - check user exists - (ID will be got from user clicking on list
//   //TODO of favourites - which will know the ID, pass the favourite id back here and then delete
//   //TODO one by id?..)
//   // Find item by id from parameters
//   await Item.deleteById(req.params.id)
//   res.json (items));
// });


module.exports = router;
