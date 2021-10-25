import React, { useState, useEffect, useContext } from "react";
import { MapDetails } from "../contexts/MapDetailsContext";
import { Crimes } from "../contexts/CrimeDataContext";
import { CenterPoint } from "../contexts/CenterPointContext";
import { getUpdatedMapURL } from "../util/GetMapURL";
import { filterIcons } from "../util/FilterIcons";
import { useHistory } from "react-router-dom";
import AddFavouriteModal from "../modals/AddFavouriteModal";
import ButtonAddToFavs from "./ButtonAddToFavs";
import RemoveFavouriteModal from "../modals/RemoveFavouriteModal";
import ButtonRemoveFromFavs from "./ButtonRemoveFromFavs";
import FiltersModal from "../modals/FiltersModal";
import ButtonShowFilters from "./ButtonShowFilters";
import ButtonBack from "./ButtonBack";
import uuid from "react-uuid";

import 'leaflet/dist/leaflet.css';

//Import custom icons for crimes
// import heart from "../../images/other/love.svg";


import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	ZoomControl,
} from "react-leaflet";
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
	const [crimeData, setCrimeData] = useContext(Crimes);
	const [centerPoint, setCenterPoint] = useContext(CenterPoint);
	const [showDataModal, setShowDataModal] = useState(false); //Data chart modal
	let history = useHistory();

	// function which updates the mapURL context
	const updateMapURL = async (filters) => {

		console.log('updateMapURL in mapDisplay got filters: ' + filters);
		//TODO TEST ignoring API 
		//TODO cant use same one for source of crime data and displayed on map
		//TODO when you filter I will lose all crime information aBOUT THOSE ONES
		var crimesFiltered = filterIcons(mapDetails.displaycrimes, filters);
		//console.log(JSON.stringify(crimesFiltered));
		setCrimeData(crimesFiltered); //are these already filtered in api?

		//TODO get static map of area to save as favourite from API
		
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

	const getCrimeIcon = (aCrimeCategory) => {
		//const text = aCrimeCategory.replace(/-/g, '_');
		//console.log('createTestIcon received: ' + aCrimeCategory);
		var icon;
		var color;
		var text;
		var geoapifyAPIKey = "b0188d827da8401786390efebdbc0484"; //TODO move to env variables

		switch (aCrimeCategory) {
			case "anti-social-behaviour":
				text = "Anti";
				color = "%23261378";
				break;

			case "bicycle-theft":
			case "other-theft":
			case "theft-from-the-person":
				text = "Theft";
				color = "%23261378";
				break;

			case "burglary":
				text = "Burg";
				color = "%23261378";
				break;

			case "criminal-damage-arson":
				text = "Arsn";
				color = "%23261378";
				break;

			case "drugs":
				text = "Drugs";
				color = "%23261378";
				break;

			case "public-order":
			case "other-crime":
				text = "Order";
				color = "%23261378";
				break;

			case "possession-of-weapons":
				text = "Weap";
				color = "%23261378";
				break;

			case "violent-crime":
			case "robbery":
			case "violence-and-sexual-offences":
				text = "Viol";
				color = "%23261378";
				break;

			case "vehicle-crime":
				text = "Vehi";
				color = "%23261378";
				break;

			default:
				//intentially blank
				break;
		}

		//console.log('creating icon with: ' + text + '\n ' + color + '\n ' + geoapifyAPIKey);
		icon = new L.icon({
			iconUrl:
				"https://api.geoapify.com/v1/icon/?type=awesome&color=" +
				color +
				"&size=xx-large&iconSize=small&text=" +
				text +
				"&textSize=small&apiKey=" 
				+ geoapifyAPIKey,
			iconSize: [60, 89], // size of the icon
			iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
			popupAnchor: [0, -45], // point from which the popup should open relative to the iconAnchor
		});

		return icon;
	};

	//TODO leaflet settings 
	const zoom = 17;

	
//You don't need to use require. instead of giving iconUrl = "../assets/name" you only need to import your png or svg then you can give the source to your iconUrl. look at the example below:

// first import your image or svg

// import heart from "../../images/other/love.svg";
// // give the source to your icon

// let loveIcon = L.icon({
//   iconUrl: heart,    //TODO try custom icons from SVG files
//   iconRetinaUrl: heart,
//   iconAnchor: [5, 55],
//   popupAnchor: [10, -44],
//   iconSize: [25, 55],
// });
// // simply add it to your map

// L.marker([28, 50], {
//        icon: loveIcon,
//      }).addTo(map);

// 		console.log(icon);

// 		return icon;
// 	};

	// //tODO add to state?
	// var crimeIcons = [];

	
	//TODO Check this out - could maybe add this as crime bounding box indicator?
	//   var polygon = L.polygon([
	//     [51.509, -0.08],
	//     [51.503, -0.06],       https://leafletjs.com/examples/quick-start/
	//     [51.51, -0.047]
	// ]).addTo(mymap);

	//TODO custom markers at this page
	//https://stackoverflow.com/questions/47723812/custom-marker-icon-with-react-leaflet
	
	//icon={() => createTestIcon(crime.category)}>
	//whenCreated={() => setMap(map)}
	//	{flyToLocation()}

	return (
		<div className="map-container">
			<MapContainer
				center={[centerPoint[0], centerPoint[1]]}
				zoom={zoom}
				style={{ height: "90vh" }}
				whenCreated={() => setMap(map)}
				zoomControl={false}>			

				{crimeData.map((crime) => (
					<Marker
						key={uuid()}
						position={[crime.latitude, crime.longitude]}
						icon={getCrimeIcon(crime.category)}>
						<Popup>{crime.category}</Popup>
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
