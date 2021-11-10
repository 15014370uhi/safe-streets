import React, { useState, useEffect, useContext } from "react";

// import contexts
import { MapDetails } from "../contexts/MapDetailsContext";
import { Crimes } from "../contexts/CrimeDataContext";
import { ResultsData } from "../contexts/ResultsDataContext";

// import utility functions
import { populateDisplayCrimes } from "../util/FilterCrimeIcons";
import { getMonthName } from "../util/DateHelper";
import {
	getCrimeCategory,
	getCrimeIcon,
	getCenterPoint,
} from "../util/AssignMapIcons";
import { getPredictions, getHistoricCrimes, getThreatLevel} from "../util/GetCrimeData";

import uuid from "react-uuid";

// import modals
import AddFavouriteModal from "../modals/AddFavouriteModal";
import ShowHistoricCrimeModal from "../modals/HistoricCrimeModal";
import ShowPredictionsModal from "../modals/PredictionsModal";
import CrimeWarningModal from "../modals/CrimeWarningModal";
import RemoveFavouriteModal from "../modals/RemoveFavouriteModal";
import FiltersModal from "../modals/FiltersModal";

// import buttons
import ButtonAddToFavs from "../components/ButtonAddToFavs";
import ButtonRemoveFromFavs from "../components/ButtonRemoveFromFavs";
import ButtonShowFilters from "../components/ButtonShowFilters";
import ButtonShowPredictions from "../components/ButtonShowPredictions";
import ButtonShowWarnings from "../components/ButtonShowWarnings";

import ButtonBack from "../components/ButtonBack";
import ButtonShowHistoricCrimes from "../components/ButtonShowHistoricCrimes";

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

	const [resultsData, setResultsData] = useContext(ResultsData);
	const [showFiltersModal, setShowFiltersModal] = useState(false); // filters modal
	const [showHistoricCrimeModal, setShowHistoricCrimeModal] = useState(false); // data chart modal
	const [showPredictionsModal, setShowPredictionsModal] = useState(false); // data chart modal
	const [showWarningsModal, setShowWarningsModal] = useState(false); // filters modal
	const [mapDetails, setMapDetails] = useContext(MapDetails); // map data context
	const [crimesToDisplay, setCrimesToDisplay] = useContext(Crimes); // crimes data context
	const [timestamp, setTimestamp] = useState(""); 
	const [showWarningButton, setShowWarningButton] = useState(false); 
	
	let history = useHistory();

	useEffect(() => {
		if (history.location.state?.isfavourite === "true") {		
			
			// set filters from saved favourite filters
		updateFilteredCrimes(mapDetails.filters);

		if (history.location.state.timestamp) {
			setTimestamp(history.location.state.timestamp);
		};		
		setMapFromFavourite();
		} else {
			setShowWarningButton(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const setFavouriteButton = async (buttonState) => {
		history.location.state.isfavourite = buttonState;
	};

	const setMapFromFavourite = async () => {
		const payload = {
			lat: mapDetails.lat,
			lon: mapDetails.lon,
		};
		// populate predictions and historic data for favourite
		var predictionsResponse = await getPredictions(payload);
		var threatLevel = getThreatLevel(predictionsResponse.predictions);
		var historicResponse = await getHistoricCrimes(payload);		
		
		setResultsData({
			predictions: predictionsResponse.predictions,
			historicCrimes: historicResponse.historicCrimes,
			threatLevel: threatLevel,
		});

		setShowWarningButton(true);
		
	};

	// function which updates the filtered crimes on map
	const updateFilteredCrimes = async (filters) => {
		var crimesFiltered = populateDisplayCrimes(
			mapDetails.allCrimes,
			filters
		);
		setCrimesToDisplay(crimesFiltered);

		// update mapDetails with new filters
		setMapDetails((mapDetails) => ({
			allCrimes: mapDetails.allCrimes,
			locationName: mapDetails.locationName,
			lat: mapDetails.lat,
			lon: mapDetails.lon,
			filters: filters,
		}));
	};

	//default zoom level on map
	const zoom = 17;

	return (
		<div className="map-container">
			<MapContainer
				className="markercluster-map"
				center={[mapDetails.lat, mapDetails.lon]}
				zoom={zoom}
				maxZoom={18}
				style={{ height: "90vh" }}
				whenCreated={() => setMap(map)}
				zoomControl={false}>
				{/* for each crime, add the correct marker to map */}
				{crimesToDisplay.map((crime) => (
					<Marker
						key={uuid()}
						position={[crime.latitude, crime.longitude]}
						icon={getCrimeIcon(crime.category, false)}>
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
					position={[mapDetails.lat, mapDetails.lon]}
					icon={getCenterPoint()}>
					<Popup className="icon-popup">
						{mapDetails.locationName}
						<p>
							({mapDetails.lat}, {mapDetails.lon})
						</p>
					</Popup>
				</Marker>

				<ButtonBack />

				{/* modal for crime warnings */}
				<ButtonShowWarnings 
					setModalShow={setShowWarningsModal}
					analysisComplete={showWarningButton}	
				/>
				<CrimeWarningModal 
					show={showWarningsModal}
					onHide={() => setShowWarningsModal(false)}					
				/>

				{/* filters */}
				<ButtonShowFilters setModalShow={setShowFiltersModal} />
				<FiltersModal
					show={showFiltersModal}
					onHide={() => setShowFiltersModal(false)}
					updateFilteredCrimes={updateFilteredCrimes}
					favouriteFilters={mapDetails.filters}										
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
					show={showRemoveFavouritesModal}
					onHide={() => setShowRemoveFavouritesModal(false)}
					mapdetails={mapDetails}
					timestamp={timestamp}
					setFavouriteButton={setFavouriteButton}
				/>

				<AddFavouriteModal
					show={showAddFavouriteModal}
					onHide={() => setShowAddFavouriteModal(false)}
					mapdetails={mapDetails}
				/>

				{/* prediction data from flask server */}
				<ShowPredictionsModal
					show={showPredictionsModal}
					onHide={() => setShowPredictionsModal(false)}					
				/>
				<ButtonShowPredictions setModalShow={setShowPredictionsModal} />

				{/* historic data */}
				<ShowHistoricCrimeModal
					show={showHistoricCrimeModal}
					onHide={() => setShowHistoricCrimeModal(false)}
				/>
				<ButtonShowHistoricCrimes
					setModalShow={setShowHistoricCrimeModal}
				/>

				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
			</MapContainer>
		</div>
	);
};

export default MapDisplay;
