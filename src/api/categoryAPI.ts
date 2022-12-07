import axios from 'axios';
import Config from 'react-native-config';

const findAll = async () => {
  return await axios.get(`${Config.API_URL}category`);
};

const categoryAPI = {
  findAll,
};

export default categoryAPI;
