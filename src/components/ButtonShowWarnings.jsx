import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import { ResultsData } from "../contexts/ResultsDataContext";
import Spinner from "react-bootstrap/Spinner";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const ButtonShowWarnings = ({ setModalShow, analysisComplete }) => {
	const [resultsData] = useContext(ResultsData);

	var variant = "success";
	var threatText = resultsData.threatLevel;

	if (resultsData.threatLevel === "Medium") {
		variant = "warning";
	} else if (resultsData.threatLevel === "High") {
		variant = "danger";
	}

	return (
		<>
			{analysisComplete ? (
				<OverlayTrigger
					placement="bottom"
					rootClose={true}
					overlay={
						<Popover id={"button-tooltip"}>
							<Popover.Content className="button-tooltip-text">
								Crime Alerts
							</Popover.Content>
						</Popover>
					}>
					<Button
						className="btn-show-warnings"
						variant={variant}
						onClick={() => setModalShow(true)}>
						<i className="fa fa-exclamation-triangle fa-2x mx-4" />
						<span className="tooltip-text">
							Threat level: {threatText}
						</span>
					</Button>
				</OverlayTrigger>
			) : (
				<Button
					className="btn-show-analysis"
					variant="light"
					title="Show warnings">
					<i
						className="fa fa-exclamation-triangle fa-2x mx-4"
						title="Warning"
					/>
					<span className="tooltip-text">
						Analysing Threats....{' '} 
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
		</>
	);
};

export default ButtonShowWarnings;
