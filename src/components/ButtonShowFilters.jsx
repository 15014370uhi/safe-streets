import React from "react";
import Button from "react-bootstrap/Button";

const ButtonShowFilters = ({ setModalShow }) => {
	return (
		<Button
			className="btn-open-filter"
			variant="dark"
			onClick={() => setModalShow(true)}>
			<i className="fa fa-filter fa-lg mx-2" />
		</Button>
	);
};

export default ButtonShowFilters;
