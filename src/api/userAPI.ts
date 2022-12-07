import axios from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import {UserRole} from '../types/userType';

const sendSMS = async (phoneNumber: string) => {
  console.log(Config.API_URL);
  return await axios.post(`${Config.API_URL}auth/sms`, {phoneNumber});
};

const signIn = async (phoneNumber: string) => {
  return await axios.post(`${Config.API_URL}auth/signIn`, {phoneNumber});
};

const auth = async () => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.post(
    `${Config.API_URL}auth`,
    {},
    {
      headers: {Authorization: `Bearer ${accessToken}`},
    },
  );
};

const findAll = async () => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.get(`${Config.API_URL}user/findAll`, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
};

const updateRole = async (data: {userId: number; role: UserRole}) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.patch(`${Config.API_URL}user/role`, data, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
};

const updateFcmToken = async (data: {fcmToken: string}) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.patch(`${Config.API_URL}user/fcmToken`, data, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
};

const deleteUser = async () => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.post(`${Config.API_URL}user/delete`, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
};

const userAPI = {
  sendSMS,
  signIn,
  auth,
  findAll,
  updateRole,
  updateFcmToken,
  deleteUser,
};

export default userAPI;
