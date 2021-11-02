import axios from 'axios';

// new search
export const getCrimeData = async payload => {
  let dataResponse = await getAPIResponse (payload);
  return dataResponse;
};

// function which completes an API call
const getAPIResponse = async payload => {
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
