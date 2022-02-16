import React from "react";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const ButtonShowHistoricCrimes = ({ setModalShow }) => {
	return (
		<>
		<OverlayTrigger
					placement="right"
					overlay={
						<Popover id={"button-tooltip"}>
							<Popover.Content className="button-tooltip-text">
								Display Historic Crime Rates
							</Popover.Content>
						</Popover>
					}>
		<Button
			className="btn-display-historiccrimes"
			variant="secondary"
			title="Show data"
			onClick={() => setModalShow(true)}>
			<i
				className="fa fa-chart-line fa-lg mx-4"
				title="View Historic Crime Data"
			/>
			<span className="tooltip-text">View Crime History</span>
		</Button>
		</OverlayTrigger>
		</>
	);
};

export default ButtonShowHistoricCrimes;
