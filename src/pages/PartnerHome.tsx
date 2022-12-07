import {
  View,
  Text,
  Alert,
  Pressable,
  Platform,
  StatusBar,
  Dimensions,
  Linking,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTailwind} from 'tailwind-rn/dist';
import {ScrollView} from 'react-native-gesture-handler';
import Tabbar, {TabbarType} from '../components/Tabbar';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList, RouterList} from '../../Router';
import {useAppDispatch} from '../store';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import loadingSlice from '../slices/loadingSlice';
import storeSlice from '../slices/storeSlice';
import storeAPI from '../api/storeAPI';
import {formatKR, formatMonthDay} from '../utils/dateFormat';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import ArrowRight12 from '../assets/svg/arrow-right-12.svg';
import FastImage from 'react-native-fast-image';
import {converterPrice} from '../utils/convertPrice';
import orderAPI from '../api/orderAPI';

export default function PartnerHome() {
  const tailwind = useTailwind();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const store = useSelector((state: RootState) => state.store.me);
  const user = useSelector((state: RootState) => state.user.me);
  const [date] = useState(new Date());
  const [filter, setFilter] = useState<
    '판매중' | '픽업 대기중' | '픽업 완료' | '품절'
  >('판매중');
  const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;

  useEffect(() => {
    if (user.id > 0) {
      const findAllStoreApiHandler = async () => {
        dispatch(loadingSlice.actions.setLoading(true));
        const response = await storeAPI.findOne(user.id);
        dispatch(loadingSlice.actions.setLoading(false));
        if (response.data.status !== 404) {
          console.log('store exist');
          dispatch(storeSlice.actions.setStore(response.data));
        } else {
          // Alert.alert('상품등록이 필요합니다.');
          // return navigation.navigate(RouterList.MyInfo);
        }
      };
      findAllStoreApiHandler();
    }
  }, [dispatch, user, navigation]);

  const changeFilterHandler = useCallback(
    (data: '판매중' | '픽업 대기중' | '픽업 완료' | '품절') => {
      setFilter(data);
    },
    [],
  );

  const updateStatusOrderAPIHandler = useCallback(
    async (orderId: number) => {
      try {
        dispatch(loadingSlice.actions.setLoading(true));
        const response = await orderAPI.updateStatus({
          orderId,
          status: '픽업 완료',
        });
        if (response.data.status === '픽업 완료') {
          const storeData = await storeAPI.findOne(user.id);
          if (storeData.data.status !== 404) {
            console.log('store exist');
            dispatch(storeSlice.actions.setStore(storeData.data));
          }
        } else {
          Alert.alert('정상 처리 되지 못했습니다 관리자에게 문의하세요.');
        }
      } catch (e) {
        console.log(e);
        Alert.alert('정상 처리 되지 못했습니다 관리자에게 문의하세요.');
      } finally {
        dispatch(loadingSlice.actions.setLoading(false));
      }
    },
    [dispatch, user],
  );

  return (
    <SafeAreaView style={tailwind('bg-background')}>
      {store.userId === user.id && store.Goods && store.Goods.length > 0 ? (
        <View>
          <View
            style={tailwind(
              'h-[52px] flex flex-col items-center justify-center border-b border-[#EAEAEA]',
            )}>
            <Text style={tailwind('text-[21px] font-[600]')}>{`${formatMonthDay(
              date,
            )} 판매 상품`}</Text>
          </View>

          <View
            style={tailwind(
              'flex flex-row h-[72px] bg-[#FAFAFA] items-center  border-b border-[#EAEAEA] ',
            )}>
            <Pressable
              onPress={() => {
                changeFilterHandler('판매중');
              }}
              style={tailwind(
                'flex flex-col w-1/4 p-3 border-r border-[#EAEAEA]',
              )}>
              <Text
                style={tailwind(
                  `${
                    filter === '판매중' ? 'text-primary_og' : 'text-[#888888]'
                  } text-[14px] font-[400]`,
                )}>
                판매중
              </Text>
              <Text style={tailwind('text-[20px] font-[700] mt-2')}>{`${
                store.Goods.filter(v => v.quantity > 0).length
              }`}</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                changeFilterHandler('픽업 대기중');
              }}
              style={tailwind(
                'flex flex-col w-1/4 p-3 border-r border-[#EAEAEA]',
              )}>
              <Text
                style={tailwind(
                  `${
                    filter === '픽업 대기중'
                      ? 'text-primary_og'
                      : 'text-[#888888]'
                  } text-[14px] font-[400]`,
                )}>
                픽업 대기중
              </Text>
              <Text style={tailwind('text-[20px] font-[700] mt-2')}>{`${
                store.Order.filter(v => v.status === '픽업 대기중').length
              }`}</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                changeFilterHandler('픽업 완료');
              }}
              style={tailwind(
                'flex flex-col w-1/4 p-3 border-r border-[#EAEAEA]',
              )}>
              <Text
                style={tailwind(
                  `${
                    filter === '픽업 완료'
                      ? 'text-primary_og'
                      : 'text-[#888888]'
                  } text-[14px] font-[400]`,
                )}>
                픽업 완료
              </Text>
              <Text style={tailwind('text-[20px] font-[700] mt-2')}>
                {`${store.Order.filter(v => v.status === '픽업 완료').length}`}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                changeFilterHandler('품절');
              }}
              style={tailwind('flex flex-col w-1/4 p-3')}>
              <Text
                style={tailwind(
                  `${
                    filter === '품절' ? 'text-primary_og' : 'text-[#888888]'
                  } text-[14px] font-[400]`,
                )}>
                품절
              </Text>
              <Text style={tailwind('text-[20px] font-[700] mt-2')}>
                {`${store.Goods.filter(v => v.quantity === 0).length}`}
              </Text>
            </Pressable>
          </View>
          <View
            style={[
              tailwind(``),
              {
                height:
                  Dimensions.get('window').height - 214 - StatusBarHeight!,
              },
            ]}>
            <ScrollView style={tailwind('h-full bg-background')}>
              {filter === '판매중' &&
                store.Goods.filter(v => v.quantity > 0).map(v => (
                  <View key={v.id} style={tailwind('')}>
                    <View
                      style={tailwind(
                        'flex flex-row border-b border-[#F4F4F4] px-4 py-4 items-center justify-between',
                      )}>
                      <View style={tailwind('flex flex-row items-center')}>
                        <View style={tailwind('w-[82px] h-[82px] mr-4')}>
                          <FastImage
                            style={tailwind('w-full h-full ')}
                            source={{uri: v.GoodsImage[0].location}}
                          />
                        </View>
                        <View style={tailwind(' w-[130px]')}>
                          <View
                            style={tailwind('flex flex-row items-center mb-1')}>
                            <View
                              style={tailwind(
                                'bg-[#1383EA0F] rounded-[4px] px-2 py-1 mr-2',
                              )}>
                              <Text
                                style={tailwind(
                                  'text-[#1383EA] text-[13px] font-[600]',
                                )}>
                                판매중
                              </Text>
                            </View>
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={tailwind('text-[19px] font-[700]')}>
                              {v.name}
                            </Text>
                          </View>
                          <Text
                            style={tailwind(
                              'text-[15px] font-[400] text-[#39393B]',
                            )}>{`유통기한 ${formatKR(
                            new Date(v.expiryDate),
                          )}`}</Text>
                          <Text
                            style={{
                              textDecorationLine: 'line-through',
                              textDecorationStyle: 'solid',
                              fontSize: 14,
                              color: '#A7A7A8',
                            }}>
                            {`${converterPrice(v.originPrice.toString())}원`}
                          </Text>
                          <View style={tailwind('flex flex-row items-center')}>
                            <Text style={tailwind('text-[17px] font-[700]')}>
                              {`${converterPrice(v.salePrice.toString())}원`}
                            </Text>
                            <Text
                              style={tailwind(
                                'text-[17px] ml-2 font-[700] text-[#FF490F]',
                              )}>
                              {`${v.discount + v.additionalDiscount}%`}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Pressable
                        onPress={() => {
                          navigation.navigate(RouterList.GoodsAdd, {
                            isUpdate: true,
                            goodsId: v.id,
                            isHome: true,
                          });
                        }}
                        style={tailwind('flex flex-row items-center')}>
                        <Text style={tailwind('text-[17px] font-[500]')}>
                          상품 수정
                        </Text>
                        <ArrowRight12 />
                      </Pressable>
                    </View>
                  </View>
                ))}
              {filter === '픽업 대기중' &&
                store.Order.filter(v => v.status === '픽업 대기중').map(v => (
                  <View key={v.id} style={tailwind('')}>
                    <View
                      style={tailwind(
                        'flex flex-row border-b border-[#F4F4F4] px-4 py-4 items-center justify-between',
                      )}>
                      <View>
                        <Pressable
                          style={tailwind('mb-1')}
                          onPress={() => {
                            Linking.openURL(
                              `tel:${v.payment.user.phoneNumber}`,
                            );
                          }}>
                          <Text
                            style={tailwind(
                              'font-[400] text-[20px]',
                            )}>{`${v.payment.user.phoneNumber.substring(
                            0,
                            3,
                          )}-${v.payment.user.phoneNumber.substring(
                            3,
                            7,
                          )}-${v.payment.user.phoneNumber.substring(
                            7,
                            11,
                          )}`}</Text>
                        </Pressable>

                        <View style={tailwind('flex flex-row items-center')}>
                          <View style={tailwind('w-[82px] h-[82px] mr-4')}>
                            <FastImage
                              style={tailwind('w-full h-full ')}
                              source={{uri: v.goods.GoodsImage[0].location}}
                            />
                          </View>
                          <View style={tailwind(' w-[130px]')}>
                            <View
                              style={tailwind(
                                'flex flex-row items-center mb-1',
                              )}>
                              <View
                                style={tailwind(
                                  'bg-[#E6FAF0] rounded-[4px] px-2 py-1 mr-2',
                                )}>
                                <Text
                                  style={tailwind(
                                    'text-[#0BAB5E] text-[13px] font-[600]',
                                  )}>
                                  픽업 대기중
                                </Text>
                              </View>
                              <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={tailwind('text-[19px] font-[700]')}>
                                {v.goods.name}
                              </Text>
                            </View>
                            <Text
                              style={tailwind(
                                'text-[15px] font-[400] text-[#39393B]',
                              )}>{`유통기한 ${formatKR(
                              v.goods.expiryDate,
                            )}`}</Text>
                            {/* <Text
                              style={{
                                textDecorationLine: 'line-through',
                                textDecorationStyle: 'solid',
                                fontSize: 11,
                                color: '#A7A7A8',
                              }}>
                              {`${converterPrice(
                                v.goods.originPrice.toString(),
                              )}원`}
                            </Text> */}
                            <Text
                              style={tailwind(
                                'font-[400] text-[15px]  text-[#39393B]',
                              )}>{`수량: ${v.quantity}개`}</Text>
                            <View
                              style={tailwind('flex flex-row items-center')}>
                              <Text style={tailwind('text-[17px] font-[700]')}>
                                {`${converterPrice(
                                  (v.goods.salePrice * v.quantity).toString(),
                                )}원`}
                              </Text>
                              {/* <Text
                                style={tailwind(
                                  'text-[14px] ml-2 font-[700] text-[#FF490F]',
                                )}>
                                {`${v.goods.discount}%`}
                              </Text> */}
                            </View>
                          </View>
                        </View>
                      </View>
                      <Pressable
                        onPress={() => {
                          Alert.alert('픽업을 완료하시겠습니까?', '', [
                            {
                              text: '아니요',
                              style: 'cancel',
                            },
                            {
                              text: '네',
                              onPress: () => {
                                updateStatusOrderAPIHandler(v.id);
                              },
                            },
                          ]);
                        }}
                        style={tailwind('flex flex-row items-center')}>
                        <Text style={tailwind('text-[17px] font-[500]')}>
                          픽업 완료
                        </Text>
                        <ArrowRight12 />
                      </Pressable>
                    </View>
                  </View>
                ))}

              {filter === '픽업 완료' &&
                store.Order.filter(v => v.status === '픽업 완료').map(v => (
                  <View key={v.id} style={tailwind('')}>
                    <View
                      style={tailwind(
                        'flex flex-row border-b border-[#F4F4F4] px-4 py-4 items-center justify-between',
                      )}>
                      <View>
                        <Pressable
                          style={tailwind('mb-1')}
                          onPress={() => {
                            Linking.openURL(
                              `tel:${v.payment.user.phoneNumber}`,
                            );
                          }}>
                          <Text
                            style={tailwind(
                              'font-[400] text-[20px]',
                            )}>{`${v.payment.user.phoneNumber.substring(
                            0,
                            3,
                          )}-${v.payment.user.phoneNumber.substring(
                            3,
                            7,
                          )}-${v.payment.user.phoneNumber.substring(
                            7,
                            11,
                          )}`}</Text>
                        </Pressable>

                        <View style={tailwind('flex flex-row items-center')}>
                          <View style={tailwind('w-[82px] h-[82px] mr-4')}>
                            <FastImage
                              style={tailwind('w-full h-full ')}
                              source={{uri: v.goods.GoodsImage[0].location}}
                            />
                          </View>
                          <View style={tailwind(' w-[130px]')}>
                            <View
                              style={tailwind(
                                'flex flex-row items-center mb-1',
                              )}>
                              <View
                                style={tailwind(
                                  'bg-[#F4F4F4] rounded-[4px] px-2 py-1 mr-2',
                                )}>
                                <Text
                                  style={tailwind(
                                    'text-[#7B7B7C] text-[13px] font-[600]',
                                  )}>
                                  픽업 완료
                                </Text>
                              </View>
                              <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={tailwind('text-[19px] font-[700]')}>
                                {v.goods.name}
                              </Text>
                            </View>
                            <Text
                              style={tailwind(
                                'text-[15px] font-[400] text-[#39393B]',
                              )}>{`유통기한 ${formatKR(
                              v.goods.expiryDate,
                            )}`}</Text>
                            {/* <Text
                              style={{
                                textDecorationLine: 'line-through',
                                textDecorationStyle: 'solid',
                                fontSize: 11,
                                color: '#A7A7A8',
                              }}>
                              {`${converterPrice(
                                v.goods.originPrice.toString(),
                              )}원`}
                            </Text> */}
                            <Text
                              style={tailwind(
                                'font-[400] text-[12px]  text-[#39393B]',
                              )}>{`수량: ${v.quantity}개`}</Text>

                            <View
                              style={tailwind('flex flex-row items-center')}>
                              <Text style={tailwind('text-[17px] font-[700]')}>
                                {`${converterPrice(
                                  (v.goods.salePrice * v.quantity).toString(),
                                )}원`}
                              </Text>
                              {/* <Text
                                style={tailwind(
                                  'text-[14px] ml-2 font-[700] text-[#FF490F]',
                                )}>
                                {`${v.goods.discount}%`}
                              </Text> */}
                            </View>
                          </View>
                        </View>
                      </View>
                      <View></View>
                    </View>
                  </View>
                ))}
              {filter === '품절' &&
                store.Goods.filter(v => v.quantity === 0).map(v => (
                  <View key={v.id} style={tailwind('')}>
                    <View
                      style={tailwind(
                        'flex flex-row border-b border-[#F4F4F4] px-4 py-4 items-center justify-between',
                      )}>
                      <View style={tailwind('flex flex-row items-center')}>
                        <View style={tailwind('w-[82px] h-[82px] mr-4')}>
                          <FastImage
                            style={tailwind('w-full h-full ')}
                            source={{uri: v.GoodsImage[0].location}}
                          />
                        </View>
                        <View style={tailwind(' w-[130px]')}>
                          <View
                            style={tailwind('flex flex-row items-center mb-1')}>
                            <View
                              style={tailwind(
                                'bg-[#F4F4F4] rounded-[4px] px-2 py-1 mr-2',
                              )}>
                              <Text
                                style={tailwind(
                                  'text-[#7B7B7C] text-[13px] font-[600]',
                                )}>
                                품절
                              </Text>
                            </View>
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={tailwind('text-[19px] font-[700]')}>
                              {v.name}
                            </Text>
                          </View>
                          <Text
                            style={tailwind(
                              'text-[15px] font-[400] text-[#39393B]',
                            )}>{`유통기한 ${formatKR(
                            new Date(v.expiryDate),
                          )}`}</Text>
                          <Text
                            style={{
                              textDecorationLine: 'line-through',
                              textDecorationStyle: 'solid',
                              fontSize: 11,
                              color: '#A7A7A8',
                            }}>
                            {`${converterPrice(v.originPrice.toString())}원`}
                          </Text>
                          <View style={tailwind('flex flex-row items-center')}>
                            <Text style={tailwind('text-[17px] font-[700]')}>
                              {`${converterPrice(v.salePrice.toString())}원`}
                            </Text>
                            <Text
                              style={tailwind(
                                'text-[17px] ml-2 font-[700] text-[#FF490F]',
                              )}>
                              {`${v.discount + v.additionalDiscount}%`}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Pressable
                        onPress={() => {
                          navigation.navigate(RouterList.GoodsAdd, {
                            isUpdate: true,
                            goodsId: v.id,
                            isHome: true,
                          });
                        }}
                        style={tailwind('flex flex-row items-center')}>
                        <Text style={tailwind('text-[17px] font-[500]')}>
                          재등록
                        </Text>
                        <ArrowRight12 />
                      </Pressable>
                    </View>
                  </View>
                ))}
            </ScrollView>
          </View>
        </View>
      ) : (
        <View>
          <View
            style={tailwind(
              'h-[52px] flex flex-col items-center justify-center border-b border-[#EAEAEA]',
            )}>
            <Text style={tailwind('text-[21px] font-[600]')}>{`${formatMonthDay(
              date,
            )} 판매 상품`}</Text>
          </View>
          <View
            style={[
              tailwind(
                'h-full w-full flex flex-col items-center justify-center relative',
              ),
              {
                height:
                  Dimensions.get('window').height - 142 - StatusBarHeight!,
              },
            ]}>
            <View
              style={tailwind(
                'absolute top-[40%] right-0 left-0 w-full flex flex-col items-center justify-center',
              )}>
              <Text style={tailwind('text-[17px] font-[400] text-[#A7A7A8]')}>
                등록된 상품이 없습니다.
              </Text>
              <Text style={tailwind('text-[17px] font-[400] text-[#A7A7A8]')}>
                상품을 등록해 보세요!
              </Text>
            </View>
            <View
              style={tailwind('absolute bottom-3 left-0 right-0 px-4 w-full')}>
              <Pressable
                onPress={() => {
                  if (store.name === '') {
                    Alert.alert('매장설정을 통해 매장을 등록해주세요.');
                    navigation.navigate(RouterList.MyInfo);
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
                }}
                style={tailwind(
                  'flex flex-row items-center justify-center w-full h-[52px] rounded-[4px] bg-primary',
                )}>
                <Text
                  style={tailwind('text-black text-[19px] font-[600] mr-1')}>
                  +
                </Text>
                <Text style={tailwind('text-black text-[19px] font-[600]')}>
                  상품 등록 하기
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
      <Tabbar type={TabbarType.SALLERHOME} />
    </SafeAreaView>
  );
}