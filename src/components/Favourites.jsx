import React, {useContext} from 'react';
import Favourite from './Favourite';
import {UserContext} from '../auth/UserProvider';
import Grid from '@material-ui/core/Grid';

//import {MDBBtn} from 'mdb-react-ui-kit';

const Favourites = () => {
  
 const user = useContext (UserContext); // Get User Context
 const {displayName, email, favourites} = user; // Deconstruct user document elements
 

// TODO get user favourites list from context
// TODO implement search box / filter input as code below
{/* <TextField style={{padding: 24}}
id="searchInput"
placeholder="Search for Courses"   
margin="normal"
onChange={this.onSearchInputChange}
/> */}

  return (   
    
          <div>
              { favourites ? (
                  <div>                     
                      <Grid container spacing={10} style={{padding: 24}}>
                          { favourites.map(favourite => (
                              <Grid item xs={12} sm={6} lg={4} xl={3}>
                                  <Favourite favourite={favourite} />
                              </Grid>
                          ))}
                      </Grid>
                  </div>
              ) : "No favourites found" }
          </div>
      )
  
  
};

export default Favourites;
