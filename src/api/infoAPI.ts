import axios from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import {CreateInfo} from '../types/infoType';

const create = async (data: CreateInfo) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.post(`${Config.API_URL}info`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
const verify = async () => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.get(`${Config.API_URL}info/verify`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const infoAPI = {
  verify,
  create,
};

export default infoAPI;
