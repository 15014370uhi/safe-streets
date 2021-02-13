import React, {useState} from 'react';
import {Link} from '@reach/router';
import {auth, generateUserDocument} from '../firebase';

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

const Register = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [displayName, setDisplayName] = useState('');
	const [error, setError] = useState(null);

	const createUserWithEmailAndPasswordHandler = async (
		e,
		email,
		password
	) => {
		e.preventDefault();
		try {
			const {user} = await auth.createUserWithEmailAndPassword(
				email,
				password
			);
			generateUserDocument(user, {displayName});
		} catch (error) {
			setError('Error creating user with email and password');
		}
		setEmail('');
		setPassword('');
		setDisplayName('');
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
										className="dark-grey-text font-weight-bold ml-1">
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
