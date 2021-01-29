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

    // Sign in new registered user

    // Sign JWT token
    const token = jwt.sign (
      {
        user: savedUser._id,
      },
      process.env.JWTSECRET
    );

    // Send token in HTTP-only cookie
    res.cookie ('token', token, {
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
  // After frontend is created
  const {mapURL, title} = req.body;
  console.log (
    'userRouter Received mapURL: ' + mapURL + ' Received title: ' + title
  );

  // Validation
  if (!mapURL || !title) {
    //TEST

    return res
      .status (400) // Bad Request
      .json ({errorMessage: 'mapURL or title missing'}); // Incomplete Form
  } else {
    //////////////TEST


    const rawCookie = req.header ('cookie').split('=');
    const token = rawCookie[1]
    
    // const rawCookie = req.header ('cookie');
    // const splitCookie = rawCookie.split('=');
    // const token = splitCookie[1];   

    console.log("rawCookie: " + rawCookie 
    + " token contains>>>>>>>>>>>>  " + token);
    
        // if the cookie is not set, return an unauthorized error
    if (!rawCookie) {
      console.log("No token found");
      return res.status (401).end ();
    } else {
      try {
        console.log("about to try verify");
        payload = jwt.verify (token, process.env.JWTSECRET);

        console.log (payload.user);
    res.send (`Welcome ${payload.user}!`);
      } catch (err) {
        console.log ('Some error with verify ' + err);
        if (err instanceof jwt.JsonWebTokenError) {
          //JWT unauthorized, return a 401 error
          return res.status (401).end ();
        }
        // otherwise, return a bad request error
        return res.status (400).end ();
      }
    }

   

    //   const user = await User.findOne ({_id: decoded._id});
    //   if (!user) {
    //     throw new Error ('No User found');
    //   }
    //   //console.log ('USer: ' + user);
    //   //next()
    // } catch (error) {
    //   res
    //     .status (401)
    //     .send (
    //       {error: 'Please authenticate line 162 try catch code....'} + error
    //     );
    // }
    /////////////////TEST

    favouriteToAdd = {
      mapURL: mapURL,
      title: title,
    };

    // find by document id and update
    User.updateOne (
      {_id: payload.user},
      {$push: {favourites: favouriteToAdd}},
      {safe: true, upsert: true},
      function (err, res) {
        if (err) {
          console.log ('ERROR: in updateOne line 173 ' + err);
        } else {
          console.log ('Sucessfully added Favourite');
          //console.log (res);
        }
      }
    );

    // // Retrieve current user favourites
    // // const currentUser = await User.findOne({ email: req.body.email });  // Replace with _id once know how to get form cookie
    // const currentUser = await User.findOne ({email: 'test@email.com'}); // Replace with _id once know how to get form cookie

    // if (currentUser) {
    //   return res.status (400).send (currentUser.favourites);
    // }
  }
});

module.exports = router;
