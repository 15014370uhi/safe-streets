import React from 'react';
import Button from 'react-bootstrap/Button';
import uuid from 'react-uuid';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/col';
import map_placeholder from '../images/map_placeholder.jpg';

/**
 * A favourite for a user
 * 
 * @param {string} title - Title for this favourite  
 * @param {string} description - Description for this favourite  
 * @param {string} mapURL - URL of map image
 * @param {string} timestamp - Date the favourite was created
 * @param {string} deleteFavourite - Reference to function which deletes the favourite from the user's favourites
 */
const Favourite = ({title, description, mapURL, timestamp, deleteFavourite, displayFavouriteMap}) => {
  
  const displayMap = e => {
    // TODO redirect to display map - passing map url? from selected favourite
    // maybe call it saving a search - load it to search page
    // TODO will need history and props passed 

    //TODO shrink mapURL image to view like a preview - maybe even 
    //TODO retrieve a smaller version of the map and use it as a preview
    displayFavouriteMap(mapURL);
    //<MapDisplay mapURL={mapURL} setDisplayMap={setDisplayMap} />
  }

  return (
    <Col className="container-fluid mt-4">
    <Card key={uuid ()}  border="info" style={{width: '20rem'}}>
     <Card.Img variant="top" src={mapURL} onClick={() => {displayMap()}}/>
      <Card.Header>{title}</Card.Header>
      <Card.Body bg="light" >     
        <Card.Text>
          {description}
        </Card.Text>
        <Button onClick={displayMap} variant="primary">Display Map</Button>
        <i className="far fa-trash-alt fa-lg" onClick={() => {deleteFavourite(title)}} />
      </Card.Body>
      <Card.Footer>
      <small className="text-muted">    
     Date created: 
    <h5>{timestamp}</h5>
      </small>
    </Card.Footer>
    </Card>
    </Col>
  );
};

export default Favourite;
