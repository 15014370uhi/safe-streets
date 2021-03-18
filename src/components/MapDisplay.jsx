import React from 'react';
import Image from 'react-bootstrap/Image';

// Functional component which displays the map image for a mapURL
const MapDisplay = ({mapURL}) => {
	const addFavourite = () => {
		//TODO add favourite functionality
		console.log('Add favourites button clicked');
	};

	return (
		<div className="mx-auto w-11/12 md:w-2/4 py-8 px-4 md:px-8">
			<button
				className="w-full py-3 bg-red-600 mt-4 text-black"
				onClick={() => {
					addFavourite();
				}}>
				Add To Favourites
			</button>
			<Image src={mapURL} />
		</div>
	);
};
export default MapDisplay;
