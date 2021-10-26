import React, { useState, useEffect, useContext } from "react";
import { MapDetails } from "../contexts/MapDetailsContext";
import { Crimes } from "../contexts/CrimeDataContext";
import { CenterPoint } from "../contexts/CenterPointContext";
import { getUpdatedMapURL } from "../util/GetMapURL";
import { filterIcons } from "../util/FilterIcons";
import { getCrimeCategory, getCrimeIcon } from "../util/CrimeTypes";
import { useHistory } from "react-router-dom";
import AddFavouriteModal from "../modals/AddFavouriteModal";
import ButtonAddToFavs from "./ButtonAddToFavs";
import RemoveFavouriteModal from "../modals/RemoveFavouriteModal";
import ButtonRemoveFromFavs from "./ButtonRemoveFromFavs";
import FiltersModal from "../modals/FiltersModal";
import ButtonShowFilters from "./ButtonShowFilters";
import ButtonBack from "./ButtonBack";
import uuid from "react-uuid";
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// data modal
import ButtonShowData from "./ButtonShowData";
import DataModal from "../modals/CrimeDataModal";

const MapDisplay = () => {
	const [map, setMap] = useState(null);
	// state for modal screen
	const [showAddFavouriteModal, setShowAddFavouriteModal] = useState(false);
	const [showRemoveFavouritesModal, setShowRemoveFavouritesModal] =
		useState(false);
	const [showFiltersModal, setShowFiltersModal] = useState(false);
	const [mapDetails, setMapDetails] = useContext(MapDetails);
	const [crimeData, setCrimeData] = useContext(Crimes);
	const [centerPoint, setCenterPoint] = useContext(CenterPoint);
	const [showDataModal, setShowDataModal] = useState(false); //Data chart modal
	let history = useHistory();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// function which updates the mapURL context
	const updateMapURL = async (filters) => {
		//console.log('updateMapURL in mapDisplay got filters: ' + filters);

		var crimesFiltered = filterIcons(mapDetails.displaycrimes, filters);

		//console.log(JSON.stringify(crimesFiltered));
		setCrimeData(crimesFiltered); //are these already filtered in api?

		// const payload = {
		// 	locationname: mapDetails.locationname,
		// 	isnamesearch: mapDetails.isnamesearch,
		// 	lat: mapDetails.lat, //centre point
		// 	lon: mapDetails.lon, //centre point
		// 	numberofmonths: mapDetails.numberofmonths,
		// 	filters: filters,
		// };

		// call API function
		// const response = await getUpdatedMapURL(payload);
		// await setMapDetails((mapDetails) => ({
		// 	mapURL: response.mapurl,
		// 	locationname: response.locationname,
		// 	isnamesearch: response.isnamesearch,
		// 	lat: response.lat,
		// 	lon: response.lon,
		// 	numberofmonths: response.numberofmonths,
		// 	filters: response.filters,
		// }));
		//TODO TEST setting crimes from update

		//TODO ********  create util function/file which takes crimeData and returns
		// TODO the filtered version without calling API
		// TODO the file/function will also update the context that saves favourites<<
		//console.log('CRIME DATA: ' + JSON.stringify(response.displaycrimes));
		//setCrimeData (response.displaycrimes);

		//setCrimeData(filterIcons(response.displaycrimes, filters)); //are these already filtered in api?
	};

	//default zoom level on map
	const zoom = 17;

	//TODO Check this out - could maybe add this as crime bounding box indicator?
	//   var polygon = L.polygon([
	//     [51.509, -0.08],
	//     [51.503, -0.06],       https://leafletjs.com/examples/quick-start/
	//     [51.51, -0.047]
	// ]).addTo(mymap);

	return (
		<div className="map-container">
			<MapContainer
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
							<p>
								({crime.latitude}, {crime.longitude})
							</p>
						</Popup>
					</Marker>
				))}

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
