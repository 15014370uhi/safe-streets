import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import { ResultsData } from "../contexts/ResultsDataContext";
import Spinner from "react-bootstrap/Spinner";

const ButtonShowWarnings = ({ setModalShow, analysisComplete }) => {
	const [resultsData, setResultsData] = useContext(ResultsData);

	
	var variant = "success";
	var threatText = resultsData.threatLevel;
	
	if (resultsData.threatLevel === "Medium") {
		variant = "warning";			
	} else if (resultsData.threatLevel === "High") {
		variant = "danger";			
	}	

	return (
		<React.Fragment>
			{analysisComplete ? (
				<Button
					className="btn-show-warnings"
					variant={variant}
					title="Show warnings"
					onClick={() => setModalShow(true)}>
					<i
						className="fa fa-exclamation-triangle fa-2x mx-4"
						title="Warning"
					/>
					<span className="tooltip-text">
						Threat level: {threatText}
					</span>
				</Button>
			) : (
				<Button
					className="btn-show-warnings"
					variant="Info"
					title="Show warnings">
					<i
						className="fa fa-exclamation-triangle fa-2x mx-4"
						title="Warning"
					/>
					<span className="tooltip-text">
						Analysing Threats...
						<Spinner
							as="span"
							animation="border"
							role="status"
							aria-hidden="true"
							variant="danger"
						/>
					</span>
				</Button>
			)}
		</React.Fragment>
	);
};

export default ButtonShowWarnings;
