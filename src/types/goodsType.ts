import {ICategory} from './categoryType';
import {IStore} from './storeType';

export type IGoods = {
  id: number;
  categoryId: number;
  name: string;
  originPrice: number;
  salePrice: number;
  discount: number;
  quantity: number;
  expiryDate: Date;
  isAutoDiscount: number;
  GoodsImage: GoodsImage[];
  additionalDiscount: number;
  category: ICategory;
  store: IStore;
};

export type UpdateGoods = {
  categoryId: string;
  name: string;
  originPrice: string;
  salePrice: string;
  discount: string;
  quantity: string;
  expiryDate: string;
  isAutoDiscount: string;
};

export type GoodsImage = {
  id: number;
  location: string;
};
