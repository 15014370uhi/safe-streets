import React, { useState, useEffect, useContext } from "react";

// import contexts
import { MapDetails } from "../contexts/MapDetailsContext";
import { Crimes } from "../contexts/CrimeDataContext";
import { CenterPoint } from "../contexts/CenterPointContext";
import { ResultsData } from "../contexts/ResultsDataContext";

// import utility functions
import { getUpdatedMapURL } from "../util/GetMapURL";
import { populateDisplayCrimes } from "../util/FilterIcons";
import {getMonthName} from "../util/DateHelper";
import { getCrimeCategory, getCrimeIcon, getCenterPoint} from "../util/AssignMapIcons";

import uuid from "react-uuid";

// import modals
import AddFavouriteModal from "../modals/AddFavouriteModal";
import DataModal from "../modals/CrimeDataModal";
import RemoveFavouriteModal from "../modals/RemoveFavouriteModal";
import FiltersModal from "../modals/FiltersModal";

// import buttons 
import ButtonAddToFavs from "./ButtonAddToFavs";
import ButtonRemoveFromFavs from "./ButtonRemoveFromFavs";
import ButtonShowFilters from "./ButtonShowFilters";
import ButtonBack from "./ButtonBack";
import ButtonShowData from "./ButtonShowData";

// import leaflet related
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// import history
import { useHistory } from "react-router-dom";


const MapDisplay = () => {
	const [map, setMap] = useState(null); // leaflet map object
	const [showAddFavouriteModal, setShowAddFavouriteModal] = useState(false); // favourites modal
	const [showRemoveFavouritesModal, setShowRemoveFavouritesModal] = useState(false);
	const [showFiltersModal, setShowFiltersModal] = useState(false); // filters modal
	const [mapDetails, setMapDetails] = useContext(MapDetails); // map data context
	const [crimeData, setCrimeData] = useContext(Crimes); // crimes data context
	const [centerPoint, setCenterPoint] = useContext(CenterPoint); // reference to center point of search
	const [showDataModal, setShowDataModal] = useState(false); // data chart modal
	const [resultsData, setResultsData] = useContext(ResultsData); // results data
	let history = useHistory();

	useEffect(() => {
		window.scrollTo(0, 0); // scroll map to top
	}, []);

	// function which updates the filtered crimes on map
	const updateMap = async (filters) => {
		var crimesFiltered = populateDisplayCrimes(
			mapDetails.displaycrimes,
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

				<Marker
						key={uuid()}
						position={[centerPoint[0], centerPoint[1]]}
						icon={getCenterPoint()}>
						<Popup className="icon-popup">	
							{mapDetails.locationname}
								<p>({centerPoint[0]}, {centerPoint[1]})</p>
						</Popup>
					</Marker>

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
					updateMap={updateMap}
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

				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
			</MapContainer>
			)
		</div>
	);
};

export default MapDisplay;
