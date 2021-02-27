import React, {useContext} from 'react';
import Favourite from './Favourite';
import {UserContext} from '../auth/UserProvider';
import uuid from 'react-uuid';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';

const Favourites = () => {
	const user = useContext(UserContext); // Get User Context
	let favourites;
	if (user) {
		favourites = user.favourites; // Deconstruct user document elements
		console.log('Favourites: ' + favourites);
	}

	return (
		<Container>
			Favourites List
			{favourites.length ? (
				<Container id="favouritesContainer">
					<br />
					<h2>Favourites for: {user.displayName}</h2>					
                    <br />
					<h3>Number of favourites: {favourites.length}</h3>
					<br />	
                    <section>		
					{favourites.map((favourite) => (
						<ListGroup
                        style={{border: 24}}
                        spacing={10}
							horizontal="sm"
							className="my-2"
							key={uuid()}>
							<ListGroup.Item>								
								<Favourite
									title={favourite.title}
									mapURL={favourite.mapURL}
								/>
							</ListGroup.Item>							
						</ListGroup>
					))}
                    </section>		
				</Container>
			) : (
				<div>No favourites found</div>
			)}
		</Container>
	);
};

export default Favourites;

//TODO implement Favourite component to display favourite information
