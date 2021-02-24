import React, {useContext} from 'react';
import Favourite from './Favourite';
import {UserContext} from '../auth/UserProvider';
import Grid from '@material-ui/core/Grid';
import uuid from 'react-uuid';
import Container from 'react-bootstrap/Container';

//import {MDBBtn} from 'mdb-react-ui-kit';

const Favourites = () => {
  
 const user = useContext (UserContext); // Get User Context
 let favourites;
 if(user){
    favourites = user.favourites; // Deconstruct user document elements
    console.log("Favourites: " + favourites);
 } 
 

// TODO get user favourites list from context
// TODO implement search box / filter input as code below
// TODO add code to allow searching of favourites titles
{/* <TextField style={{padding: 24}}
id="searchInput"
placeholder="Search for Courses"   
margin="normal"
onChange={this.onSearchInputChange}
/> */}

  return (       
          <Container>
          Favourites List
              { favourites.length ? (
                <Container id="favouritesContainer">     
                  <br />                 
                  User display name:  {user.displayName}  
                  <br /> 
                  Number of favourites: {favourites.length}           
                      <Grid container spacing={10} style={{padding: 24}}>
                          { favourites.map(favourite => (
                              <Grid item xs={12} sm={6} lg={4} xl={3} key={uuid ()}>
                                  {favourite.title}
                                  -------------------
                                  {favourite.mapURL}
                              </Grid>
                          ))}
                      </Grid>                     
                      </Container>
                 
              ) : (<div>No favourites found</div> )}
          </Container>
      )
};

export default Favourites;

//TODO implement Favourite component to display favourite information