import React, {useState} from 'react';
//import {UserContext} from '../auth/UserProvider';
//import firebase from 'firebase';
import axios from 'axios';
//import Image from 'react-bootstrap/Image';
//import Dropdown from 'react-bootstrap/Dropdown';
//import DropdownButton from 'react-bootstrap/DropdownButton';
//import {useHistory} from 'react-router-dom';
//import {Route, Redirect} from 'react-router-dom';
import MapDisplay from './MapDisplay';
import Form from './Form';

//import uuid from 'react-uuid';
import Container from 'react-bootstrap/Container';

// Style components
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBCardHeader,
} from 'mdbreact';


//TODO might need to add to history somewhere here - so I can return to this page after the
//Todo viewing search reuslts map
const Search = () => {
  //const user = useContext(UserContext); // Get User Context
  //const [responseData, setResponseData] = useState({});
  const [message, setMessage] = useState ('');
  const [mapURL, setMapURL] = useState ('');

  //TEST STate for image popup test
  //const [show, setShow] = useState(false);
  const [imageOpen, setImageOpen] = useState (false);
  //const []target = useRef(null);

  // User input search parameters
  const [radioButton, setRadioButton] = useState ('0'); // Radio button
  const [numberOfMonths, setNumberOfMonths] = useState (3);
  const [locationName, setLocationName] = useState ('');
  const [lat, setLat] = useState ('');
  const [lon, setLon] = useState ('');

  const [displayMap, setDisplayMap] = useState (false);

  // Errors
  const [error, setError] = useState (null);

  //TODO TUES - reset displaymap state so that clicking on search - hides it again aFTER MAP IS SHOWN

  //const history = useHistory();

  // TODO maybe push to map display page - or user a check mapResponse? ():() type of thing

  // TODO show search form but have it minimise? or hide or something - or tab thing but
  // TODO jump tot he new tab
  // TODO Loading animation for map load -needs improvements for map loading

  //TEST Image popup for uk map
  const handleShowImage = e => {
    e.preventDefault ();
    setImageOpen (!imageOpen);
  };

  // Handler which records currently selected radio button
  const radioClickedHandler = radioSelected => {
    //  TODO radio button not selecting properly

    setRadioButton (radioSelected);
    console.log ('Radio button section clicked was: ' + radioSelected);
  };

  // Handler which updates state with user form input
  const formInputHandler = e => {
    const {name, value} = e.currentTarget;

    // TODO check types of input are correct etc. and set error if wrong
    //setError(error);

    //isNaN(123)

    // If namedLocation selected, set namedLocation
    if (name === 'namedLocation') {
      setLocationName (value);
    } else if (name === 'lat') {
      //check that lat is a number
      if (!isNaN (value)) {
        setError ('Latitude and Longitude must be numbers');
      }

      //TODO alert warning and don't submit

      // If latitude input, set lat state
      setLat (value);
    } else if (name === 'lon') {
      //check that lon is a number
      if (!isNaN (value)) {
        setError ('Latitude and Longitude must be numbers');
      }

      // If longitude input, set lon state
      setLon (value);
    }
  };

  // Dropdown handler
  const dropHandler = selectedNumberOfMonths => {
    if (selectedNumberOfMonths === 0) {
      selectedNumberOfMonths = 3;
    }
    setNumberOfMonths (selectedNumberOfMonths);
  };

  // TODO CSS for dropdown hover values

  // Function which resets the state values
  const resetState = () => {
    // API call successful, reset state
    setLocationName ('');
    setLat ('');
    setLon ('');
    setRadioButton ('0');
    setNumberOfMonths (3);
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

    //TODO create image with lat and lon bounding box as user assist
    if (lat < 49.88 || lat > 60.86 || lon < -8.21 || lon > 1.77) {
      isValidCoordinate = false;
    }
    return isValidCoordinate;
  };

  // Function which submits search to API
  const submitForm = async e => {
    e.preventDefault ();

    //declare const boolean flag to determine whether this is a name search or not
    const isNameSearch = radioButton === '0';

    //variable boolean flag to determine whether lat and lon coordinates are wthin the UK
    let coordinatesWithinUK = isWithinUK (lat, lon);

    //TODO block API call if any inputs are invalid

    // Form validation

    // If named location search was selected, but form input is empty
    if (isNameSearch && locationName === '') {
      alert ('The location is empty, please enter a location!');

      //if lat and lon search but lat and lon input is empty
    } else if (!isNameSearch && (lat === '' || lon === '')) {
      alert ('Please add coordinates for latitude and longitude!');
    } else if (!isNameSearch && (isNaN (lat) || isNaN (lon))) {
      //if lat and lon search but the lat or lon value is not a number
      alert ('Your latitude and longitude coordinates must be numbers only!');
    } else if (!isNameSearch && !coordinatesWithinUK) {
      //if lat and lon search but user coordinates are outside the bounds of the UK
      alert ('Your latitude and longitude coordinates are outside of the UK!');
    } else {
      //form input was validated
      setMessage ('Loading...'); // TODO change to spinner

      //TODO Only pass data that's correct?? if you can check other side for empty stuff

      // Data passed to API
      const payload = {
        namedlocation: locationName,
        isnamesearch: isNameSearch,
        lat: lat,
        lon: lon,
        numberofmonths: numberOfMonths,
      };

      // TODO get the lat and long response and show on map screen as useful data?>
      // TODO maybe have a special area for information about the map at side?

      // API call for a new search
      await axios
        .post ('http://localhost:5000/api/map', payload)
        .then (res => {
          // TEST response
          const isNamedSearch = res.data.isnamesearch;
          const namedlocation = res.data.namedlocation;
          const latitude = res.data.lat;
          const longitude = res.data.lon;
          const numberOfMonths = res.data.numberofmonths;
          const mapurl = res.data.mapurl;
          const boundingbox = res.data.boundingbox;

          //check for invalid lat and lon response, due to mispelled/invalid location name
          let isValidLocation = isWithinUK (latitude, longitude);

          //invalid search location
          if (!isValidLocation) {
            alert (
              'Location name is not recognised!, please check your spelling'
            );

            //valid search
          } else {
            // Set mapURL state
            setMapURL (res.data.mapurl);
            setDisplayMap (true);
          }

          // TEST
          setMessage (
            'Name search?: ' +
            isNamedSearch +
            '\n' +
            'Location Name: ' +
            namedlocation +
            '\n' +
            'Latitude: ' +
            latitude +
            '\n' +
            'Longitude: ' +
            longitude +
            '\n' +
            'Months: ' +
            numberOfMonths +
            '\n' +
            'MapURL: ' + //TODO get proper mapurl rather than this test one of all uk
            mapurl +
            '\n' +
            '\n' +
            'Bounding Box: ' + //TODO get proper mapurl rather than this test one of all uk
              boundingbox
          );

          // Reset state values
          resetState ();
        })
        .catch (error => {
          console.log ('error in search getting response: ', error);
          setError (error);
        });
    }
  };

  // TODO maybe redirect to some map dispay component - OR - REPLACE form with map>?
  // TODO Or copy what i did with other assignment and use tabs
  return (
    <div className="search-map-div">
      {displayMap
        ? <div>
            <MapDisplay mapURL={mapURL} setDisplayMap={setDisplayMap} />
          </div>
        : <MDBRow>
            <MDBCol size="12" sm="10" className="form-card">
              <MDBCard>
                <MDBCardBody>
                  <MDBCardHeader className="form-header bg-primary rounded">
                    <i className="fas fa-globe" />
                    <label className="header-label">
                      Search
                    </label>

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
                    handleShowImage={handleShowImage}
                    imageOpen={imageOpen}
                  />
                  <br />
                  <p>{message}</p>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>}
    </div>
  );
};

export default Search;
