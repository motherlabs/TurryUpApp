import axios from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import {CreateStore, UpdateStore} from '../types/storeType';

const create = async (data: CreateStore) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.post(`${Config.API_URL}store`, data, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
};

const update = async (data: UpdateStore, userId: number) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.put(`${Config.API_URL}store/${userId}`, data, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
};

const findOne = async (userId: number) => {
  return await axios.get(`${Config.API_URL}store/${userId}`);
};

const storeAPI = {
  create,
  findOne,
  update,
};

export default storeAPI;
