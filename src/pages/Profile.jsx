import React, {useContext, useState, useEffect} from 'react';
import {UserContext} from '../auth/UserProvider';
import {MapDetails} from '../contexts/MapDetailsContext';
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

	//modal dialog state for user account deletion
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const history = useHistory();

	useEffect(() => {
		getUserDetails();
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//remove a favourite from a user's collection of all favourites
	const deleteFavourite = (aFavourite) => {
		var userRef = firebase.firestore().collection('users').doc(user.uid);
		userRef
			.get()
			.then(function (doc) {
				if (doc.exists) {
					const favouritesToKeep = doc
						.data()
						.favourites.filter(
							(favourite) =>
								favourite.mapURL !== aFavourite.mapURL
						);
					//update firestore doc with the filtered favourites
					userRef.update({
						favourites: favouritesToKeep,
					});

					//update favourites state
					setLocalFavourites(favouritesToKeep);
				} else {
					console.log('No favourites!');
				}
			})
			.catch(function (error) {
				console.log('Error getting favourites:', error);
			});
	};

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

	//function which handles user input changes
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
		await reauthenticateUser(password)
			.then((res) => {
				console.log('User reauthenticated successfully: ', res);

				//delete all user document data from firestore
				deleteUserDocument()
					.then((res) => {
						console.log('User Document successfully deleted', res);

						//delete user authentication account entry from firebase
						deleteUserAccount()
							.then((res) => {
								console.log(
									'User Authentication Account successfully deleted'
								);

								alert(
									'Your account and saved data has been sucessfully deleted.'
								);

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
						<h2 className="profile-main-heading">
							Favourites ({localFavourites.length})
						</h2>
					</MDBCardHeader>
					<MDBListGroup flush>
						{localFavourites.map((favourite) => (
							<div
								key={uuid()}
								className="profile-list-favourite-item">
								<MDBListGroupItem className="profile-favourites-list">
									<MDBCardLink>
										<label
											className="profile-text profile-favourite-entry"
											onClick={() => {
												displayMap(favourite);
											}}>
											{favourite.title}
										</label>
									</MDBCardLink>
									<i
										className="far fa-trash-alt fa-lg trash-profile"
										onClick={() => {
											deleteFavourite(favourite);
										}}
									/>
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
							<MDBIcon
								className="iconDeleteAccount"
								size="md"
								icon="user"
							/>
							<label className="deleteAccountEmail">
								{user.email}
							</label>
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
									autoFocus
									value={password}
									onChange={(e) => onChangeHandler(e)}
								/>
							</div>
							<div className="text-center mt-4 delete-profile-error">
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
