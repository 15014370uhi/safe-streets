import L from "leaflet";

const geoapifyAPIKey = "b0188d827da8401786390efebdbc0484";

// function which returns a text label for a given crime category
export const getCrimeCategory = (aCrimeCategory) => {
	let crimeCat;

	switch (aCrimeCategory) {
		case "anti-social-behaviour":
			crimeCat = "Anti-Social Behaviour";
			break;

		case "burglary":
			crimeCat = "Burglary";
			break;

		case "criminal-damage-arson":
			crimeCat = "Criminal Damage/Arson";
			break;

		case "drugs":
			crimeCat = "Drugs";
			break;

		case "possession-of-weapons":
			crimeCat = "Possession of Weapons";
			break;

		case "public-order":
		case "other-crime":
			crimeCat = "Public Order";
			break;

		case "robbery":		
			crimeCat = "Robbery";
			break;

		case "shoplifting":
			crimeCat = "Shoplifting";
			break;

		case "theft-from-the-person":
		case "bicycle-theft":
		case "other-theft":		
			crimeCat = "Theft";
			break;

		case "vehicle-crime":
			crimeCat = "Vehicle Crime";
			break;
	
		case "violent-crime":		
		case "violence-and-sexual-offences":
			crimeCat = "Violent Crime";
			break;	

		default:
			//intentially blank
			break;
	}
	return crimeCat;
};

// function which returns the correct map icon for a crime category
export const getCrimeIcon = (aCrimeCategory, isForButton) => {
	var icon;
	var iconName;
	var color;
	var iconType;

	switch (aCrimeCategory) {
		case "anti-social-behaviour":
			color = "darkslateblue"; //e.g. %23 plus hex code c12b08
			iconName = "record-voice-over";
			iconType = "material";
			break;

		case "burglary":
			color = "hotpink";
			iconName = "home";
			iconType = "awesome";
			break;

		case "criminal-damage-arson":
			color = "orangered";
			iconName = "fire-alt";
			iconType = "awesome";
			break;

		case "drugs":
			color = "brown";
			iconName = "syringe";
			iconType = "awesome";
			break;

		case "possession-of-weapons":
			color = "red";
			iconName = "fist-raised";
			iconType = "awesome";
			break;		

		case "public-order":
		case "other-crime":
			color = "%23570345";
			iconName = "bullhorn";
			iconType = "awesome";
			break;
		
		case "robbery":
			color = "olive";
			iconName = "cash-register";
			iconType = "awesome";
			break;

		case "shoplifting":
			color = "gold";
			iconName = "shopping-cart";
			iconType = "awesome";
			break;

		case "theft-from-the-person":
		case "bicycle-theft":
		case "other-theft":		
			color = "blue";
			iconName = "money-bill-alt";
			iconType = "awesome";
			break;

		case "vehicle-crime":
			color = "%238884d8";
			iconName = "car";
			iconType = "awesome";
			break;

		case "violent-crime":		
		case "violence-and-sexual-offences":
			color = "black";
			iconName = "sports_kabaddi";
			iconType = "material";
			break;

		default:
			//intentially blank
			break;
	}

	if (isForButton) {
		// create icon for filter button
		var size = "x-large"; //x-large, large, small (default medium no need to declare)

		icon = new L.icon({
			iconUrl:
				"https://api.geoapify.com/v1/icon/?type=circle&color=" +
				color +
				"&size=" +
				size +
				"&icon=" +
				iconName +
				"&iconType=" +
				iconType +
				"&iconSize=large&noShadow&noWhiteCircle&apiKey=" +
				geoapifyAPIKey,
			iconSize: [75, 95], // size of the icon
		});
	} else {
		// create icon for map icons
		icon = new L.icon({
			iconUrl:
				"https://api.geoapify.com/v1/icon/?type=" +
				iconType +
				"&color=" +
				color +
				"&size=xx-large&icon=" +
				iconName +
				"&textSize=large&noWhiteCircle&scaleFactor=2&apiKey=" +
				geoapifyAPIKey,
			iconSize: [65, 90], // size of the icon
			iconAnchor: [15.5, 42], // point of icon corresponding to marker location
			popupAnchor: [20, -33], // point popup is relative to the iconAnchor
		});
	}
	return icon;
};

export const getCenterPoint = () => {
	const color = "red"; //const color = "%23572ec7";
	const type = "awesome"; //const type = "material";
	const iconType = "awesome";
	const iconName = "search" 

	const icon = new L.icon({
		iconUrl:
			"https://api.geoapify.com/v1/icon/?type=" +
			type +
			"&color=" +
			color +
			"&icon=" + 
			iconName + 
			"&size=xx-large&iconType=" +
			iconType +
			"&iconSize=large&noWhiteCircle&scaleFactor=2&apiKey=" +			
			geoapifyAPIKey,
		iconSize: [95, 130], // size of the icon
		iconAnchor: [15.5, 42], // point of icon corresponding to marker location
		popupAnchor: [20, -33], // point popup is relative to the iconAnchor
	});
	return icon;
};
