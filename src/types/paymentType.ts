import {IOrder} from './orderType';
import {IUser} from './userType';

export type CreatePayment = {
  amount: number;
  method: string;
  imp_uid: string;
  merchant_uid: string;
};

export type IPayment = {
  id: number;
  amount: number;
  method: string;
  merchant_uid: string;
  createdAt: Date;
  Order: IOrder[];
  user: IUser;
};
