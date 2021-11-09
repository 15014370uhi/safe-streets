import React from "react";
import Button from "react-bootstrap/Button";

const ButtonShowWarnings = ({ setModalShow, threatLevel}) => {
	console.log('Button received threat level: ' + threatLevel);

	var variant = "success";

	const getVariant = (aThreatLevel) => {
		if(aThreatLevel === "yellow"){
			variant = "warning";
		} else if (aThreatLevel === "red"){
			variant = "danger";
		}
	};

	getVariant(threatLevel);

	
	return (
		<Button
			className="btn-show-warnings"
			variant={variant}	
			title="Show warnings"
			onClick={() => setModalShow(true)}>
			<i
				className="fa fa-exclamation-triangle fa-2x mx-4"
				title="Warning"
			/>
			<span className="tooltip-text">Crime Alerts!</span>
		</Button>
	);
};

export default ButtonShowWarnings;
