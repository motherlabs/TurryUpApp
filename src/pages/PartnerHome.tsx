import {
  View,
  Alert,
  Pressable,
  Platform,
  StatusBar,
  Dimensions,
  Linking,
} from 'react-native';
import {DefaultFontText as Text} from '../components/DefaultFontText';
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
import DotIcon from '../assets/svg/dot.svg';
import FadeInOut from 'react-native-fade-in-out';
import {wait} from '../utils/timeout';
import {IOrder} from '../types/orderType';
import paymentAPI from '../api/paymentAPI';

export default function PartnerHome() {
  const tailwind = useTailwind();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const store = useSelector((state: RootState) => state.store.me);
  const [order, setOrder] = useState<IOrder | null>(null);
  const user = useSelector((state: RootState) => state.user.me);
  const [isModal, setIsModal] = useState(false);
  const [visible, setVisible] = useState(false);
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

  const cancelOrderAPIHandler = useCallback(
    async (orderNumber: string, cancelAmount: number) => {
      try {
        dispatch(loadingSlice.actions.setLoading(true));
        const response = await paymentAPI.cancelOrder({
          reason: '재고소진으로 인한 주문 취소',
          cancelAmount,
          orderNumber,
        });
        if (response.data) {
          Alert.alert('주문이 취소되었습니다.');
          const storeResponse = await storeAPI.findOne(user.id);
          if (storeResponse.data.status !== 404) {
            console.log('store exist');
            dispatch(storeSlice.actions.setStore(storeResponse.data));
          } else {
            // Alert.alert('상품등록이 필요합니다.');
            // return navigation.navigate(RouterList.MyInfo);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        dispatch(loadingSlice.actions.setLoading(false));
      }
    },
    [dispatch, user],
  );

  return (
    <>
      <SafeAreaView style={tailwind('bg-background')}>
        {store.userId === user.id && store.Goods && store.Goods.length > 0 ? (
          <View>
            <View
              style={tailwind(
                'h-[52px] flex flex-col items-center justify-center border-b border-[#EAEAEA]',
              )}>
              <Text
                style={tailwind(
                  'text-[21px] leading-[24px] font-[600]',
                )}>{`${formatMonthDay(date)} 판매 상품`}</Text>
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
                    } text-[14px] leading-[17px] font-[400]`,
                  )}>
                  판매중
                </Text>
                <Text
                  style={tailwind(
                    'text-[20px] leading-[23px] font-[700] mt-2',
                  )}>{`${
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
                    } text-[14px] leading-[17px] font-[400]`,
                  )}>
                  픽업 대기중
                </Text>
                <Text
                  style={tailwind(
                    'text-[20px] leading-[23px] font-[700] mt-2',
                  )}>{`${
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
                    } text-[14px] leading-[17px] font-[400]`,
                  )}>
                  픽업 완료
                </Text>
                <Text
                  style={tailwind(
                    'text-[20px] leading-[23px] font-[700] mt-2',
                  )}>
                  {`${
                    store.Order.filter(v => v.status === '픽업 완료').length
                  }`}
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
                    } text-[14px] leading-[17px] font-[400]`,
                  )}>
                  품절
                </Text>
                <Text
                  style={tailwind(
                    'text-[20px] leading-[23px] font-[700] mt-2',
                  )}>
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
                              style={tailwind(
                                'flex flex-row items-center mb-1',
                              )}>
                              <View
                                style={tailwind(
                                  'bg-[#1383EA0F] rounded-[4px] px-2 py-1 mr-2',
                                )}>
                                <Text
                                  style={tailwind(
                                    'text-[#1383EA] text-[13px] leading-[16px] font-[600]',
                                  )}>
                                  판매중
                                </Text>
                              </View>
                              <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={tailwind(
                                  'text-[19px] leading-[22px] font-[700]',
                                )}>
                                {v.name}
                              </Text>
                            </View>
                            <Text
                              style={tailwind(
                                'text-[15px] leading-[18px] font-[400] text-[#39393B]',
                              )}>{`유통기한 ${formatKR(
                              new Date(v.expiryDate),
                            )}`}</Text>
                            <Text
                              style={{
                                textDecorationLine: 'line-through',
                                textDecorationStyle: 'solid',
                                fontSize: 14,
                                lineHeight: 17,
                                color: '#A7A7A8',
                              }}>
                              {`${converterPrice(v.originPrice.toString())}원`}
                            </Text>
                            <View
                              style={tailwind('flex flex-row items-center')}>
                              <Text
                                style={tailwind(
                                  'text-[17px] leading-[20px] font-[700]',
                                )}>
                                {`${converterPrice(v.salePrice.toString())}원`}
                              </Text>
                              <Text
                                style={tailwind(
                                  'text-[17px] leading-[20px] ml-2 font-[700] text-[#FF490F]',
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
                          <Text
                            style={tailwind(
                              'text-[17px] leading-[20px] font-[500]',
                            )}>
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
                                'font-[400] text-[20px] leading-[23px]',
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
                                      'text-[#0BAB5E] text-[13px] leading-[16px] font-[600]',
                                    )}>
                                    픽업 대기중
                                  </Text>
                                </View>
                                <Text
                                  numberOfLines={1}
                                  ellipsizeMode="tail"
                                  style={tailwind(
                                    'text-[19px] leading-[22px] font-[700]',
                                  )}>
                                  {v.goods.name}
                                </Text>
                              </View>
                              <Text
                                style={tailwind(
                                  'text-[15px] leading-[18px] font-[400] text-[#39393B]',
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
                                  'font-[400] text-[15px] leading-[18px]  text-[#39393B]',
                                )}>{`수량: ${v.quantity}개`}</Text>
                              <View
                                style={tailwind('flex flex-row items-center')}>
                                <Text
                                  style={tailwind(
                                    'text-[17px] leading-[20px] font-[700]',
                                  )}>
                                  {`${converterPrice(
                                    (v.goods.salePrice * v.quantity).toString(),
                                  )}원`}
                                </Text>
                                {/* <Text
                                style={tailwind(
                                  'text-[14px] leading-[17px] ml-2 font-[700] text-[#FF490F]',
                                )}>
                                {`${v.goods.discount}%`}
                              </Text> */}
                              </View>
                            </View>
                          </View>
                        </View>

                        <Pressable
                          onPress={async () => {
                            setOrder(v);
                            setIsModal(true);
                            await wait(50);
                            setVisible(true);
                          }}
                          style={tailwind('flex flex-row items-center p-4')}>
                          <DotIcon width={3} height={16} fill={'black'} />
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
                                'font-[400] text-[20px] leading-[23px]',
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
                                      'text-[#7B7B7C] text-[13px] leading-[16px] font-[600]',
                                    )}>
                                    픽업 완료
                                  </Text>
                                </View>
                                <Text
                                  numberOfLines={1}
                                  ellipsizeMode="tail"
                                  style={tailwind(
                                    'text-[19px] leading-[22px] font-[700]',
                                  )}>
                                  {v.goods.name}
                                </Text>
                              </View>
                              <Text
                                style={tailwind(
                                  'text-[15px] leading-[18px] font-[400] text-[#39393B]',
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
                                  'font-[400] text-[12px] leading-[15px]  text-[#39393B]',
                                )}>{`수량: ${v.quantity}개`}</Text>

                              <View
                                style={tailwind('flex flex-row items-center')}>
                                <Text
                                  style={tailwind(
                                    'text-[17px] leading-[20px] font-[700]',
                                  )}>
                                  {`${converterPrice(
                                    (v.goods.salePrice * v.quantity).toString(),
                                  )}원`}
                                </Text>
                                {/* <Text
                                style={tailwind(
                                  'text-[14px] leading-[17px] ml-2 font-[700] text-[#FF490F]',
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
                              style={tailwind(
                                'flex flex-row items-center mb-1',
                              )}>
                              <View
                                style={tailwind(
                                  'bg-[#F4F4F4] rounded-[4px] px-2 py-1 mr-2',
                                )}>
                                <Text
                                  style={tailwind(
                                    'text-[#7B7B7C] text-[13px] leading-[16px] font-[600]',
                                  )}>
                                  품절
                                </Text>
                              </View>
                              <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={tailwind(
                                  'text-[19px] leading-[22px] font-[700]',
                                )}>
                                {v.name}
                              </Text>
                            </View>
                            <Text
                              style={tailwind(
                                'text-[15px] leading-[18px] font-[400] text-[#39393B]',
                              )}>{`유통기한 ${formatKR(
                              new Date(v.expiryDate),
                            )}`}</Text>
                            <Text
                              style={{
                                textDecorationLine: 'line-through',
                                textDecorationStyle: 'solid',
                                fontSize: 11,
                                lineHeight: 14,
                                color: '#A7A7A8',
                              }}>
                              {`${converterPrice(v.originPrice.toString())}원`}
                            </Text>
                            <View
                              style={tailwind('flex flex-row items-center')}>
                              <Text
                                style={tailwind(
                                  'text-[17px] leading-[20px] font-[700]',
                                )}>
                                {`${converterPrice(v.salePrice.toString())}원`}
                              </Text>
                              <Text
                                style={tailwind(
                                  'text-[17px] leading-[20px] ml-2 font-[700] text-[#FF490F]',
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
                          <Text
                            style={tailwind(
                              'text-[17px] leading-[20px] font-[500]',
                            )}>
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
              <Text
                style={tailwind(
                  'text-[21px] leading-[24px] font-[600]',
                )}>{`${formatMonthDay(date)} 판매 상품`}</Text>
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
                <Text
                  style={tailwind(
                    'text-[17px] leading-[20px] font-[400] text-[#A7A7A8]',
                  )}>
                  등록된 상품이 없습니다.
                </Text>
                <Text
                  style={tailwind(
                    'text-[17px] leading-[20px] font-[400] text-[#A7A7A8]',
                  )}>
                  상품을 등록해 보세요!
                </Text>
              </View>
              <View
                style={tailwind(
                  'absolute bottom-3 left-0 right-0 px-4 w-full',
                )}>
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
                    style={tailwind(
                      'text-black text-[19px] leading-[22px] font-[600] mr-1',
                    )}>
                    +
                  </Text>
                  <Text
                    style={tailwind(
                      'text-black text-[19px] leading-[22px] font-[600]',
                    )}>
                    상품 등록 하기
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        <Tabbar type={TabbarType.SALLERHOME} />
      </SafeAreaView>
      {isModal && (
        <Pressable
          onPress={() => {
            setIsModal(false);
            setVisible(false);
          }}
          style={tailwind(
            'absolute z-50 inset-0 flex flex-col items-center justify-end bg-[#00000066] h-full w-full',
          )}>
          <FadeInOut style={tailwind('w-full')} visible={visible} scale={true}>
            <View
              style={tailwind(
                'flex flex-col items-center px-2 w-full  pb-[32px]',
              )}>
              <Pressable
                onPress={() => {
                  Alert.alert('픽업을 완료하시겠습니까?', '', [
                    {
                      text: '닫기',
                      style: 'cancel',
                    },
                    {
                      text: '픽업완료',
                      onPress: () => {
                        if (order) {
                          updateStatusOrderAPIHandler(order.id);
                          setIsModal(false);
                          setVisible(false);
                        }
                      },
                    },
                  ]);
                }}
                style={tailwind(
                  'h-[60px] bg-[#F5F5F5CC] rounded-t-[13px] w-full flex flex-col items-center justify-center',
                )}>
                <Text
                  style={tailwind(
                    'text-[#007AFF] text-[20px] leading-[23px] font-[400]',
                  )}>
                  픽업 완료
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  Alert.alert('정말 주문을 취소하시겠나요?', '', [
                    {
                      text: '닫기',
                      style: 'cancel',
                    },
                    {
                      text: '주문취소',
                      onPress: () => {
                        if (order) {
                          cancelOrderAPIHandler(
                            order.orderNumber,
                            order.goods.salePrice * order.quantity,
                          );
                          setIsModal(false);
                          setVisible(false);
                        }
                      },
                    },
                  ]);
                }}
                style={tailwind(
                  'h-[60px] bg-[#F5F5F5CC] rounded-b-[13px] mt-[1px] w-full flex flex-col items-center justify-center ',
                )}>
                <Text
                  style={tailwind(
                    'text-[#FF3B30] text-[20px] leading-[23px] font-[400]',
                  )}>
                  주문 취소
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setIsModal(false);
                  setVisible(false);
                }}
                style={tailwind(
                  'h-[60px] bg-white rounded-[13px] w-full mt-2 flex flex-col items-center justify-center',
                )}>
                <Text
                  style={tailwind(
                    'text-blue-500 text-[20px] leading-[23px] font-[600]',
                  )}>
                  취소
                </Text>
              </Pressable>
            </View>
          </FadeInOut>
        </Pressable>
      )}
    </>
  );
}
