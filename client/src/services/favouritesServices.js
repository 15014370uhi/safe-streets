import axios from 'axios';
import fire from '../fire';

// TODO change to env variable or final website address
// Define API URL
const url = 'http://localhost:5000/api';

// Create a token for current user
const createToken = async () => {
  const user = fire.auth ().currentUser;
  const token = await user.getIdToken ();

  // Create header payload with user Bearer token
  const payloadHeader = {
    headers: {
      'Content-Type': 'application/json',
      Authorisation: `Bearer ${token}`,
    },
  };
  return payloadHeader;
};

// Add new favourite
export const addToFavourites = async (title, mapURL) => {
  const header = await createToken ();
  const payload = {
    title,
    mapURL,
  };
  try {
    //TEST
    console.log (payload);
    const res = await axios.post (url, payload, header);
    return res.data;
  } catch (e) {
    console.error (e);
  }
};

// Get all user favourites
export const getFavourites = async () => {
  const header = await createToken ();
  try {
    const res = await axios.get (url, header);
    return res.data;
  } catch (e) {
    console.error (e);
  }
};
