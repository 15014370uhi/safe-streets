import React, {useState} from 'react';
import Fire from '.././Fire';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '.././App.css';

const Login = () => {
    const [displayName, setDisplayName] = useState("");
	const [email, setEmail] = useState(''); // State to hold email input
	const [password, setPassword] = useState(''); // State to hold password input
	const [formError, setFormError] = useState(''); // State to hold form errors

	// Handle login form submit
	const handleSubmit = (e) => {
		e.preventDefault();
		//var errorText = "";
		setFormError('');

		// Call firestore sign in method
		Fire.auth()
			.signInWithEmailAndPassword(email, password)
			.then((user) => {})
			.catch((error) => {
				// Set state value for error message
				setFormError(error.message);
			});
	};

	// Handle email input changes
	const handleEmailChange = (e) => {
		// Update email state
		setEmail(e.target.value);
	};

	// Handle password input changes
	const handlePasswordChange = (e) => {
		// Update password state
		setPassword(e.target.value);
	};

	// Handle register button click
	const register = (e) => {
		e.preventDefault();

		// Call firestore create user method
		Fire.auth()
			.createUserWithEmailAndPassword(email, password)
			.then((user) => {})
			.catch((error) => {
				// Set state value for error message
				setFormError(error.message);
			});
	};

	return (
		<div className="container">
			<Form onSubmit={handleSubmit}>
				<Form.Group>
					<Form.Label>Email Address</Form.Label>
					<Form.Control
						onChange={handleEmailChange}
						type="email"
						name="email"
						placeholder="Enter email"
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>Password</Form.Label>
					<Form.Control
						onChange={handlePasswordChange}
						type="password"
						name="password"
						placeholder="Password"
					/>
				</Form.Group>

				<Button variant="primary" type="submit">
					Login
				</Button>

				<Button onClick={register} type="button" variant="danger">
					Register
				</Button>
			</Form>
			<br />
			<p>{formError}</p>
		</div>
	);
};

export default Login;
