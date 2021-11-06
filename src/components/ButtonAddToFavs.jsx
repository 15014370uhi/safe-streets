import React from "react";
import Button from "react-bootstrap/Button";

const ButtonAddToFavs = ({ setModalShow }) => {
	return (
		<Button
			className="w-full py-3 btn-add-to-favourites"
			variant="success"
			title="Add to favourites"
			onClick={() => setModalShow(true)}>
			<i className="fa fa-plus fa-lg mx-4" />
		</Button>
	);
};

export default ButtonAddToFavs;
