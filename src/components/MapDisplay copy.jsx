import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/col';
import Row from 'react-bootstrap/row';
import AddFavouriteModal from './AddFavouriteModal';
import RemoveFavouriteModal from './RemoveFavouriteModal';
import ButtonRemoveFromFavs from './ButtonRemoveFromFavs';

//TODO need add favourites method passed as props maybe?
//TODO OR api call to add it to favourties - check how favourites page did it
// Functional component which displays the map image for a mapURL
const MapDisplay = (props) => {

  //state for modal screen
  const [modalShow, setModalShow] = useState (false);
  
  const [removeFavModalShow, setRemoveFavModalShow] = useState (false);
  const [isFavourite, setIsFavourite] = useState (false);
  let history = useHistory ();

  const showFavourites = e => {
    let path = `/favourites`; //TODO get path of calling page maybe as prop
    history.push (path);
  };

  const goBack = e => {

//TODO set display map to false 
//todo redirect to previous page using history
  }

  return (
    <Col className="mt-4 pt-0 col-map-display">        
      <AddFavouriteModal
        mapurl={history.location.state?.mapurl}
        show={modalShow}
        onHide={() => setModalShow (false)}
      />

<RemoveFavouriteModal
        mapurl={history.location.state?.title}
        show={removeFavModalShow}
        onHide={() => setRemoveFavModalShow (false)}
      />

      <Row className="row-map">
      <Button  className="btn-back" variant="secondary" onClick={() => history.goBack ()}>
          <i className="fa fa-arrow-left fa-lg mx-2" />         
        </Button>      

    <ButtonRemoveFromFavs  
      setmodalshow={setModalShow} 
    />

      <Button
      className=
        {history.location.state?.isfavourite === 'true'
						? 'w-full py-3 btn-delete-favourite'
						: 'w-full py-3 btn-favourites' 
				}

        variant=
        {history.location.state?.isfavourite === 'true'
						? 'danger'
						: 'success' 
				}

        title=
        {history.location.state?.isfavourite === 'true'
						? 'Delete from favourites'
						: 'Add to favourites' 
				}
        
        onClick={() => setModalShow (true)}
      >
       {history.location.state?.isfavourite === 'true' ? (	
        <i className="fa fa-minus fa-lg mx-4" aria-hidden="true" />    
       ):(
        <i className="fa fa-plus fa-lg mx-4" aria-hidden="true" />    
       )}
           
      </Button>
        <Image className="mapDisplay" src={history.location.state?.mapurl} />
      </Row>
    </Col>
  );
};
export default MapDisplay;
