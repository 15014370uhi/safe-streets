import axios from 'axios';
import fire from '../fire';

const url = 'http://localhost:5000/api';

const createToken = async () => {
  const user = fire.auth().currentUser;
  const token = user && (await user.getIdToken());

  const payloadHeader = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  return payloadHeader;
}

export const addToFavourites = async (title, mapURL) => {
  const header = await createToken();

  const payload = {
    title,
    mapURL,
  }
  try {
    console.log(payload);
    const res = await axios.post(url, payload, header);
    return res.data;

  } catch (e) {
    console.error(e);
  }
};

export const getFavourites = async () => {
  const header = await createToken();

  try {
    const res = await axios.get(url, header);
    return res.data;
  } catch (e) {
    console.error(e);
  }
}