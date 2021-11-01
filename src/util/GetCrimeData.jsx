import axios from 'axios';

// new search
export const getCrimeData = async payload => {
  console.log('calling API with payload: ' + JSON.stringify(payload));
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



// // function which applies crime icon filtering to a previously made search
// export const getUpdatedMapURL = async aPayload => {
//   let payload = {
//     locationname: aPayload.locationname,
//     isnamesearch: aPayload.isnamesearch,
//     lat: aPayload.lat,
//     lon: aPayload.lon,
//     numberofmonths: aPayload.numberofmonths,
//     filters: aPayload.filters,
//   };
//   const response = await getAPIResponse (payload);    
//   return response; 
// };

