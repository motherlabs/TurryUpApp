import {View, Text, Pressable, Alert} from 'react-native';
import React, {useEffect} from 'react';
import {useTailwind} from 'tailwind-rn/dist';
import {RootStackParamList, RouterList} from '../../Router';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import HomeIcon from '../assets/svg/home.svg';
import AddIcon from '../assets/svg/add.svg';
import BasketIcon from '../assets/svg/basket.svg';
import {UserState} from '../types/userType';
import {useAppDispatch} from '../store';
import basketAPI from '../api/basketAPI';
import basketSlice from '../slices/basketSlice';
import {FlatList} from 'react-native-gesture-handler';
import {IGoods} from '../types/goodsType';
import FastImage from 'react-native-fast-image';

interface Props {
  type: TabbarType;
  homeScrollRef?: React.RefObject<FlatList<IGoods>>;
}

export const TabbarType = {
  BUYERHOME: 'BUYERHOME',
  MYINFO: 'MYINFO',
  BUYERBASKET: 'BUYERBASKET',
  SALLERHOME: 'SALLERHOME',
  SALLERADD: 'SALLERADD',
} as const;
export type TabbarType = typeof TabbarType[keyof typeof TabbarType];

export default function Tabbar({type, homeScrollRef}: Props) {
  const tailwind = useTailwind();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user.me);
  const store = useSelector((state: RootState) => state.store.me);
  const basketCount = useSelector((state: RootState) => state.basket.count);

  useEffect(() => {
    const findAllBasketAPIHandler = async () => {
      const response = await basketAPI.findAll();
      dispatch(basketSlice.actions.setList(response.data));
    };
    findAllBasketAPIHandler();
  }, [dispatch]);

  return (
    <>
      <View
        style={tailwind(
          'h-[90px] w-full border-t border-[#E9E9E9] bg-background',
        )}>
        {user.state === UserState.BUYER ? (
          <View
            style={tailwind(
              ' pt-1 w-full  flex flex-row justify-around items-start',
            )}>
            <Pressable
              onPress={() => {
                if (type !== TabbarType.BUYERHOME) {
                  navigation.reset({routes: [{name: RouterList.Home}]});
                }
                if (type === TabbarType.BUYERHOME) {
                  homeScrollRef?.current!.scrollToOffset({
                    animated: true,
                    offset: 0,
                  });
                }
              }}
              style={tailwind(
                'h-[60px] flex flex-col items-center justify-center w-[70px]',
              )}>
              <HomeIcon
                fill={type !== TabbarType.BUYERHOME ? '#D3D3D3' : '#1C1C1E'}
              />
              <Text
                style={tailwind(
                  `font-[500] text-[14px] leading-[17px] mt-[5px] ${
                    type !== TabbarType.BUYERHOME
                      ? 'text-[#D3D3D3]'
                      : 'text-[#1C1C1E]'
                  }`,
                )}>
                홈
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                if (type !== TabbarType.BUYERBASKET) {
                  navigation.reset({routes: [{name: RouterList.Basket}]});
                }
              }}
              style={tailwind(
                'h-[60px] flex flex-col items-center justify-center w-[70px] relative',
              )}>
              <BasketIcon
                fill={type !== TabbarType.BUYERBASKET ? '#D3D3D3' : '#1C1C1E'}
              />

              <Text
                style={tailwind(
                  `font-[500] text-[14px] leading-[17px] mt-[5px] ${
                    type !== TabbarType.BUYERBASKET
                      ? 'text-[#D3D3D3]'
                      : 'text-[#1C1C1E]'
                  }`,
                )}>
                장바구니
              </Text>
              {basketCount > 0 && (
                <View
                  style={tailwind(
                    `absolute top-[4px] ${
                      basketCount > 9
                        ? 'right-[0px] w-[40px]'
                        : 'right-[12px] w-[20px]'
                    }  h-[20px] bg-[#FF594F] rounded-full flex flex-col items-center justify-center`,
                  )}>
                  <Text style={tailwind('text-white text-[12px] font-[700]')}>
                    {basketCount > 99 ? '99+' : basketCount}
                  </Text>
                </View>
              )}
            </Pressable>

            <Pressable
              onPress={() => {
                if (type !== TabbarType.MYINFO) {
                  navigation.reset({routes: [{name: RouterList.MyInfo}]});
                }
              }}
              style={tailwind(
                'h-[60px] flex flex-col items-center justify-center w-[70px]',
              )}>
              {type !== TabbarType.MYINFO ? (
                <FastImage
                  style={tailwind('w-[24px] h-[24px]')}
                  source={require('../assets/image/myhome-inactive.png')}
                />
              ) : (
                <FastImage
                  style={tailwind('w-[24px] h-[24px]')}
                  source={require('../assets/image/myhome-active.png')}
                />
              )}

              <Text
                style={tailwind(
                  `font-[500] text-[14px] leading-[17px] mt-[5px] ${
                    type !== TabbarType.MYINFO
                      ? 'text-[#D3D3D3]'
                      : 'text-[#1C1C1E]'
                  }`,
                )}>
                나의 덕템
              </Text>
            </Pressable>
          </View>
        ) : (
          <View
            style={tailwind(
              ' h-[70px] pt-1 w-full flex flex-row justify-around items-start',
            )}>
            <Pressable
              onPress={() => {
                if (type !== TabbarType.SALLERHOME) {
                  navigation.reset({routes: [{name: RouterList.PartnerHome}]});
                }
              }}
              style={tailwind(
                'h-[60px] flex flex-col items-center justify-center w-[70px]',
              )}>
              <HomeIcon
                fill={type !== TabbarType.SALLERHOME ? '#D3D3D3' : '#1C1C1E'}
              />
              <Text
                style={tailwind(
                  `font-[500] text-[14px] leading-[17px] mt-[5px] ${
                    type !== TabbarType.SALLERHOME
                      ? 'text-[#D3D3D3]'
                      : 'text-[#1C1C1E]'
                  }`,
                )}>
                홈
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                if (type !== TabbarType.SALLERADD) {
                  if (store.name === '') {
                    return Alert.alert('매장설정을 통해 매장을 등록해주세요.');
                  } else {
                    navigation.reset({
                      routes: [
                        {
                          name: RouterList.GoodsAdd,
                          params: {isUpdate: false, goodsId: 0},
                        },
                      ],
                    });
                  }
                }
              }}
              style={tailwind(
                'h-[60px] flex flex-col items-center justify-center w-[70px]',
              )}>
              <AddIcon
                fill={type !== TabbarType.SALLERADD ? '#D3D3D3' : '#1C1C1E'}
              />

              <Text
                style={tailwind(
                  `font-[500] text-[14px] leading-[17px] mt-[5px] ${
                    type !== TabbarType.SALLERADD
                      ? 'text-[#D3D3D3]'
                      : 'text-[#1C1C1E]'
                  }`,
                )}>
                상품 등록
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                if (type !== TabbarType.MYINFO) {
                  navigation.reset({routes: [{name: RouterList.MyInfo}]});
                }
              }}
              style={tailwind(
                'h-[60px] flex flex-col items-center justify-center w-[70px]',
              )}>
              {type !== TabbarType.MYINFO ? (
                <FastImage
                  style={tailwind('w-[24px] h-[24px]')}
                  source={require('../assets/image/myhome-inactive.png')}
                />
              ) : (
                <FastImage
                  style={tailwind('w-[24px] h-[24px]')}
                  source={require('../assets/image/myhome-active.png')}
                />
              )}

              <Text
                style={tailwind(
                  `font-[500] text-[14px] leading-[17px] mt-[5px] ${
                    type !== TabbarType.MYINFO
                      ? 'text-[#D3D3D3]'
                      : 'text-[#1C1C1E]'
                  }`,
                )}>
                나의 덕템
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </>
  );
}
