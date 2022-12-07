import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IUser, UserRole, UserState} from '../types/userType';

interface InitialState {
  me: IUser;
}

const initialState: InitialState = {
  me: {
    id: 0,
    uniqueCode: '',
    fcmToken: '',
    phoneNumber: '',
    role: UserRole.USER,
    state: UserState.BUYER,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.me = action.payload;
    },
    changeState(state, action: PayloadAction<UserState>) {
      state.me.state = action.payload;
    },
    orderHandler() {},
  },
});

export default userSlice;
