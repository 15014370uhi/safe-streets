import React from "react";
import Button from "react-bootstrap/Button";

const ButtonFilterCrime = (props) => {
	
	return (
		<Button
			className={
				props.isActive ? "btn-filter-active" : "btn-filter-inactive"
			}
			id={props.id}
			onClick={() => props.changeFilterState(props.label)}>
			<img className="filter-icon"
				src={props.getCrimeIcon(props.id, true).options.iconUrl}
				alt={props.label}
			/>
			<span className="filter-text">{props.label}</span>
			
			<i
				className={
					props.isActive
						? "fa fas fa-check fa-sm filter-button-icon"
						: "fa fas fa-times fa-sm filter-button-icon"
				}
			/>
		</Button>
	);
};

export default ButtonFilterCrime;
