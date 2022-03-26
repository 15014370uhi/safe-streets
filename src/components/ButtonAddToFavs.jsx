import React from "react";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const ButtonAddToFavs = ({ setModalShow }) => {
	return (
		<>
		<OverlayTrigger
					placement="left"
					rootClose={true}
					overlay={
						<Popover id={"button-tooltip"}>
							<Popover.Content>
							<h2 className="button-tooltip-text">Add to favourites</h2>
							</Popover.Content>
						</Popover>
					}>
		<Button
			className="w-full py-3 btn-add-to-favourites"
			variant="success"
			title="Add to favourites"
			onClick={() => setModalShow(true)}>
			<i className="fa fa-plus fa-lg mx-4" />
		</Button>
		</OverlayTrigger>
		</>
	);
};

export default ButtonAddToFavs;
