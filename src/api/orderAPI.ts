import axios from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import {CreateOrder, OrderStatus} from '../types/orderType';

const create = async (data: CreateOrder) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.post(`${Config.API_URL}order`, data, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
};

const updateStatus = async (data: {orderId: number; status: OrderStatus}) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.patch(
    `${Config.API_URL}order/${data.orderId}`,
    {
      status: data.status,
    },
    {
      headers: {Authorization: `Bearer ${accessToken}`},
    },
  );
};

const monthlyOrders = async () => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.get(`${Config.API_URL}order/monthly`, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
};

const orderAPI = {
  create,
  updateStatus,
  monthlyOrders,
};

export default orderAPI;
