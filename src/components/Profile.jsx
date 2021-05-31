import React, {useContext, useState, useEffect} from 'react';
import {UserContext} from '../auth/UserProvider';
import {MapDetails} from '.././contexts/MapDetailsContext';
import {Redirect} from '@reach/router';
import {
	auth,
	deleteUserDocument,
	deleteUserAccount,
	reauthenticateUser,
} from '../firebase';
import uuid from 'react-uuid';
import firebase from 'firebase';
import {useHistory} from 'react-router-dom';

import {
	MDBCard,
	MDBCardBody,
	MDBCardHeader,
	MDBCardLink,
	MDBListGroup,
	MDBListGroupItem,
	MDBCardFooter,
	MDBCardText,
	MDBBtn,
	MDBContainer,
	MDBIcon,
	MDBInput,
} from 'mdb-react-ui-kit';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Profile = () => {
	const [localFavourites, setLocalFavourites] = useState([]);
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const user = useContext(UserContext);
	const [mapDetails, setMapDetails] = useContext(MapDetails);

	//TODO add icon choice for favourite - Long Term ?????????

	// Modal dialog state for user account deletion
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const history = useHistory();

	useEffect(() => {
		getUserDetails();
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//function which retrieves the favourites for a user
	const getUserDetails = async () => {
		if (user) {
			var userRef = await firebase
				.firestore()
				.collection('users')
				.doc(user.uid);
			userRef
				.get()
				.then(function (doc) {
					if (doc.exists) {
						//set favourites to all user favourites
						setLocalFavourites(doc.data().favourites);
					} else {
						console.log('No favourites!');
					}
				})
				.catch(function (error) {
					console.log('Error getting favourites:', error);
				});
		}
	};

	// Function which handles user input changes
	const onChangeHandler = (e) => {
		const {value} = e.currentTarget;
		setPassword(value);
	};

	//sign out user
	const onSignOutHandler = async () => {
		await auth
			.signOut()
			.then((data) => console.log(data))
			.catch((err) => console.log(err));
	};

	//function to delete the current user's account
	const deleteUserHandler = async (e) => {
		//reauthenticate user with password input
		await reauthenticateUser(password) //TODO added await here <<< wait for success message before redirecting to register
			.then((res) => {
				console.log('User reauthenticated successfully: ', res);

				//delete all user document data from firestore
				deleteUserDocument()
					.then((res) => {
						console.log('User Document successfully deleted', res);

						//delete user authentication account entry from firebase
						deleteUserAccount()
							.then((res) => {
								//redirect to register page
								let path = `/register`;
								history.push(path);
							})
							.catch((error) => {
								console.log('Error deleting user data', error);
							});
					})
					.catch((error) => {
						setError(error.message);
						console.log('Error deleting user document', error);
					});
			})
			.catch((error) => {
				setError(error.message);
				console.log('Error deleting user account', error);
			});
	};

	//display favourited map which was clicked on
	const displayMap = (aFavourite) => {
		setMapDetails({
			mapURL: aFavourite.mapURL,
			locationname: aFavourite.locationname,
			isnamesearch: aFavourite.isnamesearch,
			lat: aFavourite.lat,
			lon: aFavourite.lon,
			numberofmonths: aFavourite.numberofmonths,
			filters: aFavourite.filters,
		});
		//redirect to register user page
		history.push(`/results`, {
			isfavourite: 'true', //boolean flag to determine if map a previously favourited or new search
		});
	};

	return (
		<React.Fragment>
			{user ? (
				<MDBCard className="profile-card">
					<MDBCardHeader className="profile-heading">
						<h1 className="profile-main-heading">Profile</h1>
					</MDBCardHeader>
					<MDBCardBody>
						<MDBCardText>
							<label className="profile-text">
								Email: {user.email}
							</label>
						</MDBCardText>
					</MDBCardBody>
					<MDBCardHeader className="profile-heading">
						<h2 className="profile-main-heading">Favourites</h2>
					</MDBCardHeader>
					<MDBListGroup flush>
						{localFavourites.map((favourite) => (
							<div
								key={uuid()}
								className="profile-list-favourite-item"
								onClick={() => {
									displayMap(favourite);
								}}>
								<MDBListGroupItem className="profile-favourites-list">
									<MDBCardLink>
										<label className="profile-text  profile-favourite-entry">
											{favourite.title}
										</label>
									</MDBCardLink>
								</MDBListGroupItem>
							</div>
						))}
					</MDBListGroup>

					<MDBCardFooter className="profile-footer">
						<MDBBtn
							color="primary"
							className="mb-3 profile-footer-button"
							type="submit"
							onClick={onSignOutHandler}>
							Logout
						</MDBBtn>
						<MDBBtn
							color="danger"
							className="mb-3 profile-footer-button"
							type="submit"
							onClick={handleShow}>
							Delete Account
						</MDBBtn>
					</MDBCardFooter>

					<Modal show={show} onHide={handleClose} animation={false}>
						<MDBContainer>
							<MDBIcon size="3x" icon="user" />
							{user.email}
							<br />
							<Modal.Title>
								<p>
									To permanently delete your account, please
									confirm your password.
								</p>
							</Modal.Title>
						</MDBContainer>

						<Modal.Body>
							<div>
								<MDBInput
									icon="lock"
									type="password"
									name="password"
									placeholder="Enter your password..."
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
							</div>
						</Modal.Body>

						<Modal.Footer>
							<Button variant="primary" onClick={handleClose}>
								Cancel
							</Button>
							<Button
								variant="danger"
								onClick={deleteUserHandler}>
								Delete My Account
							</Button>
						</Modal.Footer>
					</Modal>
				</MDBCard>
			) : (
				<Redirect noThrow to="/" />
			)}
		</React.Fragment>
	);
};
export default Profile;

// TODO add favourites using actual favourites list
