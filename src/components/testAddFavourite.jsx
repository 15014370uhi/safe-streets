import React, {useState, useContext} from 'react';
import {auth, generateUserDocument, addUserFavourite} from '../firebase';
import {Link, Redirect} from 'react-router-dom';
import {UserContext} from '../auth/UserProvider';

// TODO get list of errors and show them properly


// Style components
import {
	MDBContainer,
	MDBRow,
	MDBCol,
	MDBCard,
	MDBCardBody,
	MDBModalFooter,
	MDBIcon,
	MDBCardHeader,
	MDBBtn,
	MDBInput,
} from 'mdbreact';

const TestAddFavourite = (props) => {
	const [title, setTitle] = useState('');
	const [mapURL, setMapURL] = useState('');
    const [error, setError] = useState('');
    const user = useContext (UserContext); // Get User Context	const [error, setError] = useState(null);

	const createNewFavouriteHandler = async (event, title, mapURL) => {    
    
		event.preventDefault();
		try {
			await addUserFavourite(user, title, mapURL);
		} catch (error) {
			setError('Error creating user with email and password');
		}		
        return( <div><Redirect to={'/search'} /> </div> );		
	};


	const onChangeHandler = (e) => {
		const {name, value} = e.currentTarget;
		if (name === 'email') {
			setEmail(value);
		} else if (name === 'password') {
			setPassword(value);
		} else if (name === 'displayName') {
			setDisplayName(value);
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
									<MDBIcon icon="user-circle" /> Sign Up:
								</h3>
							</MDBCardHeader>
							<form>
								<div className="grey-text">
									<MDBInput
										label="Your Username"
										icon="user"
										group
										type="text"
										name="displayName"
										value={displayName}
										validate
										error="wrong"
										success="right"
										onChange={(event) =>
											onChangeHandler(event)
										}
									/>

									<MDBInput
										label="Type your email"
										icon="envelope"
										group
										type="email"
										name="email"
										validate
										error="wrong"
										success="right"
										value={email}
										onChange={(e) => onChangeHandler(e)}
									/>

									<MDBInput
										label="Type your password"
										icon="lock"
										group
										type="password"
										name="password"
										validate
										value={password}
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
										onClick={(event) => {
											createNewFavouriteHandler(
												event,
												title,
												mapURL
											);
										}}>
										Sign Up
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
export default TestAddFavourite;
