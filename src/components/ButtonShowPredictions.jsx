import React from "react";
import Button from "react-bootstrap/Button";

const ButtonShowPredictions = ({ setModalShow }) => {
	return (
		<Button
			className="btn-display-predictions"
			variant="danger"
			title="Show data"
			onClick={() => setModalShow(true)}>
			<i
				className="fa fa-brain fa-lg mx-4"
				title="View Crime Predictions"
			/>
			<span className="tooltip-text">Crime Predictions</span>
		</Button>
	);
};

export default ButtonShowPredictions;
