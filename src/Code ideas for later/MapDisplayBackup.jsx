import React from 'react';

// Functional component which displays the map image for a mapURL
const MapDisplay = ({mapURL}) => {	

	const addFavourite = () => {
		//TODO add favourite functionality
		console.log("Add favourites button clicked");
	};
	
	return (
		<div className="mx-auto w-11/12 md:w-2/4 py-8 px-4 md:px-8">
			<div className="flex border flex-col items-center md:flex-row md:items-start border-blue-400 px-3 py-4">
				<div
					style={{
						background: `url(${
							mapURL ||
							'https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png'
						})  no-repeat center center`,
						backgroundSize: 'cover',
						height: '200px',
						width: '200px',
					}}
					className="border border-blue-300"></div>				
			</div>
			<button
				className="w-full py-3 bg-red-600 mt-4 text-white"
				onClick={() => {
					addFavourite();
				}}>
				Add To Favourites
			</button>
		</div>
	);
};
export default MapDisplay;
