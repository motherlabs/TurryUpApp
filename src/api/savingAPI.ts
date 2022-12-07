import axios from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import {CreateSaving} from '../types/savingType';

const create = async (data: CreateSaving) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.post(`${Config.API_URL}saving`, data, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
};

const savingAPI = {
  create,
};

export default savingAPI;
