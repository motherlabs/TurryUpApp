import {combineReducers} from 'redux';
import addressSlice from '../slices/addressSlice';
import basketSlice from '../slices/basketSlice';
import categorySlice from '../slices/categorySlice';
import goodsSlice from '../slices/goodsSlice';
import infiniteScrollSlice from '../slices/infiniteScrollSlice';
import loadingSlice from '../slices/loadingSlice';
import paymentSlice from '../slices/paymentSlice';
import storeSlice from '../slices/storeSlice';
import tabbarSlice from '../slices/tabbarSlice';
import userSlice from '../slices/userSlice';

const rootReducer = combineReducers({
  loading: loadingSlice.reducer,
  infiniteScroll: infiniteScrollSlice.reducer,
  user: userSlice.reducer,
  address: addressSlice.reducer,
  store: storeSlice.reducer,
  goods: goodsSlice.reducer,
  category: categorySlice.reducer,
  basket: basketSlice.reducer,
  payment: paymentSlice.reducer,
  tabbar: tabbarSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
