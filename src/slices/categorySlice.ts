import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ICategory} from '../types/categoryType';

interface InitialState {
  categories: ICategory[];
}

const initialState: InitialState = {
  categories: [],
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<ICategory[]>) {
      state.categories = action.payload;
    },
  },
});

export default categorySlice;
