import React, {useState, useContext} from 'react';
import {MapDetails} from '.././contexts/MapDetailsContext';
import {useHistory} from 'react-router-dom';
import Form from './Form';
import Spinner from 'react-bootstrap/Spinner';
import {getMapURL} from './../util/GetMapURL';

// Style components
import {MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardHeader} from 'mdbreact';

const Search = props => {
  const [submitText, setSubmitText] = useState ('Submit');
  const [radioButton, setRadioButton] = useState ('0');
  const [numberOfMonths, setNumberOfMonths] = useState (3);
  const [locationName, setLocationName] = useState ('');
  const [isNameSearch, setIsNameSearch] = useState ('0');
  const [lat, setLat] = useState ('');
  const [lon, setLon] = useState ('');
  const [error, setError] = useState (null);
  const history = useHistory ();
  const [mapDetails, setMapDetails] = useContext (MapDetails);

  //function which updates the mapURL context
  const updateMapURL = (aMapURL, aLat, aLon, wasNameSearch) => {
    setMapDetails ({
      mapURL: aMapURL,
      locationname: locationName,
      isnamesearch: wasNameSearch,
      lat: aLat,
      lon: aLon,
      numberofmonths: numberOfMonths,
      filters: [],
    });
  };

  //handler which records currently selected radio button
  const radioClickedHandler = radioSelected => {
    setRadioButton (radioSelected);
	console.log("Radio button clicked: " + radioSelected);
  };

  //handler which updates state with user form input
  const formInputHandler = e => {
    const {name, value} = e.currentTarget;
    //if locationName selected, set locationName
    if (name === 'locationName') {
      setLocationName (value);
    } else if (name === 'lat') {     
      //if latitude input, set lat state
      setLat (value); //TODO COULD BE ISSUE HERE
    } else if (name === 'lon') {
      //if longitude input, set lon state
      setLon (value);
    }
  };

  //dropdown handler for months
  const dropHandler = selectedNumberOfMonths => {
    if (selectedNumberOfMonths === 0) {
      selectedNumberOfMonths = 3;
    }
    setNumberOfMonths (selectedNumberOfMonths);
  };

  /**
	 * Function to check that a set of latitude and longitude coordinates lie
	 * within the united kingdom boundary
	 * @param {Number} lat The latitude coordinate
	 * @param {Number} lon The longituded coordinate
	 *
	 * @returns {Boolean} isValidCoordinate Returns true if coordinate lies within UK territory
	 */
  const isWithinUK = (lat, lon) => {
    let isValidCoordinate = true;
    if (lat < 49.88 || lat > 60.86 || lon < -8.21 || lon > 1.77) {
      isValidCoordinate = false;
    }
    return isValidCoordinate;
  };




  //function which submits search to API
  const submitForm = async e => {
    e.preventDefault ();

    //declare const boolean flag to determine whether this is a name search or not
    setIsNameSearch (radioButton === '0');
    let isANameSearch = radioButton === '0'; //TODO TEST only use one version

	//Form validation
    //TODO check lat and lon are NAAN
    if (!isANameSearch && (isNaN (lat) || isNaN (lon))) {
      setError ('Latitude and Longitude must be valid numbers');
	  alert('Latitude and Longitude must be number coordinates')
    } else {
      //variable boolean flag to determine whether lat and lon coordinates are wthin the UK
      let coordinatesWithinUK = isWithinUK (lat, lon);

      //if named location search, but form location search input is empty
      if (isANameSearch && locationName === '') {
        alert ('The location is empty, please enter a location!');
        console.log (
          'named location search, but form location search input is empty'
        );
      } else if (!isANameSearch && (lat === '' || lon === '')) {
        //if lat and lon search, but lat or lon input boxes are empty
        alert ('Please add coordinates for both latitude and longitude!');
        console.log (
          'lat and lon search, but lat or lon input boxes are empty'
        );
      } else if (!isANameSearch && (isNaN (lat) || isNaN (lon))) {
        //if lat and lon search, but either the lat or lon value is not a number
        alert ('Your latitude and longitude coordinates must be numbers only!');
        console.log (
          'lat and lon search, but lat or lon value -- not a number ' +
            !isANameSearch &&
            (isNaN (lat) || isNaN (lon))
        );
      } else if (!isANameSearch && !coordinatesWithinUK) {
        //if lat and lon search, but coordinates are outside the bounds of UK
        alert (
          'Your latitude and longitude coordinates are outside of the UK!'
        );     
	
      } else {
		  console.log("ELSE has fired - all should be ok");
        //form input was validated
        setSubmitText (
          <div>
            <Spinner
              as="span"
              animation="border"
              role="status"
              aria-hidden="true"
              variant="dark"
            />
            {' '}
            LOADING CRIME DATA....{' '}
          </div>
        );

        //data to pass to API
        const payload = {
          locationname: locationName,
          isnamesearch: isANameSearch,
          lat: lat,
          lon: lon,
          numberofmonths: numberOfMonths,
          filters: [],
        };

        console.log (
          'SENDING PAYLOAD: ' +
            '\nlocationName: ' +
            locationName +
            '\nisANameSearch: ' +
            isANameSearch +
            '\nlat: ' +
            lat +
            '\nlon: ' +
            lon +
            '\nnumberofmonths: ' +
            numberOfMonths
        );

        //call API function
        const response = await getMapURL (payload);

        //check for invalid lat and lon response, due to mispelled/invalid location name
        let isValidLocation = isWithinUK (response.lat, response.lon);

        //invalid search location
        if (!isValidLocation) {
          setSubmitText ('Submit');
          alert (
            'Location name is not recognised!, please check your spelling'
          );
        } else {
          //set lat and lon values
          setLat (response.lat);
          setLon (response.lon);

          console.log (
            'RESPONSE LAT AND LON and isnameSearch: ' +
              response.lat +
              '\n' +
              response.lon +
              '\n' +
              response.isnamesearch
          );

          //pass mapurl to context
          updateMapURL (
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
