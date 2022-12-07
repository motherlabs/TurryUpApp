export const AddressType = {
  NORMAL: 'NORMAL',
  MYHOME: 'MYHOME',
} as const;

export type AddressType = typeof AddressType[keyof typeof AddressType];

export type IAddress = {
  id: number;
  name: string;
  range: number;
  latitude: number;
  longitude: number;
  type: AddressType;
  isPinned: number;
};

export type CreateAddress = {
  name: string;
  range: number;
  latitude: number;
  longitude: number;
  type: AddressType;
  isPinned: number;
};
