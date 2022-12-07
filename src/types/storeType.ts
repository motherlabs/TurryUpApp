import {IGoods} from './goodsType';
import {IOrder} from './orderType';

export type IStore = {
  id: number;
  name: string;
  storeNumber: string;
  roadNameAddress: string;
  detailAddress: string;
  picupZone: string;
  dayOff: string;
  businessHours: string;
  latitude: number;
  longitude: number;
  userId: number;
  Goods: IGoods[];
  Order: IOrder[];
};

export type UpdateStore = {
  name: string;
  storeNumber: string;
  roadNameAddress: string;
  detailAddress: string;
  picupZone: string;
  dayOff: string;
  businessHours: string;
  latitude: number;
  longitude: number;
};

export type CreateStore = {
  userId: number;
  name: string;
  storeNumber: string;
  roadNameAddress: string;
  detailAddress: string;
  picupZone: string;
  dayOff: string;
  businessHours: string;
  latitude: number;
  longitude: number;
};
