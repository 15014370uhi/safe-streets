// TODO Move this to a function within user context or firebase.
import React, {useContext, useState} from 'react';
import {addUserFavourite} from '../firebase';
import {UserContext} from '../auth/UserProvider';
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

const AddFavourite = (props) => {
	const [title, setTitle] = useState('');
	const [mapURL, setMapURL] = useState('');
	const [error, setError] = useState(null);

    const user = useContext (UserContext); // Get User Context
	const history = useHistory();

    const createNewFavourite = async (e) => {
		e.preventDefault();		
		try {			
			await addUserFavourite(user, title, mapURL);			
        } 
        catch (error) {
			setError('Adding favourite' + error);
		}				
		//console.log("about to redirect");
		//return( <div><Redirect to={'/search'} /> </div> );	
		let path = `/favourites`; 
		history.push(path);	
	};

// TODO doesn't redirect properly
	// Function to handle user form input
	const onChangeHandler = (e) => {
		const {name, value} = e.currentTarget;
		// If email input set email state
		if (name === 'mapURL') {
			setMapURL(value);
		} else if (name === 'title') {
			// If password input, set password state
			setTitle(value);           
		}
	};

	return (
		<MDBContainer>
			<MDBRow>
				<MDBCol md="6">
					<MDBCard>
						<MDBCardBody>
							<MDBCardHeader className="form-header bg-primary rounded">
								<h3 className="my-3">
									<MDBIcon icon="lock" /> Add new favourite:
								</h3>
							</MDBCardHeader>
							<form>
								<div className="grey-text">
									<MDBInput
										label="Enter a title"										
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
										label="Enter a mapURL"									
										group
										type="text"
										name="mapURL"
										validate
										value={mapURL}
										onChange={(e) => onChangeHandler(e)}
									/>
								</div>

								<div className="text-center mt-4">
									{error !== null && (
										<div className="py-4 bg-red-600 w-full text-red text-center mb-3">
											{error}
										</div>
									)}
									<MDBBtn
										color="light-blue"
										className="mb-3"
										type="submit"
										onClick={(e) => {
											createNewFavourite(
												e,
												title,
												mapURL
											);
										}}>
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
