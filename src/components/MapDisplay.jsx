import React, { useState, useEffect, useContext } from "react";

// import contexts
import { MapDetails } from "../contexts/MapDetailsContext";
import { Crimes } from "../contexts/CrimeDataContext";
import { CenterPoint } from "../contexts/CenterPointContext";
//import { ResultsData } from "../contexts/ResultsDataContext";

// import utility functions
//import { getUpdatedMapURL } from "../util/GetMapURL";
import { populateDisplayCrimes } from "../util/FilterIcons";
import { getMonthName } from "../util/DateHelper";
import {
	getCrimeCategory,
	getCrimeIcon,
	getCenterPoint,
} from "../util/AssignMapIcons";

import uuid from "react-uuid";

// import modals
import AddFavouriteModal from "../modals/AddFavouriteModal";
import ShowHistoricCrimeModal from "../modals/HistoricCrimeModal";
import ShowPredictionsModal from "../modals/PredictionsModal";

import RemoveFavouriteModal from "../modals/RemoveFavouriteModal";
import FiltersModal from "../modals/FiltersModal";

// import buttons
import ButtonAddToFavs from "./ButtonAddToFavs";
import ButtonRemoveFromFavs from "./ButtonRemoveFromFavs";
import ButtonShowFilters from "./ButtonShowFilters";
import ButtonShowPredictions from "./ButtonShowPredictions";
import ButtonBack from "./ButtonBack";
import ButtonShowHistoricCrimes from "./ButtonShowHistoricCrimes";

// import leaflet related
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// import history
import { useHistory } from "react-router-dom";

const MapDisplay = () => {
	const [map, setMap] = useState(null); // leaflet map object
	const [showAddFavouriteModal, setShowAddFavouriteModal] = useState(false); // favourites modal
	const [showRemoveFavouritesModal, setShowRemoveFavouritesModal] =
		useState(false);

	const [showFiltersModal, setShowFiltersModal] = useState(false); // filters modal
	const [showHistoricCrimeModal, setShowHistoricCrimeModal] = useState(false); // data chart modal
	const [showPredictionsModal, setShowPredictionsModal] = useState(false); // data chart modal

	const [mapDetails, setMapDetails] = useContext(MapDetails); // map data context
	const [crimeData, setCrimeData] = useContext(Crimes); // crimes data context
	const [centerPoint] = useContext(CenterPoint); // reference to center point of search
	
	let history = useHistory();

	useEffect(() => {
		window.scrollTo(0, 0); // scroll map to top
	}, []);

	// function which updates the filtered crimes on map
	const updateFilteredCrimes = async (filters) => {
		var crimesFiltered = populateDisplayCrimes(
			mapDetails.allCrimes,
			filters
		);
		setCrimeData(crimesFiltered);
	};

	//default zoom level on map
	const zoom = 17;

	return (
		<div className="map-container">
			<MapContainer
				className="markercluster-map"
				center={[centerPoint[0], centerPoint[1]]}
				zoom={zoom}
				maxZoom={18}
				style={{ height: "90vh" }}
				whenCreated={() => setMap(map)}
				zoomControl={false}>
				{/* for each crime, add the correct marker to map */}
				{crimeData.map((crime) => (
					<Marker
						key={uuid()}
						position={[crime.latitude, crime.longitude]}
						icon={getCrimeIcon(crime.category)}>
						<Popup className="icon-popup">
							{getCrimeCategory(crime.category)}
							{"\n"}
							<p>
								{getMonthName(crime.month)}, {crime.year}
							</p>
							<p>
								({crime.latitude}, {crime.longitude})
							</p>
						</Popup>
					</Marker>
				))}

				{/* add center point marker */}
				<Marker
					key={uuid()}
					position={[centerPoint[0], centerPoint[1]]}
					icon={getCenterPoint()}>
					<Popup className="icon-popup">
						{mapDetails.locationname}
						<p>
							({centerPoint[0]}, {centerPoint[1]})
						</p>
					</Popup>
				</Marker>

				<ButtonBack />

				{/* filters */}
				<ButtonShowFilters setModalShow={setShowFiltersModal} />
				<FiltersModal
					show={showFiltersModal}
					onHide={() => setShowFiltersModal(false)}
					updateFilteredCrimes={updateFilteredCrimes}
					mapdetails={mapDetails}
					setmapdetails={setMapDetails}
				/>

				{/* add and remove favourites */}
				{history.location.state?.isfavourite === "true" ? (
					<ButtonRemoveFromFavs
						setModalShow={setShowRemoveFavouritesModal}
					/>
				) : (
					<ButtonAddToFavs setModalShow={setShowAddFavouriteModal} />
				)}

				<RemoveFavouriteModal
					mapurl={mapDetails.mapURL}
					show={showRemoveFavouritesModal}
					onHide={() => setShowRemoveFavouritesModal(false)}
				/>

				<AddFavouriteModal
					mapurl={mapDetails.mapURL}
					show={showAddFavouriteModal}
					onHide={() => setShowAddFavouriteModal(false)}
					mapdetails={mapDetails}
				/>

				{/* historic data */}
				<ShowHistoricCrimeModal
					show={showHistoricCrimeModal}
					onHide={() => setShowHistoricCrimeModal(false)}
				/>
				<ButtonShowHistoricCrimes
					setModalShow={setShowHistoricCrimeModal}
				/>

				{/* prediction data from flask server */}
				<ShowPredictionsModal
					show={showPredictionsModal}
					onHide={() => setShowPredictionsModal(false)}
				/>
				<ButtonShowPredictions setModalShow={setShowPredictionsModal} />

				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
			</MapContainer>
		</div>
	);
};

export default MapDisplay;
