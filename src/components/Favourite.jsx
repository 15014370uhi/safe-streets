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
 * @param {string} mapURL - URL of map image
 * @param {string} timestamp - Date the favourite was created
 * @param {string} deleteFavourite - Reference to function which deletes the favourite from the user's favourites
 */
const Favourite = ({title, mapURL, timestamp, deleteFavourite}) => {
  
  const displayMap = e => {
    // TODO redirect to display map - passing map url? from selected favourite

    // TODO will need history and props passed 
  }

  return (
    <Col className="container-fluid mt-4">
    <Card key={uuid ()}  border="info" style={{width: '20rem'}}>
     <Card.Img variant="top" src={map_placeholder}/>
      <Card.Header>{title}</Card.Header>
      <Card.Body bg="light" >     
        <Card.Text>
          {mapURL} Later change this to a description by user.
          .. And include the image shrunk?
        </Card.Text>
        <Button onClick={displayMap}variant="primary">Display Map</Button>
        <i className="far fa-trash-alt fa-lg" onClick={() => {deleteFavourite(title)}} />
      </Card.Body>
      <Card.Footer>
      <small className="text-muted">    
     Date created: 
    <h6>{timestamp}</h6>
      </small>
    </Card.Footer>
    </Card>
    </Col>
  );
};

export default Favourite;
