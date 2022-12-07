import {IGoods} from './goodsType';
import {IPayment} from './paymentType';

export type OrderStatus = '픽업 대기중' | '픽업 완료';

export type IOrder = {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  quantity: number;
  price: number;
  goods: IGoods;
  payment: IPayment;
};

export type CreateOrder = {
  paymentId: number;
  storeId: number;
  goodsId: number;
  orderNumber: string;
  status: OrderStatus;
  quantity: number;
  price: number;
  targetId: number;
  goodsName: string;
};
