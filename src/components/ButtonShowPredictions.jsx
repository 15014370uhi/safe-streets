import React from "react";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const ButtonShowPredictions = ({ setModalShow }) => {
	return (
		<>
		<OverlayTrigger
					placement="top"
					overlay={
						<Popover id={"button-tooltip"}>
							<Popover.Content className="button-tooltip-text">
								Predict Crimes
							</Popover.Content>
						</Popover>
					}>
		<Button
			className="btn-display-predictions"
			variant="danger"			
			onClick={() => setModalShow(true)}>
			<i
				className="fa fa-brain fa-lg mx-4"
				title="View Crime Predictions"
			/>
			<span className="tooltip-text">Predict Crimes</span>
		</Button>
		</OverlayTrigger>
		</>
	);
};

export default ButtonShowPredictions;
