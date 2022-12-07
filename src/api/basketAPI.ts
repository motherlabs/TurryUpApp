import axios from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';

const create = async (data: {goodsId: number; quantity: number}) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.post(`${Config.API_URL}basket/create`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const findAll = async () => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.get(`${Config.API_URL}basket`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const deleteAll = async (data: {basketIdList: number[]}) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.post(`${Config.API_URL}basket/delete`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const updateQuantity = async (data: {basketId: number; quantity: number}) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.patch(`${Config.API_URL}basket/quantity`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const basketAPI = {
  create,
  deleteAll,
  findAll,
  updateQuantity,
};

export default basketAPI;
