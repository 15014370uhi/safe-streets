import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import UKMapImage from "../images/ukVectorGuide.svg";
import UKIconImage from "../images/uk-icon.png";

// style components
import { MDBBtn, MDBInput } from "mdbreact";

const Search = (props) => {
	const {
		submitForm,
		formInputHandler,
		locationName,
		lat,
		lon,
		numberOfMonths,
		dropHandler,
		radioButton,
		radioClickedHandler,
		submitText,
	} = props;

	let [imageOpen, setImageOpen] = useState(false);

	// map guide image popup for uk
	const handleShowImage = (e) => {
		e.preventDefault();
		setImageOpen(!imageOpen);
	};

	return (
		<form onSubmit={submitForm}>
			<fieldset
				onClick={(e) => radioClickedHandler("0")}
				className={
					radioButton === "0"
						? "selectedFieldSet"
						: "notSelectedFieldSet"
				}>
				<label>
					Search by location
					<input
						className="form-radio"
						type="radio"
						checked={radioButton === "0"}
						onClick={(e) => radioClickedHandler("0")}
						onChange={formInputHandler}
						id="searchRadioStreet"
					/>
				</label>
				<br />
				<label className="inputLabels">Street address or town</label>
				<MDBInput
					autoFocus={radioButton === "0" ? true : false}
					size="lg"
					icon="road"
					type="text"
					name="locationName"
					value={locationName}
					onChange={formInputHandler}
					onClick={(e) => radioClickedHandler("0")}
				/>
			</fieldset>
			<fieldset
				onClick={(e) => radioClickedHandler("1")}
				className={
					radioButton === "1"
						? "selectedFieldSet"
						: "notSelectedFieldSet"
				}>
				<label>
					{" "}
					Search by latitude and longitude
					<input
						className="form-radio"
						type="radio"
						checked={radioButton === "1"}
						onClick={(e) => radioClickedHandler("1")}
						onChange={formInputHandler}
						id="searchRadioLatLon"
					/>
				</label>
				<br />
				<label className="inputLabels">Latitude</label>
				<MDBInput
					autoFocus={radioButton === "1" ? true : false}
					size="lg"
					icon="map-marker-alt"
					type="text"
					name="lat"
					value={lat}
					onChange={formInputHandler}
					onClick={(e) => radioClickedHandler("1")}
				/>
				<label className="inputLabels">Longitude</label>
				<MDBInput
					size="lg"
					icon="map-marker-alt"
					type="text"
					name="lon"
					value={lon}
					onChange={formInputHandler}
					onClick={(e) => radioClickedHandler("1")}
				/>

				<MDBBtn
					id="showMapGuide"
					color="warning"
					className="mb-3"
					block
					size="lg"
					onClick={handleShowImage}>
					<img
						className="mapicon"
						src={UKIconImage}
						onClick={handleShowImage}
						alt="Outline of the UK Map"
					/>
					UK Map boundary guide
				</MDBBtn>

				{imageOpen && (
					<dialog
						className="dialog"
						style={{ position: "absolute" }}
						open
						onClick={handleShowImage}>
						<img
							className="image"
							src={UKMapImage}
							onClick={handleShowImage}
							alt="UK Map"
						/>
					</dialog>
				)}
			</fieldset>
			<label className="monthsInputLabel">
				Number of month's records to include?
			</label>
			<Dropdown
				name="monthsDropdown"
				id="dropdown-months-button"
				size="lg"
				onSelect={(e) => dropHandler(e)}>
				<Dropdown.Toggle variant="danger" id="dropdown-months-toggle">
					{numberOfMonths} months
				</Dropdown.Toggle>
				<Dropdown.Menu>
					<Dropdown.Item eventKey="3">3 Months</Dropdown.Item>
					<Dropdown.Item eventKey="6">6 Months</Dropdown.Item>
					<Dropdown.Item eventKey="12">12 Months</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>

			<div className="text-center mt-4">
				<MDBBtn
					id="searchSubmitButton"
					color="secondary"
					className="mb-3 submit-search-btn"
					block
					size="lg"
					type="submit">
					{submitText}
				</MDBBtn>
			</div>
		</form>
	);
};

export default Search;
