import axios from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import RNFetchBlob from 'rn-fetch-blob';

const create = async (
  rnFormData: {
    name: string;
    data: any;
    filename?: string;
    type?: string;
  }[],
) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await RNFetchBlob.fetch(
    'POST',
    `${Config.API_URL}goods`,
    {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
    rnFormData,
  );
};

const findAll = async (storeId: number) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.get(`${Config.API_URL}goods/${storeId}/store`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const findOne = async (goodsId: number) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  const response = await axios.get(`${Config.API_URL}goods/${goodsId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const update = async (
  rnFormData: {
    name: string;
    data: any;
    filename?: string;
    type?: string;
  }[],
  goodsId: number,
) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');

  return await RNFetchBlob.fetch(
    'PUT',
    `${Config.API_URL}goods/${goodsId}`,
    {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
    rnFormData,
  );
};

const updateQuantity = async (data: {quantity: number; goodsId: number}) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  return await axios.patch(
    `${Config.API_URL}goods/${data.goodsId}`,
    {quantity: data.quantity},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

const findAllUserLocationList = async (data: {
  latitude: number;
  longitude: number;
  range: number;
  skip: number;
  take: number;
  category: string;
}) => {
  const accessToken = await EncryptedStorage.getItem('accessToken');
  const response = await axios.post(
    `${Config.API_URL}goods/list?skip=${data.skip}&take=${data.take}&category=${data.category}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.data;
};

const goodsAPI = {
  create,
  findAll,
  findOne,
  update,
  findAllUserLocationList,
  updateQuantity,
};

export default goodsAPI;
