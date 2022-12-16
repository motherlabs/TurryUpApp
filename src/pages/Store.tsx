import {
  View,
  Text,
  Pressable,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import React, {useEffect} from 'react';
import {useTailwind} from 'tailwind-rn/dist';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList, RouterList} from '../../Router';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import BackIcon from '../assets/svg/back.svg';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import {useAppDispatch} from '../store';
import loadingSlice from '../slices/loadingSlice';
import storeAPI from '../api/storeAPI';
import {IStore} from '../types/storeType';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import goodsSlice from '../slices/goodsSlice';
import {converterPrice} from '../utils/convertPrice';
import {formatRemainingExpiryDateKR} from '../utils/dateFormat';
import storeSlice from '../slices/storeSlice';
import ArrowRight24 from '../assets/svg/arrow-right-24.svg';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {getBusinessHours, getBusinessHoursTime} from '../utils/businessHours';
import {validateExpiryDate} from '../utils/validateExpiryDate';

export default function Store() {
  const tailwind = useTailwind();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const storeRoute = useRoute<RouteProp<RootStackParamList, 'Store'>>();
  const goodsList = useSelector((state: RootState) => state.goods.goodsList);
  const store = useSelector((state: RootState) => state.store.me);
  // const address = useSelector((state: RootState) => state.address.me);
  const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;

  useEffect(() => {
    const findOneStoreAPIHandler = async () => {
      if (storeRoute.params) {
        dispatch(loadingSlice.actions.setLoading(true));
        const response = await storeAPI.findOne(storeRoute.params.userId);
        if (response.data.status !== 404) {
          const storeData: IStore = response.data;
          dispatch(goodsSlice.actions.setGoodsList(storeData.Goods));
          dispatch(storeSlice.actions.setStore(storeData));
        } else {
          dispatch(storeSlice.actions.setName(''));
        }
        dispatch(loadingSlice.actions.setLoading(false));
      }
    };
    findOneStoreAPIHandler();
  }, [storeRoute, dispatch]);

  return (
    <SafeAreaView style={tailwind('bg-background')}>
      <View
        style={tailwind(
          'h-[60px] w-full bg-background border-b border-[#F4F4F4] mb-2 flex flex-col items-start justify-center',
        )}>
        <View
          style={tailwind('flex flex-row justify-between items-center w-full')}>
          <Pressable
            style={tailwind(
              ' h-[60px] px-[13px] flex flex-row items-center justify-start',
            )}
            onPress={() => {
              navigation.goBack();
            }}>
            <BackIcon width={21} height={21} fill={'black'} />
          </Pressable>
          <View
            style={tailwind(
              'h-[60px] flex flex-col items-center justify-center',
            )}>
            <Text
              style={tailwind(
                'text-[21px] leading-[24px] font-[600] text-[#1C1C1E]',
              )}>
              매장 상품 더보기
            </Text>
          </View>
          <Pressable
            style={tailwind(
              ' h-[60px] px-[13px] flex flex-row items-center justify-start',
            )}>
            {/* <Cart24 /> */}
          </Pressable>
        </View>
      </View>
      <View
        style={[
          tailwind(``),
          {
            height: Dimensions.get('window').height - 60 - StatusBarHeight!,
          },
        ]}>
        <ScrollView style={tailwind('bg-background px-[16px]')}>
          <Pressable
            onPress={() => {
              navigation.navigate(RouterList.StoreInfo, {userId: store.userId});
            }}
            style={tailwind(
              'flex flex-row justify-between items-center py-4 px-3 border border-[#E9E9E9] mb-4',
            )}>
            <View>
              <View style={tailwind('flex flex-row items-center mb-[6px]')}>
                <Text
                  style={tailwind(
                    'text-[#1C1C1E] text-[21px] leading-[24px] font-[600] mr-1',
                  )}>
                  {store.name}
                </Text>
                {getBusinessHours(store.dayOff, store.businessHours) ===
                '영업중' ? (
                  <View style={tailwind('bg-light rounded-[24px] px-2 py-1')}>
                    <Text
                      style={tailwind(
                        'text-dark text-[13px] leading-[16px] font-[600]',
                      )}>
                      영업중
                    </Text>
                  </View>
                ) : (
                  <View
                    style={tailwind('bg-[#F4F4F4] rounded-[24px] px-2 py-1')}>
                    <Text
                      style={tailwind(
                        'text-[#A7A7A8] text-[13px] leading-[16px] font-[600]',
                      )}>
                      영업종료
                    </Text>
                  </View>
                )}
              </View>
              <View style={tailwind('flex flex-row items-center')}>
                <Text
                  style={tailwind(
                    'text-[17px] leading-[20px] font-[600] text-[#4F4F51] mr-1',
                  )}>
                  영업시간
                </Text>
                <Text
                  style={tailwind(
                    'text-[17px] leading-[20px] font-[400] text-[#4F4F51]',
                  )}>
                  {store.businessHours !== ''
                    ? getBusinessHoursTime(store.businessHours) ===
                      '00:00-00:00'
                      ? '휴무'
                      : getBusinessHoursTime(store.businessHours)
                    : ''}
                </Text>
              </View>
            </View>
            <ArrowRight24 />
          </Pressable>
          <View
            style={tailwind(
              'flex flex-row w-full flex-wrap justify-between h-full',
            )}>
            {goodsList.length > 0 &&
              goodsList.map(v => (
                <Pressable
                  onPress={() => {
                    if (validateExpiryDate(v.expiryDate) || v.quantity === 0) {
                    } else {
                      navigation.navigate(RouterList.Detail, {
                        goodsId: v.id,
                      });
                    }
                  }}
                  key={v.id}
                  style={tailwind('h-[280px]  w-[48%]  mb-[12px] ')}>
                  <View style={tailwind('w-full h-[150px]')}>
                    {(validateExpiryDate(v.expiryDate) || v.quantity === 0) && (
                      <View
                        style={tailwind('absolute inset-0 z-30 h-full w-full')}>
                        <View
                          style={tailwind(
                            'absolute inset-0 w-full h-full bg-black z-30 opacity-60',
                          )}
                        />
                        <View
                          style={tailwind(
                            'absolute inset-0 w-full h-full z-50 flex flex-col items-center justify-center',
                          )}>
                          <Text
                            style={tailwind(
                              'text-white text-[19px] leading-[22px] font-[600]',
                            )}>
                            품절
                          </Text>
                        </View>
                      </View>
                    )}
                    <FastImage
                      style={tailwind('h-full w-full')}
                      resizeMode={'cover'}
                      source={{uri: v.GoodsImage[0].location}}
                    />
                  </View>
                  <Text
                    numberOfLines={1}
                    style={tailwind(
                      'mt-[15px] text-[15px] leading-[18px] font-[400]',
                    )}>
                    {v.store.name}
                  </Text>
                  <Text
                    style={tailwind(
                      'mt-1 text-[18px] leading-[21px] text-[#39393B] font-[700]',
                    )}
                    numberOfLines={1}>
                    {v.name}
                  </Text>
                  <Text
                    style={[
                      tailwind('mt-2'),
                      {
                        textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid',
                        fontSize: 15,
                        lineHeight: 18,
                        color: '#A7A7A8',
                      },
                    ]}>
                    {`${converterPrice(v.originPrice.toString())}원`}
                  </Text>
                  <View style={tailwind('flex flex-row items-center')}>
                    <Text
                      style={tailwind(
                        'text-[18px] leading-[21px] font-[700] text-[#1C1C1E]',
                      )}>
                      {`${converterPrice(v.salePrice.toString())}원`}
                    </Text>
                    <Text
                      style={tailwind(
                        'text-[#FF2E00] text-[18px] leading-[21px] font-[700] ml-1',
                      )}>
                      {`${v.discount + v.additionalDiscount}%`}
                    </Text>
                  </View>
                  <View style={tailwind('flex flex-row items-center mt-1')}>
                    <Text
                      style={tailwind(
                        'text-[16px] leading-[19px] font-[700] text-[#0066FF]',
                      )}>
                      {`${formatRemainingExpiryDateKR(v.expiryDate)}`}
                    </Text>
                    {/* <Text
                      style={tailwind(
                        'text-[14px] font-[500] text-[#A7A7A8] ',
                      )}>
                      {`${getDistanceFromLatLonInKm(
                        address.latitude,
                        address.longitude,
                        v.store.latitude,
                        v.store.longitude,
                      )}km`}
                    </Text> */}
                  </View>
                </Pressable>
              ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
