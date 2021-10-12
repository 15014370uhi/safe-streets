import React, {useState, useContext} from 'react';
import {MapDetails} from '../contexts/MapDetailsContext';
import {useHistory} from 'react-router-dom';
import Form from '../components/Form';
import Spinner from 'react-bootstrap/Spinner';
import {getMapURL} from '../util/GetMapURL';

// style components
import {MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardHeader} from 'mdbreact';

const Search = props => {
  const [submitText, setSubmitText] = useState ('Submit');
  const [radioButton, setRadioButton] = useState ('0');
  const [numberOfMonths, setNumberOfMonths] = useState (3);
  const [locationName, setLocationName] = useState ('');
  const [lat, setLat] = useState ('');
  const [lon, setLon] = useState ('');
  const [error, setError] = useState (null);
  const history = useHistory ();
  const [mapDetails, setMapDetails] = useContext (MapDetails);

  // function which updates the mapURL context
  const updateMapURL = (aFlaskdata, aMapURL, aLat, aLon, wasNameSearch) => {

    //console.log('updateMapURL received flaskdata: ' + aFlaskdata.data.Anti_social_behaviour);
    
    setMapDetails ({ 
      flaskdata: aFlaskdata.data,  //flaskdata: aFlaskdata, 
      mapURL: aMapURL,
      locationname: locationName,
      isnamesearch: wasNameSearch,
      lat: aLat,
      lon: aLon,
      numberofmonths: numberOfMonths,
      filters: [],
    });
  };

  // handler which records currently selected radio button
  const radioClickedHandler = radioSelected => {
    setRadioButton (radioSelected);
  };

  // handler which updates state with user form input
  const formInputHandler = e => {
    const {name, value} = e.currentTarget;
    // if locationName selected, set locationName
    if (name === 'locationName') {
      setLocationName (value);
    } else if (name === 'lat') {
      // if latitude input, set lat state
      setLat (value);
    } else if (name === 'lon') {
      // if longitude input, set lon state
      setLon (value);
    }
  };

  // dropdown handler for months
  const dropHandler = selectedNumberOfMonths => {
    if (selectedNumberOfMonths === 0) {
      selectedNumberOfMonths = 3;
    }
    setNumberOfMonths (selectedNumberOfMonths);
  };

  /**
	 * Function which checks if a latitude, longitude coordinate lies
	 * within the united kingdom boundary or not
	 * @param {Number} lat The latitude coordinate
	 * @param {Number} lon The longituded coordinate
	 *
	 * @returns {Boolean} isValidCoordinate Returns true if coordinate lies within UK
	 */
  const isWithinUK = (lat, lon) => {
    let isValidCoordinate = true;
    if (lat < 49.88 || lat > 60.86 || lon < -8.21 || lon > 1.77) {
      isValidCoordinate = false;
    }
    return isValidCoordinate;
  };

  // function which submits a search to API
  const submitForm = async e => {
    e.preventDefault ();

    // declare boolean flag to determine whether this is a name search or not
    let isANameSearch = radioButton === '0';

    // form validation
    if (!isANameSearch && (isNaN (lat) || isNaN (lon))) {
      setError ('Latitude and Longitude must be valid numbers');
      alert ('Latitude and Longitude must be number coordinates');
    } else {
      // variable boolean flag to determine whether lat and lon coordinates are wthin the UK
      let coordinatesWithinUK = isWithinUK (lat, lon);

      // if named location search selected, but form input was empty
      if (isANameSearch && locationName === '') {
        alert ('The location is empty, please enter a location!');
      } else if (!isANameSearch && (lat === '' || lon === '')) {
        // if lat and lon search, but lat or lon input boxes are empty
        alert ('Please add coordinates for both latitude and longitude!');
      } else if (!isANameSearch && (isNaN (lat) || isNaN (lon))) {
        // if lat and lon search, but either the lat or lon value is not a number
        alert ('Your latitude and longitude coordinates must be numbers only!');
      } else if (!isANameSearch && !coordinatesWithinUK) {
        // if lat and lon search, but coordinates are outside the bounds of UK
        alert (
          'Your latitude and longitude coordinates are outside of the UK!'
        );
      } else {
        // form input was validated, display loading icon
        setSubmitText (
          <div>
            <Spinner
              as="span"
              animation="border"
              role="status"
              aria-hidden="true"
              variant="dark"
            />
            <label className="submit-btn-text">
              LOADING CRIME DATA....
            </label>
          </div>
        );

        // data to pass to API
        const payload = {
          locationname: locationName,
          isnamesearch: isANameSearch,
          lat: lat,
          lon: lon,
          numberofmonths: numberOfMonths,
          filters: [],
        };

        // call funciton which calls API for user search
        const response = await getMapURL (payload);

        // check if no crimes were recorded for search criteria
        const noCrimesDetected = response.nocrimes;

        // check for invalid lat and lon response, due to mispelled/invalid location name
        let isValidLocation = isWithinUK (response.lat, response.lon);

        // if invalid search location
        if (!isValidLocation) {
          setSubmitText (<label className="submit-btn-text">Submit</label>);
          alert (
            'Location name is not recognised!, please check your spelling'
          );
        } else if (noCrimesDetected) {
          setSubmitText ('Submit');
          alert ('No crime data found for this search!');
        } else {
          const flaskData = response.flaskdata.data;

          //TODO switch to leaflet !!!!
          //TODO send data to function which creates crime history/presentation of data?
          //console.log ('flask response: ' + JSON.stringify (response.flaskdata.data));

          // const anti_social_behaviour = flaskData.Anti_social_behaviour;
          // const burglary = flaskData.Burglary;
          // const criminal_damage_and_arson = flaskData.Criminal_damage_and_arson;
          // const drugs = flaskData.Drugs;
          // const possession_of_weapons = flaskData.Possession_of_weapons;
          // const public_order = flaskData.Public_order;
          // const theft = flaskData.Theft;
          // const vehicle_crime = flaskData.Vehicle_crime;
          // const violent_crime = flaskData.Violent_crime;

          // //TODO instead of alert, present crime data as graphs etc
          // alert (
          //   'Predicted Crime Probabilities for this week: \n\n' +
          //     'Anti-Social = ' +
          //     parseFloat (anti_social_behaviour / 4).toFixed (2) +
          //     '%\n' +
          //     'Burglary = ' +
          //     parseFloat (burglary / 4).toFixed (2) +
          //     '%\n' +
          //     'Criminal Damage & Arson = ' +
          //     parseFloat (criminal_damage_and_arson / 4).toFixed (2) +
          //     '%\n' +
          //     'Drugs = ' +
          //     parseFloat (drugs / 4).toFixed (2) +
          //     '\n' +
          //     'Possession of Weapons = ' +
          //     parseFloat (possession_of_weapons / 4).toFixed (2) +
          //     '%\n' +
          //     'Public Order = ' +
          //     parseFloat (public_order / 4).toFixed (2) +
          //     '%\n' +
          //     'Theft = ' +
          //     parseFloat (theft / 4).toFixed (2) +
          //     '%\n' +
          //     'Vehicle Crime = ' +
          //     parseFloat (vehicle_crime / 4).toFixed (2) +
          //     '%\n' +
          //     'Violent Crime = ' +
          //     parseFloat (violent_crime / 4).toFixed (2) +
          //     '%\n'
          // );

          console.log(JSON.stringify(response.flaskdata)) //TODO TEST


          // set lat and lon values
          setLat (response.lat);
          setLon (response.lon);

          // pass mapurl to context
          updateMapURL (
            response.flaskdata, 
            response.mapurl,
            response.lat,
            response.lon,
            response.isnamesearch
          );
          history.push (`/results`);
        }
      }
    }
  };

  return (
    <div className="search-map-div">
      <MDBRow>
        <MDBCol size="12" sm="10" className="form-card">
          <MDBCard>
            <MDBCardBody>
              <MDBCardHeader className="form-header bg-primary rounded">
                <i className="fas fa-globe" />
                <label className="header-label">Search</label>
              </MDBCardHeader>
              <Form
                submitForm={submitForm}
                formInputHandler={formInputHandler}
                locationName={locationName}
                lat={lat}
                lon={lon}
                numberOfMonths={numberOfMonths}
                error={error}
                dropHandler={dropHandler}
                radioButton={radioButton}
                radioClickedHandler={radioClickedHandler}
                submitText={submitText}
              />
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </div>
  );
};

export default Search;
