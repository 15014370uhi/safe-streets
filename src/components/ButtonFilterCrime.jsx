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
			<i
				className={
					props.isActive
						? "fa fas fa-check fa-2x"
						: "fa fas fa-times fa-2x"
				}
			/>
			{props.label}
		</Button>
	);
};

export default ButtonFilterCrime;
