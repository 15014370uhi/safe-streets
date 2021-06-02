import React, {useState} from 'react';
import {createUserWithEmailAndPassword} from '../firebase';
import {Link, useHistory} from 'react-router-dom';

//styled components
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
	const [formError, setFormError] = useState(null);
	const history = useHistory();

	const createUserWithEmailAndPasswordHandler = async (e) => {
		e.preventDefault();

		createUserWithEmailAndPassword(email, password).then((res) => {
			if (res !== true) {
				//error creating user
				setFormError(res); //set error message
			} else {
				let path = `/search`; //success, redirect to search page
				history.push(path);
			}
		});
	};

	const onChangeHandler = (e) => {
		const {name, value} = e.currentTarget;
		if (name === 'email') {
			setEmail(value);
		} else if (name === 'password') {
			setPassword(value);
		}
	};

	return (
		<MDBContainer>
			<MDBRow>
				<MDBCol md="7">
					<MDBCard>
						<MDBCardBody>
							<MDBCardHeader className="form-header bg-primary rounded">
								<h1 className="my-3">
									<MDBIcon className='register-icon-user' icon="user-circle" size='lg'/> Sign Up
								</h1>
							</MDBCardHeader>
							<form className="login-sign-header">
								<div className="grey-text login-sign-topinput">
									<MDBInput
										label="Type your email"
										size="lg"
										icon="envelope"
										autoComplete="email"
										autoFocus
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
										size="lg"
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
									{formError !== null && (
										<div className="py-4 bg-red-600 w-full text-red text-center mb-3">
											{formError}
										</div>
									)}

									<MDBBtn
										color="blue"
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
