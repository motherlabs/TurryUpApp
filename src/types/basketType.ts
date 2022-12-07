import {IGoods} from './goodsType';

export type IBasket = {
  id: number;
  goods: IGoods;
  quantity: number;
};
