import React, { useState } from "react";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

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
} from "mdbreact";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);

	// sign in user with firebase sign in method
	const signInWithEmailAndPasswordHandler = (e, email, password) => {
		e.preventDefault();

		// sign user in with firebase sign in method
		auth.signInWithEmailAndPassword(email, password).catch((error) => {
			setError("" + error);
		});
	};

	// Function to handle user form input
	const onChangeHandler = (e) => {
		const { name, value } = e.currentTarget;
		// if email input set email state
		if (name === "email") {
			setEmail(value);
		} else if (name === "password") {
			// if password input, set password state
			setPassword(value);
		}
	};

	return (
		<MDBContainer className="login-container">
			<MDBRow>
				<MDBCol md="7">
					<MDBCard>
						<MDBCardBody>
							<MDBCardHeader className="form-header bg-primary rounded">
								<h1 className="my-3">
									<MDBIcon
										className="login-icon-lock"
										icon="lock"
										size="lg"
									/>
									Login
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
										required
										value={email}
										onChange={(e) => onChangeHandler(e)}
									/>

									<MDBInput
										label="Type your password"
										size="lg"
										icon="lock"
										autoComplete="current-password"
										required
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
										color="blue"
										className="btn-login mb-3"
										type="submit"
										onClick={(e) => {
											signInWithEmailAndPasswordHandler(
												e,
												email,
												password
											);
										}}>
										Login
									</MDBBtn>
								</div>
							</form>

							<MDBModalFooter>
								<div className="font-weight-light main-link">
									Don't have an account?
									<Link
										to="/register"
										strong="true"
										className="py-4 font-weight-bold ml-1 w-full text-red text-center mb-3">
										Register
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
export default Login;
