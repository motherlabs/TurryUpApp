import axios from 'axios';
import Config from 'react-native-config';
import {CreateAddress} from '../types/addressType';
import EncryptedStorage from 'react-native-encrypted-storage';

const create = async (data: CreateAddress) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.post(`${Config.API_URL}address`, data, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
};

const findPinned = async () => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.get(`${Config.API_URL}address/pinned`, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
};

const findAll = async () => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.get(`${Config.API_URL}address`, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
};

const deleteAddress = async (data: {addressId: number}) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.post(`${Config.API_URL}address/delete`, data, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
};

const addressAPI = {
  create,
  findPinned,
  findAll,
  deleteAddress,
};

export default addressAPI;
