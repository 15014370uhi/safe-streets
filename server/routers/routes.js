// const router = require ('express').Router ();

// // /api/map
// // GET map url


// router.post('/map', async (req, res) => {
 
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

// module.exports = router;
