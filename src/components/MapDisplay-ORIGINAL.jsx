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
import DataModal from "../modals/CrimeDataModal";

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

		await setMapDetails((mapDetails) => ({			
			//flaskdata: response.flaskdata,
			//historicdata: response.historicData,
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