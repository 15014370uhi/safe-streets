import React, { useState, useEffect, useContext } from "react";
//import {Grid} from '@material-ui/core';
import { MapDetails } from "../contexts/MapDetailsContext";
import { getUpdatedMapURL } from "../util/GetMapURL";
import { useHistory } from "react-router-dom";
//import Image from "react-bootstrap/Image";
import AddFavouriteModal from "../modals/AddFavouriteModal";
import ButtonAddToFavs from "./ButtonAddToFavs";
import RemoveFavouriteModal from "../modals/RemoveFavouriteModal";
import ButtonRemoveFromFavs from "./ButtonRemoveFromFavs";
import FiltersModal from "../modals/FiltersModal";
import ButtonShowFilters from "./ButtonShowFilters";
import ButtonBack from "./ButtonBack";

import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
	const [showDataModal, setShowDataModal] = useState(false); //Data chart modal
	let history = useHistory();

	// function which updates the mapURL context
	const updateMapURL = async (filters) => {

		const payload = {
			locationname: mapDetails.locationname,
			isnamesearch: mapDetails.isnamesearch,
			lat: mapDetails.lat, //centre point
			lon: mapDetails.lon, //centre point
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

	//TODO set custom icons for each crime type

	const regionName = mapDetails.locationname; //paris

	const icon = L.icon({
		iconSize: [25, 41],
		iconAnchor: [10, 41],
		popupAnchor: [2, -40],
		iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
		shadowUrl:
			"https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
	});

  //TODO leaflet settings - I don't think i need regionCoord stuff at all
	const zoom = 8;
	const regionCoord = [48.864716, 2.349014];

  //TODO Check this out - could maybe add this as crime bounding box indicator?
//   var polygon = L.polygon([
//     [51.509, -0.08],
//     [51.503, -0.06],       https://leafletjs.com/examples/quick-start/
//     [51.51, -0.047]
// ]).addTo(mymap);

//TODO custom markers at this page 
//https://stackoverflow.com/questions/47723812/custom-marker-icon-with-react-leaflet

//{/* <Marker position={position}>
        //     <Popup>
        //       MAp over array of markers for crimes. <br /> Easily customizable.
        //     </Popup>
        // </Marker> */}



	// function FlyToButton() {
	//   const onClick = () => {
	//     map.flyTo(regionCoord, zoom);
	//   };
	//   return <button onClick={onClick}>Add marker on click</button>;
	// }

  //zoomControl={false}

	return (
		<div className="map-container">
			{regionCoord && (
				<MapContainer
					center={[50, 50]}
					zoom={zoom}
					style={{ height: "90vh" }}          
					whenCreated={setMap}
          zoomControl={false}          >

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
						<ButtonAddToFavs
							setModalShow={setShowAddFavouriteModal}
						/>
					)}

					<TileLayer
						attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>

					<Marker position={regionCoord} icon={icon}>
						<Popup>{regionName}</Popup>
					</Marker>

				</MapContainer>
			)}
		</div>
	);
};

export default MapDisplay;
