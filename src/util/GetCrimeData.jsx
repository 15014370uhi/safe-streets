import axios from 'axios';

//TODO split API calls into 3 calls - crime/historic/predictions

// function which completes an API call
export const getCrimeData = async payload => {
  return new Promise (resolve => {
    axios
      .post ('http://localhost:4000/api/map', payload)
      .then (res => {
        const response = {
          predictions: res.data.predictions,
          historicCrimes: res.data.historicCrimes,
          locationName: res.data.locationName,
          lat: res.data.lat,
          lon: res.data.lon,
          noCrimes: res.data.noCrimes,
          policeForce: res.data.policeForce,
          allCrimes: res.data.allCrimes,
        };
        resolve (response);
      })
      .catch (error => {
        console.log ('error in obtaining node API response: ');
      });
  });
};

// function which completes an API call
export const getPredictions = async payload => {
  return new Promise (resolve => {
    axios
      .post ('http://localhost:4000/api/map/predictions', payload)
      .then (res => {
        const response = {
          predictions: res.data.predictions,
        };
        resolve (response);
      })
      .catch (error => {
        console.log ('error in obtaining prediction results from API: ');
      });
  });
};

// function which completes an API call
export const getHistoricCrimes = async payload => { 
  return new Promise (resolve => {
    axios
      .post ('http://localhost:4000/api/map/historic', payload)
      .then (res => {
        const response = {
          historicCrimes: res.data.historicCrimes,
        };
        resolve (response);
      })
      .catch (error => {
        console.log ('error in obtaining historic crimes from API: ');
      });
  });
};
