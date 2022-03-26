import React from "react";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const ButtonRemoveFromFavs = ({ setModalShow }) => {
	return (
		<>
		<OverlayTrigger
					placement="left"
					rootClose={true}
					overlay={
						<Popover id={"button-tooltip"}>
							<Popover.Content className="button-tooltip-text">
								Delete from favourites
							</Popover.Content>
						</Popover>
					}>
		<Button
			className="w-full py-3 btn-delete-favourite"
			variant="danger"		
			onClick={() => setModalShow(true)}>
			<i className="fa fa-minus fa-lg mx-4" />
		</Button>
		</OverlayTrigger>
		</>
	);
};

export default ButtonRemoveFromFavs;
