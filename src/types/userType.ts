export type IUser = {
  id: number;
  uniqueCode: string;
  fcmToken: string;
  phoneNumber: string;
  state: UserState;
  role: UserRole;
};

export const UserState = {
  BUYER: 'BUYER',
  SELLER: 'SELLER',
} as const;
export type UserState = typeof UserState[keyof typeof UserState];

export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  PARTNER: 'PARTNER',
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];
