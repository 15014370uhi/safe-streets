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
 * @param {string} mapURL - URL for map image
 */
const Favourite = ({title, mapURL, deleteFavourite}) => {

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
        <Button variant="primary">Display Map</Button>
        <i className="far fa-trash-alt fa-lg" onClick={() => {deleteFavourite(title)}} />
      </Card.Body>
      <Card.Footer>
      <small className="text-muted">Added 3 days ago</small>
    </Card.Footer>
    </Card>
    </Col>
  );
};

export default Favourite;
