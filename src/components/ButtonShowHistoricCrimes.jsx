import React from "react";
import Button from "react-bootstrap/Button";

const ButtonShowHistoricCrimes = ({ setModalShow }) => {
	return (
		<Button
			className="btn-display-historiccrimes"
			variant="secondary"
			title="Show data"
			onClick={() => setModalShow(true)}>
			<i
				className="fa fa-chart-line fa-lg mx-4"
				title="View Historic Crime Data"
			/>
			<span className="tooltip-text">Historic Crime Data</span>
		</Button>
	);
};

export default ButtonShowHistoricCrimes;
