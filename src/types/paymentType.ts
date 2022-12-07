import {IOrder} from './orderType';
import {IUser} from './userType';

export type CreatePayment = {
  amount: number;
  method: string;
};

export type IPayment = {
  id: number;
  amount: number;
  method: string;
  createdAt: Date;
  Order: IOrder[];
  user: IUser;
};
