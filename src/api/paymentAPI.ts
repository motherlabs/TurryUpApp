import axios from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import {CreatePayment} from '../types/paymentType';

const create = async (data: CreatePayment) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.post(`${Config.API_URL}payment`, data, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
};

const findAll = async () => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.get(`${Config.API_URL}payment`, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
};

const monthlyPayments = async () => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.get(`${Config.API_URL}payment/monthly`, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
};

const cancelOrder = async (data: {
  reason: string;
  cancelAmount: number;
  orderNumber: string;
}) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.post(`${Config.API_URL}payment/cancel`, data, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
};

const paymentAPI = {
  create,
  findAll,
  monthlyPayments,
  cancelOrder,
};

export default paymentAPI;
