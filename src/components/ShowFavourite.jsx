import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/col';
import Row from 'react-bootstrap/row';
import {useHistory} from 'react-router-dom';
import Image from 'react-bootstrap/Image';

/**
 * A favourite for a user
 *
 * @param {string} title - Title for this favourite
 * @param {string} mapurl - URL of map image
 * @param {string} timestamp - Date the favourite was created
 * @param {string} deleteFavourite - Reference to function which deletes the favourite from the user's favourites
 */
const ShowFavourite = ({
	title,
	mapurl,
	timestamp,
	deleteFavouriteByMapURL,
	displayFavouriteMap,
}) => {

    let history = useHistory ();

    const removeFavourite = e => {

    }
	
    return (
    <Col className="mt-4 pt-0 col-map-display">  
   
      <Col>      
        <Button variant="secondary" onClick={() => history.goBack ()}>
          <i className="fa fa-arrow-left fa-lg mx-2" />
          <label>
            <h2>BACK</h2>
          </label>
        </Button>
      </Col>
      

      <Button
        className="w-full py-3 bg-blue-500 btn-favourites"
        variant="primary"
        onClick={() => removeFavourite(mapurl)}
      >
        <i className="fa fa-plus fa-lg mx-4" aria-hidden="true" />
        Delete Favourite
      </Button>

      
      <Row className="row-map">
        <Image className="mapDisplay" src={history.location.state?.mapurl} />
      </Row>
    </Col>
  );
		
};

export default ShowFavourite;
