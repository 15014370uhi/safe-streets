const router = require ('express').Router ();


//TODO maybe move to routes file instead 

router.post ('/', async (req, res) => {
  

  const isNameSearch = req.body.isnamesearch;
  var mapURL = '';

  // TEST 
  mapURL = 'http://www.mapquestapi.com/staticmap/v5/map?key=HaI8dvLBtirhMstWmwrcbkRmltyyHAT2&locations=England&size=@2x';


  if(isNameSearch){
    // Named location search
    //TODO convert named location to lat long etc
    // TODO call function to get map URL
  } else {
    // LAT LON search
     // TODO call function to get map URL
  }

  const namedLocation = req.body.namedlocation;
  const lat = req.body.lat;
  const lon = req.body.lon;
  const numberOfMonths = req.body.numberofmonths;
  
    //console.log("Server received location: " + namedLocation);

  res.send ({
    namedlocation: namedLocation,
    isnamesearch: isNameSearch,
    lat: lat,
    lon: lon,    
    mapurl: mapURL,
    numberofmonths: numberOfMonths,
  });
});

// //router.route ('/map').get ((req, res) => {
// router.get ('/map/:title', async (req, res, next) => {
//       console.log("route /map triggered");
//       console.log ('req.body.title holds: ', req.body.title);
//   try {
//     const title = req.body.title;
//     //console.log(test);

module.exports = router;
