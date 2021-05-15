import React, {useState} from 'react';
import {generateUserDocument, createUserWithEmailAndPassword} from '../firebase';
//import {auth, generateUserDocument, createUserWithEmailAndPassword} from '../firebase';

import {Link, useHistory} from 'react-router-dom';


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

const Register = (props) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);

	const history = useHistory();

	
	// TODO move this to firebase
	const createUserWithEmailAndPasswordHandler = async (e) => {
		e.preventDefault();
		try {
			const {user} = createUserWithEmailAndPassword(email, password);
			//console.log("Created user with email: " + user.email);
			generateUserDocument(user);
		} catch (error) {
			setError('Error creating user with email and password');
		}	
		// Redirect URL
		let path = `/search`; 
		history.push(path);	
	};

	// const createUserWithEmailAndPasswordHandler = async (e) => {
	// 	e.preventDefault();
	// 	try {
	// 		const {user} = await auth.createUserWithEmailAndPassword(email, password);
	// 		//console.log("Created user with email: " + user.email);
	// 		generateUserDocument(user);
	// 	} catch (error) {
	// 		setError('Error creating user with email and password');
	// 	}	
	// 	// Redirect URL
	// 	let path = `/search`; 
	// 	history.push(path);	
	// };


	const onChangeHandler = (e) => {
		const {name, value} = e.currentTarget;
		if (name === 'email') 
		{
			setEmail(value);
		} 
		else if (name === 'password') 
		{
			setPassword(value);
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
										label="Type your email"
										icon="envelope"
										autoComplete="email"
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
										autoComplete="new-password"
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
											createUserWithEmailAndPasswordHandler(
												event,
												email,
												password
											);
										}}>
										Sign Up
									</MDBBtn>
								</div>
							</form>

							<MDBModalFooter>
								<div className="font-weight-light">
									Already have an account?
									<Link
										to="/"
										className="py-4 font-weight-bold ml-1 w-full text-red text-center mb-3">
										Login here
									</Link>
								</div>
							</MDBModalFooter>
						</MDBCardBody>
					</MDBCard>
				</MDBCol>
			</MDBRow>
		</MDBContainer>
	);
};
export default Register;
