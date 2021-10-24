import React, {useState, useContext} from 'react';
import {MapDetails} from '../contexts/MapDetailsContext';
import {ResultsData} from '../contexts/ResultsDataContext';
import {Crimes} from '../contexts/CrimeDataContext';
import {useHistory} from 'react-router-dom';
import {CenterPoint} from '../contexts/CenterPointContext';

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
  const [resultsData, setResultsData] = useContext (ResultsData);
  const [crimeData, setCrimeData] = useContext (Crimes);
  const [centerPoint, setCenterPoint] = useContext (CenterPoint);


  // function which updates the mapURL context
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

        // call function which calls API for user search
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
        } else {          
          // no crimes found + manchester search
          if (
            noCrimesDetected &&
            response.policeforce === 'greater-manchester'
          ) {
            setSubmitText ('Submit');
            alert (
              'Please note that Greater Manchester crime data is currently restricted due to an ongoing investigation into missing police data.'
            );
            setResultsData ({
              flaskdata: response.flaskdata.data,
              historicdata: response.data,
            });
          } else if (noCrimesDetected) {
            // no crimes found & is not a manchester search
            setSubmitText ('Submit');
            alert ('No crime data found for this search!');
          } else {
            // Crimes found & location is valid
            if (response.policeforce === 'greater-manchester') {
              alert (
                'Please note: Greater Manchester crime data is currently restricted due to an ongoing investigation into missing police crime data.'
              );
            }

            // set lat and lon values
            setLat (response.lat);
            setLon (response.lon);

            // pass response data to function
            updateMapURL (
              response.mapurl,
              response.lat,
              response.lon,
              response.isnamesearch,
              response.displaycrimes
            );

            
            // pass historic and flask data to results data context
            setResultsData ({
              flaskdata: response.flaskdata.data,
              historicdata: response.data,
            }); //TODO can also add other data - just have 1 CONTEXT for everything???

            setCrimeData (response.displaycrimes);

            setCenterPoint([response.lat, response.lon]);

           
            //TODO TEST
            const returnedFlaskData = response.flaskdata.data;
            // console.log(returnedFlaskData);

            // //TODO TEST display of flask dataKey
            const anti_social_behaviour =
              returnedFlaskData.Anti_social_behaviour;
            const burglary = returnedFlaskData.Burglary;
            const criminal_damage_and_arson =
              returnedFlaskData.Criminal_damage_and_arson;
            const drugs = returnedFlaskData.Drugs;
            const possession_of_weapons =
              returnedFlaskData.Possession_of_weapons;
            const public_order = returnedFlaskData.Public_order;
            const theft = returnedFlaskData.Theft;
            const shoplifting = returnedFlaskData.Shoplifting;
            const vehicle_crime = returnedFlaskData.Vehicle_crime;
            const violent_crime = returnedFlaskData.Violent_crime;

            //TODO Convert to graphic data within modal for prediction and historic data
            alert (
              'Predicted Crime Probabilities for this month: \n' +
                'Anti-Social = ' +
                parseFloat (anti_social_behaviour).toFixed (2) +
                '%\n' +
                'Burglary = ' +
                parseFloat (burglary).toFixed (2) +
                '%\n' +
                'Criminal Damage & Arson = ' +
                parseFloat (criminal_damage_and_arson).toFixed (2) +
                '%\n' +
                'Drugs = ' +
                parseFloat (drugs).toFixed (2) +
                '%\n' +
                'Possession of Weapons = ' +
                parseFloat (possession_of_weapons).toFixed (2) +
                '%\n' +
                'Public Order = ' +
                parseFloat (public_order).toFixed (2) +
                '%\n' +
                'Theft = ' +
                parseFloat (theft).toFixed (2) +
                '%\n' +
                'Vehicle Crime = ' +
                parseFloat (vehicle_crime).toFixed (2) +
                '%\n' +
                'Violent Crime = ' +
                parseFloat (violent_crime).toFixed (2) +
                '%\n' +
                'Shoplifting = ' +
                parseFloat (shoplifting).toFixed (2) +
                '%\n'
            );

            history.push (`/results`);
          }
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
