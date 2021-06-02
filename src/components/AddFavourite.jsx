import React, {useState} from 'react';
import {addUserFavourite} from '../firebase';
import {useHistory} from 'react-router-dom';

// Style components
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBCardHeader,
  MDBBtn,
  MDBInput,
} from 'mdbreact';

const AddFavourite = props => {
  const [title, setTitle] = useState ('');
  const [mapURL, setMapURL] = useState ('');
  const [error, setError] = useState (null);
  const history = useHistory ();

  const createNewFavourite = async e => {
    e.preventDefault ();
    try {
      await addUserFavourite (title, mapURL);
    } catch (error) {
      setError ('Adding favourite' + error);
    }
    let path = `/favourites`;
    history.push (path);
  };

  // Function to handle user form input
  const onChangeHandler = e => {
    const {name, value} = e.currentTarget;
    // If mapURL input, set email state
    if (name === 'mapURL') {
      setMapURL (value);
    } else if (name === 'title') {
      // If title input, set title state
      setTitle (value);
    }
  };

  return (
    <MDBContainer>
      <MDBRow>
        <MDBCol md="6">
          <MDBCard>
            <MDBCardBody>
              <MDBCardHeader className="form-header bg-primary rounded">
                <MDBIcon className='iconDeleteAccount' size='md' icon='user' />
                <label>Add new favourite</label>
              </MDBCardHeader>
              <form>
                <div className="grey-text">
                  <MDBInput
                    required
                    label="Enter a title"
                    size="lg"
                    group
                    type="text"
                    name="title"
                    validate
                    error="wrong"
                    success="right"
                    value={title}
                    onChange={e => onChangeHandler (e)}
                  />

                  <MDBInput
                    required
                    label="Enter a mapURL"
                    size="lg"
                    group
                    type="text"
                    name="mapURL"
                    validate
                    error="Badly formed mapURL"
                    success="Correctly formed mapURL"
                    value={mapURL}
                    onChange={e => onChangeHandler (e)}
                  />
                </div>

                <div className="text-center mt-4">
                  {error !== null &&
                    <div className="py-4 bg-red-600 w-full text-red text-center mb-3">
                      {error}
                    </div>}
                  <MDBBtn
                    color="light-blue"
                    className="mb-3"
                    type="submit"
                    onClick={e => {
                      createNewFavourite (e, title, mapURL);
                    }}
                  >
                    Add New Favourite
                  </MDBBtn>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};
export default AddFavourite;
