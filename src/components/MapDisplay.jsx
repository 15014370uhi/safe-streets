import React, {useState, useEffect, useContext} from 'react';
import {MapURL} from '.././contexts/MapContext';
import {MapDetails} from '.././contexts/MapDetailsContext';
import {getUpdatedMapURL} from './../util/GetMapURL';
import {useHistory} from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/col';
import Row from 'react-bootstrap/row';
import AddFavouriteModal from './AddFavouriteModal';
import ButtonAddToFavs from './ButtonAddToFavs';
import RemoveFavouriteModal from './RemoveFavouriteModal';
import ButtonRemoveFromFavs from './ButtonRemoveFromFavs';
import FiltersModal from './FiltersModal';
import ButtonShowFilters from './ButtonShowFilters';
import ButtonBack from './ButtonBack';

// Functional component which displays the map image for a mapURL
const MapDisplay = (props) => {
	//state for modal screen
	const [showAddFavouriteModal, setShowAddFavouriteModal] = useState(false);
	const [showRemoveFavouritesModal, setShowRemoveFavouritesModal] = useState(false);
	const [showFiltersModal, setShowFiltersModal] = useState(false);

	//mapURL context
	const [mapURL, setMapURL] = useContext(MapURL);	
	const [mapDetails, setMapDetails] = useContext (MapDetails); //TODO

	let history = useHistory();

	useEffect(() => {
		window.scrollTo(0, 10); //scroll map view down by 10
	}, []);

	const openFilter = (e) => {
		//TODO filter icons on map
	};


	//function which updates the mapURL context
	const updateMapURL = async (filters) => {	
		
		// const isNameSearch = false;
		// const lat = mapDetails.lat;
		// const lon = mapDetails.lon; 
		// const numberOfMonths = mapDetails.numberOfMonths;

		console.log("MapDetails updateMapURL payload to hold: " 
		 + "aMapURL: " + mapDetails.mapURL
		 + "\nisNameSearch: " + mapDetails.isnamesearch
		 + "\nnumberofmonths: " + mapDetails.numberofmonths
		 + "\nlat: " + mapDetails.lat
		 + "\nlon: " + mapDetails.lon
		 + "\nfilters: " + filters);

		const payload = 
		{
			locationname: mapDetails.locationname,
			isnamesearch: mapDetails.isnamesearch,
			lat: mapDetails.lat,
			lon: mapDetails.lon,
			numberofmonths: mapDetails.numberofmonths,
			filters: filters,
		};		
	
		//call API function in external file
		const updatedMapURL = await getUpdatedMapURL(payload); //TODO check data getting to api	

		//update context to latest data //TODO check if this version works
		setMapDetails(prevState => ({
			mapURL: updatedMapURL,			
			filters: filters,
		}));		

		// //update context to latest data
		// setMapDetails(prevState => ({
		// 	mapURL: updatedMapURL,
		// 	...prevState.isnameSearch,
		// 	...prevState.lat,
		// 	...prevState.lon,
		// 	...prevState.numberOfMonths,
		// 	filters: filters,
		// }));		
	};

	//TODO get filters from filter modal - update filters state - 

	return (
		<Col className="mt-4 pt-0 col-map-display">
<br />  
		<div>
		-----------------------------------------------------------------		
			URL: {mapDetails.mapURL}
			isNameSearch: {mapDetails.isnamesearch}
			numberOfMonths: {mapDetails.numberofmonths}
				lat: {mapDetails.lat}
				lon: {mapDetails.lon}					
		-----------------------------------------------------------------				
		</div>
		<br />  

			<AddFavouriteModal
				mapurl={mapURL}				
				show={showAddFavouriteModal}
				onHide={() => setShowAddFavouriteModal(false)}
				mapdetails={mapDetails}
			/>

			<RemoveFavouriteModal
				mapurl={mapURL}
				show={showRemoveFavouritesModal}
				onHide={() => setShowRemoveFavouritesModal(false)}
			/>

			<FiltersModal
				show={showFiltersModal}
				onHide={() => setShowFiltersModal(false)}
				updateMapURL={updateMapURL}
				mapdetails={mapDetails}
				setmapdetails={setMapDetails}
			/>

			<Row className="row-map">
				<ButtonBack />

				<ButtonShowFilters
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

				<Image className="mapDisplay" src={mapDetails.mapURL} />
			</Row>
		</Col>
	);
};
export default MapDisplay;
