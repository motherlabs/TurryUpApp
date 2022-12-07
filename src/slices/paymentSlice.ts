import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IPayment} from '../types/paymentType';

interface InitialState {
  paymentList: IPayment[];
}

const initialState: InitialState = {
  paymentList: [],
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentList(state, action: PayloadAction<IPayment[]>) {
      state.paymentList = action.payload;
    },
  },
});

export default paymentSlice;
