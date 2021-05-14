import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/col';
import Row from 'react-bootstrap/row';
import AddFavouriteModal from './AddFavouriteModal';

//TODO need add favourites method passed as props maybe?
//TODO OR api call to add it to favourties - check how favourites page did it
// Functional component which displays the map image for a mapURL
const MapDisplay = (props) => {

  //state for modal screen
  const [modalShow, setModalShow] = useState (false);
  let history = useHistory ();

  const showFavourites = async e => {
    let path = `/favourites`; //TODO get path of calling page maybe as prop
    history.push (path);
  };

  const testGoBack = async e => {
    history.goBack ();
  };

  return (
    <Col className="mt-4 pt-0 col-map-display">
     
	  mapURL: {history.location.state?.mapurl}
      <Col>
        <Button variant="secondary" onClick={() => test ()}>
          <i className="fa fa-arrow-left fa-lg mx-2" />
          <label>
            <h2>get URL</h2>
          </label>
        </Button>

        <Button variant="secondary" onClick={() => history.goBack ()}>
          <i className="fa fa-arrow-left fa-lg mx-2" />
          <label>
            <h2>Go BACK</h2>
          </label>
        </Button>
      </Col>
      <Col>
        <Button
          variant="purple"
          onClick={() => {
            showFavourites ();
          }}
        >
          <i className="fa fa-arrow-left fa-lg mx-2" />
          <label>
            <h2>View Favourites</h2>
          </label>
        </Button>
      </Col>

      <Button
        className="w-full py-3 bg-blue-500 btn-favourites"
        variant="primary"
        onClick={() => setModalShow (true)}
      >
        <i className="fa fa-plus fa-lg mx-4" aria-hidden="true" />
        Add To Favourites
      </Button>

      <AddFavouriteModal
        mapurl={history.location.state?.mapurl}
        show={modalShow}
        onHide={() => setModalShow (false)}
      />

      <Row className="row-map">
        <Image className="mapDisplay" src={history.location.state?.mapurl} />
      </Row>
    </Col>
  );
};
export default MapDisplay;
