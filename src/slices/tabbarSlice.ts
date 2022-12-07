import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TabbarType} from '../components/Tabbar';

export interface TabbarState {
  isTabbar: boolean;
  type: TabbarType;
}

export const tabbarInitialState: TabbarState = {
  isTabbar: false,
  type: TabbarType.MYINFO,
};
const tabbarSlice = createSlice({
  name: 'tabbar',
  initialState: tabbarInitialState,
  reducers: {
    setIsTabbar(state, action: PayloadAction<boolean>) {
      state.isTabbar = action.payload;
    },
    setType(state, action: PayloadAction<TabbarType>) {
      state.type = action.payload;
    },
  },
});

export default tabbarSlice;
