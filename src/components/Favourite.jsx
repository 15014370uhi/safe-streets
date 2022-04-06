import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import uuid from "react-uuid";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { getCenterPoint } from "../util/AssignMapIcons";

// import leaflet related
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/**
 * A favourite for a user
 *
 * @param {string} title - Title for this favourite
 * @param {string} timestamp - Date the favourite was created
 * @param {string} deleteFavourite - Reference to function which deletes the favourite from the user's favourites
 */
const Favourite = ({
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
	const zoom = 15;

	return (
		<Col className="container-fluid mt-4">
			<Card
				className="favourite-card"
				key={uuid()}
				border="info"
				style={{ width: "18rem" }}>
				<MapContainer
					className="markercluster-map"
					center={[lat, lon]}
					zoom={zoom}
					maxZoom={18}
					style={{ height: "33vh" }}
					whenCreated={() => setMap(map)}
					zoomControl={false}>
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

				<Card.Header className="favourite-card-header">
					<h3>{title}</h3>
				</Card.Header>
				<Card.Body className="favourite-card-body" bg="light">
					<Button
						className="favourite-card-display-button"
						onClick={() => {
							displayMap(timestamp);
						}}
						variant="primary">
						Display Map
					</Button>
					<i
						className="far fa-trash-alt fa-lg trash-favourites"
						onClick={() => {
							deleteFavourite(timestamp);
						}}
					/>
				</Card.Body>
				<Card.Footer>
					<small className="text-muted">
						{" "}
						<h5>Date created:</h5>
						<h4>{timestamp.slice(0, -10)}</h4>
					</small>
				</Card.Footer>
			</Card>
		</Col>
	);
};

export default Favourite;
