import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface InfiniteScrollState {
  skip: number;
  take: number;
}

export const infiniteScrollState: InfiniteScrollState = {
  skip: 0,
  take: 10,
};
const infiniteScrollSlice = createSlice({
  name: 'infiniteScroll',
  initialState: infiniteScrollState,
  reducers: {
    setSkip(state, action: PayloadAction<number>) {
      state.skip = action.payload;
    },
  },
});

export default infiniteScrollSlice;
