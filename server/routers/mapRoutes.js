const router = require ('express').Router ();

router.post("/", async (req, res) => {
   // res.send(req.title);
   //const title = req.body.testData.title;
   const body = req.body.title;
   res.send({ receivedTitle: req.body.title });  
   // return res.status(201).json(title);
});


//   // chk if new user already in db
//   const emailExist = await User.findOne({ email: req.body.email });
//   if (emailExist) {
//     return res.status(400).send("Email already exists");
//   }

//   // create new user
//   const user = new User({
//     username: req.body.username,
//     email: req.body.email,
//     password: hashPassword
//   });

//   // save new user
//   try {
//     const savedUser = await user.save();
//     res.send({ user: user._id });
//   } catch (err) {
//     res, status(400).send(err);
//   }
// });


// router.post('/', async (req, res) => {
//     console.log("req.body: " + req.body);

//    console.log("req.body.title: " + req.body.title);
//   try {       
//     const testResponse = "Working API";
//     res.status(200).json(testResponse);
//   } catch (e) {
//     res.status(400).json({ msg: e.message });
//   }
// });

// //router.route ('/map').get ((req, res) => {
// router.get ('/map/:title', async (req, res, next) => {
//       console.log("route /map triggered");
//       console.log ('req.body.title holds: ', req.body.title);
//   try {
//     const title = req.body.title;
//     //console.log(test);
    
//     //
//     //TEST
//     const testResponse = {
//      mapURL: 'https://www.mapquestapi.com/staticmap/v5/map?key=HaI8dvLBtirhMstWmwrcbkRmltyyHAT2&locations=England&size=@2x',
//     };

//     if (!req.body.title) {
//       console.log ('title was missing');
//       return res.json ('No map url');
//     }
//     res.send (testResponse); // Return value
//   } catch (err) {
//     res.json (err);
//   }
// });

module.exports = router;
