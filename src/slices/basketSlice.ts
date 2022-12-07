import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IBasket} from '../types/basketType';

interface InitialState {
  basketList: IBasket[];
  count: number;
  selectedList: IBasket[];
}

const initialState: InitialState = {
  basketList: [],
  count: 0,
  selectedList: [],
};

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    setList(state, action: PayloadAction<IBasket[]>) {
      state.basketList = action.payload;
      state.count = state.basketList.length;
    },
    setSelectedList(state, action: PayloadAction<IBasket[]>) {
      state.selectedList = action.payload;
    },
    incrementCount(state) {
      state.count = state.count + 1;
    },
  },
});

export default basketSlice;
