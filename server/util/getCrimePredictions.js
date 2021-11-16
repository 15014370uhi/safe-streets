const axios = require ('axios');
const {getSector} = require ('../util/crime-data');

// function which calls the flask server to obtain crime predictions for current area
const getPredictions = async (policeForce, latitude, longitude) => {
  var predictions;
  var sector = getSector (policeForce); // get name of police sector for this location
  const today = new Date (); // get Date object
  const predictionYear = today.getFullYear (); // get current year
  const predictionMonth = today.getMonth () + 1; // get next month

  if (typeof sector !== 'undefined') {
    // call flask server API to get prediction data
    await axios
      .request ({
        method: 'POST',
        url: 'http://localhost:5000/predict',
        data: {
          month: predictionMonth, // the month to predict (current month + 1)
          year: predictionYear, // the year to predict
          lat: latitude, // the latitude of search location
          lon: longitude, // the longitude of search location
          sector: sector, // the name of police force sector
        },
      })
      .then (response => {
        const predictionData = response.data;
        predictions = {
          data: predictionData, // store returned prediction data
        };
        //(JSON.stringify(predictions));
      })
      .catch (error => {
        console.log ('Error getting response from flask server: ' + error);
      });
  }
  return predictions;
};

module.exports = {getPredictions};
