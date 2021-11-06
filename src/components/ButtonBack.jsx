import React from "react";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";

const ButtonFilter = (props) => {
	let history = useHistory();

	return (
		<Button
			className="btn-back"
			variant="secondary"
			onClick={() => history.goBack()}>
			<i className="fa fa-arrow-left fa-lg mx-2" />
		</Button>
	);
};

export default ButtonFilter;
