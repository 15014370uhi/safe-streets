import React from 'react';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/col';
import Row from 'react-bootstrap/row';


//TODO need add favourites method passed as props maybe?
//TODO OR api call to add it to favourties - check how favourites page did it
// Functional component which displays the map image for a mapURL
const MapDisplay = ({mapURL, setDisplayMap}) => {
  const addFavourite = () => {

	//TOD display dialogue to enter a note about the map
    //TODO add favourite to favourites functionality
    console.log ('Add favourites button clicked');
  };

  return (
    <Col className="mt-4 pt-0 col-map-display">
      <Row className="container-fluid">
        <Col>
          <i
            className="fa fa-arrow-left fa-5x mx-2"
            aria-hidden="true"
            onClick={() => {
              setDisplayMap (false);
            }}
          />
        </Col>
        <Col>
          <Button
            className="w-full py-3 bg-blue-500 btn-favourites"
            onClick={() => {
              addFavourite ();
            }}
          >
             <i
            className="fa fa-plus fa-lg mx-2"
            aria-hidden="true"            
          />
		  Add To Favourites
          </Button>
        </Col>
      </Row>
      <Row className="row-map">
        <Image className="mapDisplay" src={mapURL} />
      </Row>
    </Col>
  );
};
export default MapDisplay;
