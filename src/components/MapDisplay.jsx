import React, { useState, useEffect, useContext} from "react";
import { MapDetails } from "../contexts/MapDetailsContext";
import { getUpdatedMapURL } from "../util/GetMapURL";
import { useHistory } from "react-router-dom";
import Image from "react-bootstrap/Image";
import AddFavouriteModal from "../modals/AddFavouriteModal";
import ButtonAddToFavs from "./ButtonAddToFavs";
import RemoveFavouriteModal from "../modals/RemoveFavouriteModal";
import ButtonRemoveFromFavs from "./ButtonRemoveFromFavs";
import FiltersModal from "../modals/FiltersModal";
import ButtonShowFilters from "./ButtonShowFilters";
import ButtonBack from "./ButtonBack";

// data modal
import ButtonShowData from "./ButtonShowData";
import DataModal from "../modals/ShowDataModal";

// component which displays the map image for a mapURL
const MapDisplay = (props) => {
	// state for modal screen
	const [showAddFavouriteModal, setShowAddFavouriteModal] = useState(false);
	const [showRemoveFavouritesModal, setShowRemoveFavouritesModal] =
		useState(false);
	const [showFiltersModal, setShowFiltersModal] = useState(false);
	const [mapDetails, setMapDetails] = useContext(MapDetails);
	const [showDataModal, setShowDataModal] = useState(false); //Data chart modal

	let history = useHistory();


	// //TODO TEST display of flask dataKey
	// const showFlaskData = () => {

	// 	const flaskData = mapDetails.flaskdata;
	// 	//TODO save flask data to favourites data?
	// 	console.log('Flask Data in mapdisplay holds: ' + JSON.stringify (flaskData));

	// 	//TEST FLASK RESPONSE DATA
	// 	const anti_social_behaviour = flaskData.Anti_social_behaviour;
	// 	const burglary = flaskData.Burglary;
	// 	const criminal_damage_and_arson = flaskData.Criminal_damage_and_arson;
	// 	const drugs = flaskData.Drugs;
	// 	const possession_of_weapons = flaskData.Possession_of_weapons;
	// 	const public_order = flaskData.Public_order;
	// 	const theft = flaskData.Theft;
	// 	const shoplifting = flaskData.Shoplifting;
	// 	const vehicle_crime = flaskData.Vehicle_crime;
	// 	const violent_crime = flaskData.Violent_crime;

	// 	//TODO Convert to graphic data within modal for prediction and historic data
	// 	alert (
	// 	  'Predicted Crime Probabilities for this month: \n' +
	// 		'Anti-Social = ' +
	// 		parseFloat (anti_social_behaviour).toFixed (2) +
	// 		//parseFloat (anti_social_behaviour / 4).toFixed (2) +
	// 		'%\n' +
	// 		'Burglary = ' +
	// 		parseFloat (burglary).toFixed (2) +
	// 		'%\n' +
	// 		'Criminal Damage & Arson = ' +
	// 		parseFloat (criminal_damage_and_arson).toFixed (2) +
	// 		'%\n' +
	// 		'Drugs = ' +
	// 		parseFloat (drugs).toFixed (2) +
	// 		'\n' +
	// 		'Possession of Weapons = ' +
	// 		parseFloat (possession_of_weapons).toFixed (2) +
	// 		'%\n' +
	// 		'Public Order = ' +
	// 		parseFloat (public_order).toFixed (2) +
	// 		'%\n' +
	// 		'Theft = ' +
	// 		parseFloat (theft).toFixed (2) +
	// 		'%\n' +
	// 		'Vehicle Crime = ' +
	// 		parseFloat (vehicle_crime).toFixed (2) +
	// 		'%\n' +
	// 		'Violent Crime = ' +
	// 		parseFloat (violent_crime).toFixed (2) +
	// 		'%\n'+
	// 		'Shoplifting = ' +
	// 		parseFloat (shoplifting).toFixed (2) +
	// 		'%\n'
	// 	);
	// };


	useEffect(() => {
		window.scrollTo(0, 10); // scroll map view down		
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);




	// function which updates the mapURL context
	const updateMapURL = async (filters) => {
		const payload = {
			locationname: mapDetails.locationname,
			isnamesearch: mapDetails.isnamesearch,
			lat: mapDetails.lat,
			lon: mapDetails.lon,
			numberofmonths: mapDetails.numberofmonths,
			filters: filters,
		};
		// call API function 
		const response = await getUpdatedMapURL(payload);	

		console.log('\n\nRESPONSE: ' + JSON.stringify(response.historicData) + '\n====================\n');

		await setMapDetails((mapDetails) => ({			
			flaskdata: response.flaskdata,
			historicdata: response.historicData,
			mapURL: response.mapurl,
			locationname: response.locationname,
			isnamesearch: response.isnamesearch,
			lat: response.lat,
			lon: response.lon,
			numberofmonths: response.numberofmonths,
			filters: response.filters,
		}));
	};

	return (
		<div className="map-container">

			<AddFavouriteModal
				mapurl={mapDetails.mapURL}
				show={showAddFavouriteModal}
				onHide={() => setShowAddFavouriteModal(false)}
				mapdetails={mapDetails}
			/>

			<RemoveFavouriteModal
				mapurl={mapDetails.mapURL}
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

			<DataModal
				show={showDataModal}				
				onHide={() => setShowDataModal(false)}
			/>

			<ButtonShowData setShowDataModal={setShowDataModal} />
			<ButtonBack />
			<ButtonShowFilters setModalShow={setShowFiltersModal} />

			{history.location.state?.isfavourite === "true" ? (
				<ButtonRemoveFromFavs
					setModalShow={setShowRemoveFavouritesModal}
				/>
			) : (
				<ButtonAddToFavs setModalShow={setShowAddFavouriteModal} />
			)}
			<Image className="mapDisplay" src={mapDetails.mapURL} />
		</div>
	);
};

export default MapDisplay;
