import React, {useState, useEffect, useContext} from 'react';
import {MapURL} from '.././contexts/MapContext';
import {useHistory} from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/col';
import Row from 'react-bootstrap/row';
import AddFavouriteModal from './AddFavouriteModal';
import ButtonAddToFavs from './ButtonAddToFavs';
import RemoveFavouriteModal from './RemoveFavouriteModal';
import ButtonRemoveFromFavs from './ButtonRemoveFromFavs';
import FiltersModal from './FiltersModal';
import ButtonFilter from './ButtonFilter';
import ButtonBack from './ButtonBack';

// Functional component which displays the map image for a mapURL
const MapDisplay = (props) => {
	//state for modal screen
	const [showAddFavouriteModal, setShowAddFavouriteModal] = useState(false);
	const [showRemoveFavouritesModal, setShowRemoveFavouritesModal] =
		useState(false);
	const [showFiltersModal, setShowFiltersModal] = useState(false);

	//mapURL context
	const [mapURL, setMapURL] = useContext(MapURL);

	let history = useHistory();

	useEffect(() => {
		window.scrollTo(0, 10); //scroll map view down by 10
	}, []);

	const openFilter = (e) => {
		//TODO filter icons on map
	};

	//TODO - add filters button icon and filters
	//TODO - move back button to component file for re-use
	//TODO once a map display has been favourited using the add to fav button, button should be
	//TODO change to remove from favourites button

	//TODO  FRI - remove filters elements from URL manually?

	//function which updates the mapURL context
	const updateMapURL = (aMapURL) => {
		setMapURL(aMapURL);
	};

	//TODO get filters from filter modal - update filters state - 

	return (
		<Col className="mt-4 pt-0 col-map-display">
			<AddFavouriteModal
				mapurl={mapURL}
				show={showAddFavouriteModal}
				onHide={() => setShowAddFavouriteModal(false)}
			/>

			<RemoveFavouriteModal
				mapurl={mapURL}
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

				<Image className="mapDisplay" src={mapURL} />
			</Row>
		</Col>
	);
};
export default MapDisplay;
