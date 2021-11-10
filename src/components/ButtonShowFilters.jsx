import React from "react";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const ButtonShowFilters = ({ setModalShow }) => {
	return (
		<>
		<OverlayTrigger
					placement="left"
					overlay={
						<Popover id={"button-tooltip"}>
							<Popover.Content className="button-tooltip-text">
								Filter Crimes
							</Popover.Content>
						</Popover>
					}>
		<Button
			className="btn-open-filter"
			variant="dark"
			onClick={() => setModalShow(true)}>
			<i className="fa fa-filter fa-lg mx-2" />
		</Button>
		</OverlayTrigger>
		</>
	);
};

export default ButtonShowFilters;
