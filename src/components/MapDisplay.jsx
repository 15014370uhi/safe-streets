import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/col';
import Row from 'react-bootstrap/row';
import AddFavouriteModal from './AddFavouriteModal';
import ButtonAddToFavs from './ButtonAddToFavs';
import RemoveFavouriteModal from './RemoveFavouriteModal';
import ButtonRemoveFromFavs from './ButtonRemoveFromFavs';

//TODO need add favourites method passed as props maybe?
//TODO OR api call to add it to favourties - check how favourites page did it
// Functional component which displays the map image for a mapURL
const MapDisplay = (props) => {
	//state for modal screen
	const [modalShow, setModalShow] = useState(false);
	const [removeFavModalShow, setRemoveFavModalShow] = useState(false);
	let history = useHistory();

	useEffect(() => {
		window.scrollTo(0, 20);
	  }, [])

	return (
		<Col className="mt-4 pt-0 col-map-display">
			<AddFavouriteModal
				mapurl={history.location.state?.mapurl}
				show={modalShow}
				onHide={() => setModalShow(false)}
			/>

			<RemoveFavouriteModal
				title={history.location.state?.title}
				show={removeFavModalShow}
				onHide={() => setRemoveFavModalShow(false)}
			/>

			<Row className="row-map">
				<Button
					className="btn-back"
					variant="secondary"
					onClick={() => history.goBack()}>
					<i className="fa fa-arrow-left fa-lg mx-2" />
				</Button>

				{history.location.state?.isfavourite === 'true' ? (
					<ButtonRemoveFromFavs
						setRemoveFavModalShow={setRemoveFavModalShow}
					/>
				) : (
					<ButtonAddToFavs setModalShow={setModalShow} />
				)}

				<Image
					className="mapDisplay"
					src={history.location.state?.mapurl}
				/>
			</Row>
		</Col>
	);
};
export default MapDisplay;
