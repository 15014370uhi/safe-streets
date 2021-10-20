import axios from 'axios';

// new search
export const getMapURL = async payload => {
  let dataResponse = await getAPIResponse (payload);
  return dataResponse;
};

// function which applies crime icon filtering to a previously made search
export const getUpdatedMapURL = async aPayload => {
  let payload = {
    locationname: aPayload.locationname,
    isnamesearch: aPayload.isnamesearch,
    lat: aPayload.lat,
    lon: aPayload.lon,
    numberofmonths: aPayload.numberofmonths,
    filters: aPayload.filters,
  };

  const response = await getAPIResponse (payload);    
  return response; 
};

// function which completes an API call
const getAPIResponse = async payload => {
  return new Promise (resolve => {
    axios
      .post ('http://localhost:4000/api/map', payload)
      .then (res => {
        const response = {
          flaskdata: res.data.flaskdata,
          historicdata: res.data.historicdata,
          boundingbox: res.data.boundingbox,
          filters: res.data.filters,
          isnamesearch: res.data.isnamesearch,
          lat: res.data.lat,
          lon: res.data.lon,
          location: res.data.location,
          locationname: res.data.locationname,
          mapurl: res.data.mapurl,
          numberofmonths: res.data.numberofmonths,
          nocrimes: res.data.nocrimes,
        };		
        
        //TODO test 
        //console.log('HISTORIC DATA in getMapURL: >>>>>>>>>>>>>  ');
       //console.log(JSON.stringify(response.historicdata));

        resolve (response); 
      })
      .catch (error => {
        console.log ('error in obtaining API response: ', error.message);
      });
  });
};
