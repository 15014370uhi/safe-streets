const router = require ('express').Router ();

router.post ('/', async (req, res) => {
  
  const searchLocation = req.body.lon.searchlocation;
  const isNameSearch = req.body.lon.isnamesearch;
  const lat = req.body.lat;
  const lon = req.body.lon;
  const mapURL =
    'http://www.mapquestapi.com/staticmap/v5/map?key=HaI8dvLBtirhMstWmwrcbkRmltyyHAT2&locations=England&size=@2x';

  res.send ({
    lat: lat,
    lon: lon,
    searchlocation: searchLocation,
    isnamesearch: isNameSearch,
    mapurl: mapURL,
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
