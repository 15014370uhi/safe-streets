import React from 'react';
import Button from 'react-bootstrap/Button';
import uuid from 'react-uuid';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/col';

/**
 * A favourite for a user
 *
 * @param {string} title - Title for this favourite
 * @param {string} mapurl - URL of map image
 * @param {string} timestamp - Date the favourite was created
 * @param {string} deleteFavourite - Reference to function which deletes the favourite from the user's favourites
 */
const Favourite = ({
	title,
	mapurl,
	timestamp,
	deleteFavourite,
	displayMap, 
}) => {

	return (
		<Col className="container-fluid mt-4">		
			<Card key={uuid()} border="info" style={{width: '20rem'}}>
				<Card.Img
					variant="top"
					src={mapurl}
					onClick={() => {
						displayMap(mapurl);
					}}
				/>
				<Card.Header>{title}</Card.Header>
				<Card.Body bg="light">
					<Button onClick={() => {
						displayMap(mapurl);
					}} variant="primary">
						Display Map
					</Button>
					<i
						className="far fa-trash-alt fa-lg"
						onClick={() => {
							deleteFavourite(mapurl);
						}}
					/>{' '}
					by url
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
