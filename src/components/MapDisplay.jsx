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
import FiltersModal from './FiltersModal';
import ButtonFilter from './ButtonFilter';
import ButtonBack from './ButtonBack';

//TODO need add favourites method passed as props maybe?
//TODO OR api call to add it to favourties - check how favourites page did it
// Functional component which displays the map image for a mapURL
const MapDisplay = (props) => {
	//state for modal screen
	const [showAddFavouriteModal, setShowAddFavouriteModal] = useState(false);
	const [showRemoveFavouritesModal, setShowRemoveFavouritesModal] =
		useState(false);
	const [showFiltersModal, setShowFiltersModal] = useState(false);
	let history = useHistory();

	useEffect(() => {
		window.scrollTo(0, 20);
	}, []);

	const openFilter = (e) => {
		//TODO filter icons on map
	};

	//TODO - add filters button icon and filters
	//TODO - move back button to component file for re-use
	//TODO once a map display has been favourited using the add to fav button, button should be
	//TODO change to remove from favourites button

	return (
		<Col className="mt-4 pt-0 col-map-display">
			<AddFavouriteModal
				mapurl={history.location.state?.mapurl}
				show={showAddFavouriteModal}
				onHide={() => setShowAddFavouriteModal(false)}
			/>

			<RemoveFavouriteModal
				title={history.location.state?.title}
				show={showRemoveFavouritesModal}
				onHide={() => setShowRemoveFavouritesModal(false)}
			/>

			<FiltersModal
				show={showFiltersModal}
				onHide={() => setShowFiltersModal(false)}
			/>

			<Row className="row-map">
				<ButtonBack />

				<ButtonFilter
					openFilter={openFilter}
					setModalShow={setShowFiltersModal}
				/>

				{history.location.state?.isfavourite === 'true' ? (
					<ButtonRemoveFromFavs
						setModalShow={setShowRemoveFavouritesModal}
					/>
				) : (
					<ButtonAddToFavs setModalShow={setShowAddFavouriteModal} />
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
