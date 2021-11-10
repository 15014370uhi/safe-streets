import React from "react";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const ButtonFilter = (props) => {
	let history = useHistory();

	return (
		<>
		<OverlayTrigger
					placement="right"
					overlay={
						<Popover id={"button-tooltip"}>
							<Popover.Content className="button-tooltip-text">Back
							</Popover.Content>
						</Popover>
					}>
		<Button
			className="btn-back"
			variant="secondary"
			onClick={() => history.goBack()}>
			<i className="fa fa-arrow-left fa-lg mx-2" />
		</Button>
		</OverlayTrigger>
		</>
	);
};

export default ButtonFilter;
