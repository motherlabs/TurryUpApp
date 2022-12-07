import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AddressType, IAddress} from '../types/addressType';

interface InitialState {
  me: IAddress;
  list: IAddress[];
}

const initialState: InitialState = {
  me: {
    id: 0,
    name: '',
    latitude: 0,
    longitude: 0,
    range: 3,
    isPinned: 0,
    type: 'NORMAL',
  },
  list: [],
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddress(state, action: PayloadAction<IAddress>) {
      state.me = action.payload;
    },
    setLocation(
      state,
      action: PayloadAction<{latitude: number; longitude: number}>,
    ) {
      state.me.latitude = action.payload.latitude;
      state.me.longitude = action.payload.longitude;
    },
    setRange(state, action: PayloadAction<{range: number}>) {
      state.me.range = action.payload.range;
    },
    setName(state, action: PayloadAction<{name: string}>) {
      state.me.name = action.payload.name;
    },
    setType(state, action: PayloadAction<AddressType>) {
      state.me.type = action.payload;
    },
    setList(state, action: PayloadAction<IAddress[]>) {
      state.list = action.payload;
    },
  },
});

export default addressSlice;
