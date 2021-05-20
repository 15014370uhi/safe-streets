import React from 'react';
import Button from 'react-bootstrap/Button';
import uuid from 'react-uuid';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/col';
import {useHistory} from 'react-router-dom';

//TODO see about adding mapdisplay to routes - then less messing around with checks on search page
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
	displayFavouriteMap, //TODO remove?
}) => {


	let history = useHistory ();


	//display map which was clicked on
	const displayMap = (aMapURL) => {
		history.push (`/results`, {
			mapurl: aMapURL,
			title: title,
			isfavourite: 'true' //boolean flag to determine if map a previously favourited map or new search result
		});   
		
		//TODO when viewing a favourite after clicking on it's map in favourites page - the user
		//TODO icon overlay should be a delete symbol with confirmation dialogue to delete the favourites
		//TODO instead of a plus symbol
		
	};


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
					<Button onClick={displayMap} variant="primary">
						Display Map
					</Button>
					<i
						className="far fa-trash-alt fa-lg"
						onClick={() => {
							deleteFavourite(title);
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
