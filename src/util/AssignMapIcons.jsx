import L from 'leaflet';

const geoapifyAPIKey = 'b0188d827da8401786390efebdbc0484'; //TODO move to env variables

//Function which returns a text label for a given crime category
export const getCrimeCategory = aCrimeCategory => {
  let crimeCat;

  
  //console.log('Crime Category: ' + JSON.stringify(aCrimeCategory));

  switch (aCrimeCategory) {   
    case 'anti-social-behaviour':
      crimeCat = 'Anti-Social Behaviour';
      break;

    case 'bicycle-theft':
    case 'other-theft':
    case 'theft-from-the-person':
      crimeCat = 'Theft';
      break;

    case 'burglary':
      crimeCat = 'Burglary';
      break;

    case 'criminal-damage-arson':
      crimeCat = 'Criminal Damage/Arson';
      break;

    case 'drugs':
      crimeCat = 'Drugs';
      break;

    case 'public-order':
    case 'other-crime':
      crimeCat = 'Public Order';
      break;

    case 'possession-of-weapons':
      crimeCat = 'Possession of Weapons';
      break;

    case 'violent-crime':
    case 'robbery':
    case 'violence-and-sexual-offences':
      crimeCat = 'Violent Crime';
      break;

    case 'vehicle-crime':
      crimeCat = 'Vehicle Crime';
      break;

    case 'shoplifting':
      crimeCat = 'Shoplifting';
      break;

    default:
      //intentially blank
      break;
  }
  return crimeCat;
};

// Function which returns the correct map icon for a crime category
export const getCrimeIcon = aCrimeCategory => {
  var icon;
  var iconName;
  var color;
  var iconType;

  //console.log('Crime Category: ' + JSON.stringify(aCrimeCategory));


  switch (aCrimeCategory) {
    case 'anti-social-behaviour':
      color = '%238a0404'; //e.g. %23 plus hex code c12b08   8a0404
      iconName = 'record-voice-over';
      iconType = 'material';
      break;    //%232b704c

    case 'bicycle-theft':
    case 'other-theft':
    case 'theft-from-the-person':
      color = 'purple';
      iconName = 'money-bill-alt';
      iconType = 'awesome';
      break;

    case 'burglary':
      color = '%23493baf';
      iconName = 'home';
      iconType = 'awesome';
      break;

    case 'criminal-damage-arson':
      color = 'orange';
      iconName = 'fire-alt';
      iconType = 'awesome';
      break;

    case 'drugs':
      color = 'brown';
      iconName = 'syringe';
      iconType = 'awesome';
      break;

    case 'public-order':
    case 'other-crime':
      color = '%23570345';
      iconName = 'group';
      iconType = 'material';
      break;

    case 'possession-of-weapons':
      color = 'red';
      iconName = 'home';
      iconType = 'awesome';
      break;

    case 'shoplifting':
      color = 'orange';
      iconName = 'shopping-cart';
      iconType = 'awesome';
      break;

    case 'violent-crime':
    case 'robbery':
    case 'violence-and-sexual-offences':
      color = '%23f40e0e';
      iconName = 'sports_kabaddi';
      iconType = 'material';
      break;

    case 'vehicle-crime':
      color = '%238884d8';
      iconName = 'car';
      iconType = 'awesome';
      break;

    default:
      //intentially blank
      break;
  };

  icon = new L.icon ({
    iconUrl: 'https://api.geoapify.com/v1/icon/?type=' +
      iconType +
      '&color=' +
      color +
      '&size=xx-large&icon=' +
      iconName +
      '&textSize=large&noWhiteCircle&scaleFactor=2&apiKey=' +
      geoapifyAPIKey,
    iconSize: [65, 90], // size of the icon
    iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
    popupAnchor: [20, -33], // point from which the popup should open relative to the iconAnchor   
  });

  //return icon;
  return icon;
};

  export const getCenterPoint = () => {

  const color = '%23572ec7';
  const iconName = 'map-marker'; //const iconName = 'adjust';
  const type = 'material'; 
  const iconType = 'awesome';

  const icon = new L.icon ({
    iconUrl: 'https://api.geoapify.com/v1/icon/?type=' + 
    type + 
    '&color=' + color + 
    '&size=xx-large&iconType=' + iconType +
    '&iconSize=large&scaleFactor=2&apiKey=' + 
    geoapifyAPIKey,
    iconSize: [75, 95], // size of the icon
    iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
    popupAnchor: [20, -33], // point from which the popup should open relative to the iconAnchor   
  });

  //return icon;
  return icon;
};


