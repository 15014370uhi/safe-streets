import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import uuid from "react-uuid";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/col";
import {
	getCrimeCategory,
	getCrimeIcon,
	getCenterPoint,
} from "../util/AssignMapIcons";

import { populateAllCrimes } from "../util/FilterCrimeIcons";
import { getMonthName } from "../util/DateHelper";

// import leaflet related
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";


/**
 * A favourite for a user
 *
 * @param {string} title - Title for this favourite
 * @param {string} mapurl - URL of map image
 * @param {string} timestamp - Date the favourite was created
 * @param {string} deleteFavourite - Reference to function which deletes the favourite from the user's favourites
 */
const Favourite = ({
	allCrimes,
	title,
	locationName,
	lat,
	lon,
	timestamp,
	deleteFavourite,
	displayMap,
}) => {
	const [map, setMap] = useState(null); // leaflet map object

	//default zoom level on map
	const zoom = 16;

	return (
		<Col className="container-fluid mt-4">
			<Card key={uuid()} border="info" style={{ width: "20rem" }}>
				<MapContainer
					className="markercluster-map"
					center={[lat, lon]}
					zoom={zoom}
					maxZoom={18}
					style={{ height: "40vh" }}
					whenCreated={() => setMap(map)}
					zoomControl={false}>
					{/* for each crime, add the correct marker to map */}
					{allCrimes.map((crime) => (
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
						position={[lat, lon]}
						icon={getCenterPoint()}>
						<Popup className="icon-popup">
							{locationName}
							<p>
								({lat}, {lon})
							</p>
						</Popup>
					</Marker>

					<TileLayer
						attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
				</MapContainer>

				<Card.Header>{title}</Card.Header>
				<Card.Body className="favourite-card-body" bg="light">
					<Button
						className="favourite-card-display-button"
						onClick={() => {
							displayMap(title);
						}}
						variant="primary">
						Display Map
					</Button>
					<i
						className="far fa-trash-alt fa-lg trash-favourites"
						onClick={() => {
							deleteFavourite(title);
						}}
					/>
				</Card.Body>
				<Card.Footer>
					<small className="text-muted">
						{" "}
						Date created:
						<h5>{timestamp}</h5>
					</small>
				</Card.Footer>
			</Card>
		</Col>
	);
};

export default Favourite;

// <Card.Img
// 					variant="top"
// 					src={mapurl}
// 					onClick={() => {
// 						displayMap(title);
// 					}}
// 				/>
