import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IGoods} from '../types/goodsType';

interface InitialState {
  goodsList: IGoods[];
  goods: IGoods;
}

const initialState: InitialState = {
  goodsList: [],
  goods: {
    id: 0,
    categoryId: 0,
    name: '',
    originPrice: 0,
    salePrice: 0,
    discount: 0,
    quantity: 0,
    expiryDate: '',
    GoodsImage: [],
    store: {
      id: 0,
      name: '',
      storeNumber: '',
      roadNameAddress: '',
      detailAddress: '',
      picupZone: '',
      dayOff: '',
      businessHours: '',
      latitude: 0,
      longitude: 0,
      userId: 0,
      Goods: [],
      Order: [],
    },
    category: {
      id: 0,
      name: '',
    },
  },
};

const goodsSlice = createSlice({
  name: 'goods',
  initialState,
  reducers: {
    setGoodsList(state, action: PayloadAction<IGoods[]>) {
      state.goodsList = action.payload;
    },
    setGoods(state, action: PayloadAction<IGoods>) {
      state.goods = action.payload;
    },
  },
});

export default goodsSlice;
