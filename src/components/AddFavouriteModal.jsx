import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {addUserFavourite} from '../firebase';

// Style components
import {	
	MDBInput,
} from 'mdbreact';


function AddFavouriteModal (props) {
  const [title, setTitle] = useState ('');  //TODO check for cross site scripting
  const [description, setDescription] = useState (''); //TODO check for cross site scripting
  const [error, setError] = useState (null);

  //function which adds a new user favourite
  const createNewFavourite = async e => {
    try {
      await addUserFavourite (title, description, props.mapURL);
    } catch (error) {
      setError ('Adding favourite' + error);
    }   
  };

  // Function to handle user form input
    const onChangeHandler = (e) => {
		const {name, value} = e.currentTarget;
		// If title input, set title state
		if (name === 'title') {
			setTitle(value);
		} else if (name === 'description') {
			// If description input, set description state
			setDescription(value);           
		}
	};

  const addFavourite = () => {

    props.onHide(); //hide form

    //TODO TEST 
    console.log ('Add favourites button clicked with: ' 
    + title + "\n" 
    + description + "\n" 
    + props.mapURL);

    //create new favourite for user record
    createNewFavourite();
  };

  return (
    <Modal {...props} size="lg" centered>

      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add New Favourite Location
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>       
        <div className="grey-text">
									<MDBInput
										required
										label="Add a title"	
										size="lg"									
										group
										type="text"
										name="title"
										validate
										error="wrong"
										success="right"
										value={title}
										onChange={(e) => onChangeHandler(e)} 
                                        />				

                                        <MDBInput
										required
										label="Add a description"	
										size="lg"									
										group
										type="text"
										name="description"
										validate
										error="wrong"
										success="right"
										value={description}
										onChange={(e) => onChangeHandler(e)} 
                                        />								
      </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="red" onClick={props.onHide}>CANCEL</Button>
        <Button variant="green" type="submit" onClick={() => addFavourite()}>Save Favourite</Button>      
      </Modal.Footer>
    
    </Modal>
  );
}

export default AddFavouriteModal;
