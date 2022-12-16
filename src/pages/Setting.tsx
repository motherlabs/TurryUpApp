import {View, Text, Pressable, Alert} from 'react-native';
import React, {useCallback} from 'react';
import {useTailwind} from 'tailwind-rn/dist';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList, RouterList} from '../../Router';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useAppDispatch} from '../store';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import userSlice from '../slices/userSlice';
import {UserRole, UserState} from '../types/userType';
import addressSlice from '../slices/addressSlice';
import storeSlice from '../slices/storeSlice';
import paymentSlice from '../slices/paymentSlice';
import basketSlice from '../slices/basketSlice';
import ArrowRight24 from '../assets/svg/arrow-right-24.svg';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import userAPI from '../api/userAPI';
import loadingSlice from '../slices/loadingSlice';
import BackIcon from '../assets/svg/back.svg';

export default function Setting() {
  const tailwind = useTailwind();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const user = useSelector((state: RootState) => state.user.me);

  const logOutHandler = useCallback(async () => {
    let role = 'User';
    if (user.role === UserRole.PARTNER) {
      role = user.role;
    }
    await EncryptedStorage.removeItem('accessToken');
    await EncryptedStorage.removeItem('uniqueCode');
    dispatch(
      userSlice.actions.setUser({
        id: 0,
        uniqueCode: '',
        fcmToken: '',
        phoneNumber: '',
        role: UserRole.USER,
        state: UserState.BUYER,
      }),
    );
    dispatch(
      addressSlice.actions.setAddress({
        id: 0,
        name: '',
        latitude: 0,
        longitude: 0,
        range: 3,
        isPinned: 0,
        type: 'NORMAL',
      }),
    );
    dispatch(addressSlice.actions.setList([]));
    dispatch(
      storeSlice.actions.setStore({
        id: 0,
        name: '',
        storeNumber: '',
        roadNameAddress: '',
        detailAddress: '',
        picupZone: '',
        dayOff: '',
        businessHours: '',
        latitude: 0,
        longitude: 0,
        userId: 0,
        Goods: [],
        Order: [],
      }),
    );
    dispatch(paymentSlice.actions.setPaymentList([]));
    dispatch(basketSlice.actions.setList([]));
    Alert.alert('로그아웃이 완료되었습니다.');
    if (role === UserRole.PARTNER) {
      navigation.reset({routes: [{name: RouterList.PartnerStart}]});
    } else {
      navigation.reset({routes: [{name: RouterList.Start}]});
    }
  }, [dispatch, navigation, user]);

  const deleteUserAPIHandler = useCallback(async () => {
    dispatch(loadingSlice.actions.setLoading(true));
    await userAPI.deleteUser();
    await EncryptedStorage.removeItem('accessToken');
    await EncryptedStorage.removeItem('uniqueCode');
    dispatch(
      userSlice.actions.setUser({
        id: 0,
        uniqueCode: '',
        fcmToken: '',
        phoneNumber: '',
        role: UserRole.USER,
        state: UserState.BUYER,
      }),
    );
    dispatch(
      addressSlice.actions.setAddress({
        id: 0,
        name: '',
        latitude: 0,
        longitude: 0,
        range: 3,
        isPinned: 0,
        type: 'NORMAL',
      }),
    );
    dispatch(addressSlice.actions.setList([]));
    dispatch(
      storeSlice.actions.setStore({
        id: 0,
        name: '',
        storeNumber: '',
        roadNameAddress: '',
        detailAddress: '',
        picupZone: '',
        dayOff: '',
        businessHours: '',
        latitude: 0,
        longitude: 0,
        userId: 0,
        Goods: [],
        Order: [],
      }),
    );
    dispatch(paymentSlice.actions.setPaymentList([]));
    dispatch(basketSlice.actions.setList([]));
    dispatch(loadingSlice.actions.setLoading(false));
    Alert.alert('탈퇴가 완료되었습니다.');
    navigation.reset({routes: [{name: RouterList.Start}]});
  }, [dispatch, navigation]);

  return (
    <SafeAreaView style={tailwind('bg-background')}>
      <View style={tailwind('h-full bg-background')}>
        <View
          style={tailwind('px-4 border-b border-[#F4F4F4] relative mb-[20px]')}>
          <View
            style={tailwind(
              'flex flex-col items-center justify-center h-[56px]',
            )}>
            <Text style={tailwind(' text-[21px] leading-[24px] font-[600]')}>
              설정
            </Text>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}
              style={tailwind(
                'absolute top-0 left-0 h-[56px] flex flex-col items-center justify-center pr-5',
              )}>
              <BackIcon width={21} height={21} fill={'black'} />
            </Pressable>
          </View>
        </View>
        <View style={tailwind('px-5')}>
          <Text
            style={tailwind(
              'text-[19px] leading-[22px] text-[#1C1C1E] font-[600] mb-[18px]',
            )}>
            정보
          </Text>
          <Pressable
            onPress={() => {
              navigation.navigate(RouterList.TermsOfService);
            }}
            style={tailwind(
              ' py-[18px] border-b border-[#E9E9E9] flex flex-row items-center justify-between',
            )}>
            <Text style={tailwind('text-[17px] leading-[20px] font-[400]')}>
              이용약관
            </Text>
            <ArrowRight24 />
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate(RouterList.PrivacyPolicy);
            }}
            style={tailwind(
              ' py-[18px] border-b border-[#E9E9E9] flex flex-row items-center justify-between',
            )}>
            <Text style={tailwind('text-[17px] leading-[20px] font-[400]')}>
              개인정보처리방침
            </Text>
            <ArrowRight24 />
          </Pressable>
          <Pressable
            onPress={() => {
              Alert.alert('정말 로그아웃 하시겠나요?', '', [
                {
                  text: '닫기',
                  style: 'cancel',
                },
                {
                  text: '로그아웃',
                  onPress: () => {
                    logOutHandler();
                  },
                },
              ]);
            }}
            style={tailwind(
              ' py-[18px]  flex flex-row items-center justify-between',
            )}>
            <Text style={tailwind('text-[17px] leading-[20px] font-[400]')}>
              로그아웃
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              Alert.alert(
                '정말 탈퇴하시겠나요?',
                '탈퇴 시 절약금액, 구매내역 등 모든 정보가 삭제되며 7일간 다시 가입할 수 없어요.',
                [
                  {
                    text: '닫기',
                    style: 'cancel',
                  },
                  {
                    text: '회원탈퇴',
                    onPress: () => {
                      deleteUserAPIHandler();
                    },
                  },
                ],
              );
            }}
            style={tailwind(
              '  mt-[18px] flex flex-row items-center justify-between',
            )}>
            <Text
              style={tailwind(
                'text-[17px] leading-[20px] font-[400] text-[#A7A7A8]',
              )}>
              탈퇴하기
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
