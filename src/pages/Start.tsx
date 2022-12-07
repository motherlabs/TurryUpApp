import {View, Text, Pressable, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTailwind} from 'tailwind-rn/dist';
// import Logo from '../assets/svg/logo.svg';
import Tooltip from '../assets/svg/tooltip.svg';
// import FastImage from 'react-native-fast-image';
import FadeInOut from 'react-native-fade-in-out';
import {wait} from '../utils/timeout';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList, RouterList} from '../../Router';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {UserRole} from '../types/userType';
import {useAppDispatch} from '../store';
import StartIcon from '../assets/svg/start.svg';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function Start() {
  const tailwind = useTailwind();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [visible, setVisible] = useState(false);
  const user = useSelector((state: RootState) => state.user.me);

  useEffect(() => {
    if (user.id > 0) {
      if (user.role === UserRole.PARTNER) {
        navigation.reset({routes: [{name: RouterList.PartnerHome}]});
      } else {
        navigation.reset({routes: [{name: RouterList.Home}]});
      }
    }
  }, [user, dispatch, navigation]);

  useEffect(() => {
    const firstVisitHandler = async () => {
      await wait(500);
      setVisible(true);
    };
    firstVisitHandler();
  }, []);

  return (
    <>
      <SafeAreaView style={tailwind(' bg-white relative')}>
        <View style={tailwind('relative h-full w-full bg-white')}>
          {/* <View style={tailwind('absolute z-40 w-full h-full bg-gray-300')}>
        <FastImage
          source={require('../assets/image/start-bg-green.png')}
          style={tailwind('w-full h-full')}
          resizeMode={'cover'}
        />
      </View>
      <View
        style={tailwind(
          'flex-col items-center absolute z-50  w-full   top-[33%]',
        )}>
        <Logo />
        <View style={tailwind('mt-3 flex-col items-center')}>
          <Text style={tailwind('text-white font-bold text-[22px]')}>
            우리동네 떨이마켓
          </Text>
        </View>
        <View style={tailwind('mt-5 flex-col items-center')}>
          <Text style={tailwind('font-[600] text-[14px] text-white')}>
            지금 내 주위에 어떤 할인이 있는지
          </Text>
          <Text style={tailwind('font-[600] text-[14px] text-white')}>
            서둘러 확인해보세요.
          </Text>
        </View>
      </View> */}
          <View
            style={tailwind(
              'absolute top-[30%] w-full flex flex-col items-center',
            )}>
            <StartIcon />
          </View>
          <View
            style={tailwind(
              `absolute ${
                Platform.OS === 'android' ? 'bottom-[6%]' : 'bottom-[6%]'
              }  z-50 w-full flex flex-col items-center`,
            )}>
            <FadeInOut visible={visible} scale={true}>
              <Tooltip />
            </FadeInOut>
            <Pressable
              onPress={() => {
                navigation.navigate(RouterList.Login);
              }}
              style={tailwind(
                'w-[315px] bg-primary h-[52px] mt-1 mb-[5px] rounded-[4px] flex flex-col items-center justify-center',
              )}>
              <Text style={tailwind('text-black font-[600] text-[16px]')}>
                시작하기
              </Text>
            </Pressable>
            <View
              style={tailwind(
                'flex flex-row justify-center w-full h-[52px]  items-center',
              )}>
              <Text style={tailwind('text-[#848688] font-[400] text-[16px]')}>
                파트너 이신가요?
              </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate(RouterList.PartnerStart);
                }}
                style={tailwind(
                  ' px-2 h-[52px] flex flex-col items-center justify-center',
                )}>
                <Text style={tailwind('text-[#FFE145] font-[700]')}>
                  시작하기
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
