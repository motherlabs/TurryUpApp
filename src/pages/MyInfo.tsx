import {
  View,
  Text,
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
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList, RouterList} from '../../Router';
import {UserRole, UserState} from '../types/userType';
import userSlice from '../slices/userSlice';
import {useAppDispatch} from '../store';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import loadingSlice from '../slices/loadingSlice';
import paymentAPI from '../api/paymentAPI';
import {converterPrice} from '../utils/convertPrice';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Tabbar, {TabbarType} from '../components/Tabbar';
import SettingIcon from '../assets/svg/setting.svg';
import ArrowRight24 from '../assets/svg/arrow-right-24.svg';
import {IPayment} from '../types/paymentType';
import FastImage from 'react-native-fast-image';
import {formatKR} from '../utils/dateFormat';
import storeSlice from '../slices/storeSlice';
import orderAPI from '../api/orderAPI';
import {IOrder} from '../types/orderType';
import {getBusinessHours, getBusinessHoursTime} from '../utils/businessHours';
import {validateExpiryDate} from '../utils/validateExpiryDate';

export default function MyInfo() {
  const tailwind = useTailwind();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user.me);
  const store = useSelector((state: RootState) => state.store.me);

  const [monthlySaving, setMonthlySaving] = useState(0);
  const [monthlySaleAmount, setMonthlySaleAmount] = useState(0);
  const [previewBuyHistory, setPreviewBuyHistory] = useState<IPayment | null>(
    null,
  );
  const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;

  useEffect(() => {
    const monthlyOrdersAPIHandlerfromStore = async () => {
      dispatch(loadingSlice.actions.setLoading(true));
      const storeResponse = await orderAPI.monthlyOrders();
      dispatch(loadingSlice.actions.setLoading(false));
      if (storeResponse.data.response.statusCode !== 404) {
        console.log('store exist');
        dispatch(storeSlice.actions.setStore(storeResponse.data.data));
        const monthlyOrders: IOrder[] = storeResponse.data.data.Order;
        if (monthlyOrders && monthlyOrders.length > 0) {
          setMonthlySaleAmount(0);
          monthlyOrders.map(v => {
            setMonthlySaleAmount(prev => prev + v.price);
          });
        }
      } else {
        dispatch(storeSlice.actions.setName(''));
        console.log('store not found');
      }
    };
    if (user.id > 0 && user.state === UserState.SELLER) {
      monthlyOrdersAPIHandlerfromStore();
    }
  }, [dispatch, user]);

  useEffect(() => {
    const monthlyPaymentsAPIHandler = async () => {
      dispatch(loadingSlice.actions.setLoading(true));
      const paymentResponse = await paymentAPI.monthlyPayments();
      const monthlyPayments: IPayment[] = paymentResponse.data;
      if (monthlyPayments && monthlyPayments.length > 0) {
        setMonthlySaving(0);
        monthlyPayments.map(v => {
          v.Order.map(item => {
            setMonthlySaving(
              prev =>
                prev +
                (item.goods.originPrice - item.goods.salePrice) * item.quantity,
            );
          });
        });
        setPreviewBuyHistory(monthlyPayments[0]);
      }
      dispatch(loadingSlice.actions.setLoading(false));
    };
    if (user.id > 0 && user.state === UserState.BUYER) {
      monthlyPaymentsAPIHandler();
    }
  }, [user, dispatch]);

  const changeUserStateHandler = useCallback(
    (state: UserState) => {
      dispatch(userSlice.actions.changeState(state));
    },
    [dispatch],
  );

  return (
    <SafeAreaView style={tailwind('bg-background')}>
      <View
        style={tailwind(
          'flex flex-col items-end justify-center px-4 h-[50px] bg-background',
        )}>
        <Pressable
          onPress={() => {
            navigation.navigate(RouterList.Setting);
          }}
          style={tailwind('')}>
          <SettingIcon />
        </Pressable>
      </View>
      <ScrollView
        style={{
          height: Dimensions.get('window').height - 140 - StatusBarHeight!,
        }}>
        {user.state === UserState.BUYER ? (
          <View style={tailwind(' h-full bg-background relative')}>
            <View style={tailwind('px-5 flex flex-row  items-center mb-4')}>
              {/* <Text style={tailwind(' text-[26px] leading-[29px] font-[700]')}>
                {`${user.phoneNumber.substring(
                  0,
                  3,
                )}-${user.phoneNumber.substring(3, 7)}-`}
              </Text> */}
              <Text
                style={tailwind(
                  ' text-[26px] leading-[29px] font-[700] text-primary_og',
                )}>
                {`${user.phoneNumber.substring(7, 11)}`}
              </Text>
              <Text
                style={tailwind(' text-[26px] leading-[29px] font-[700] ml-1')}>
                님
              </Text>
            </View>
            <View style={tailwind('px-5')}>
              <Text
                style={tailwind(
                  ' text-[17px] leading-[20px] font-[400] text-[#7B7B7C]',
                )}>
                휴대폰 뒷번호 4자리 확인 후 상품을 픽업해 주세요.
              </Text>
            </View>
            <View style={tailwind('h-[1px] my-7 w-full bg-[#E9E9E9]')}></View>
            <View style={tailwind('px-5 mb-8')}>
              <View
                style={tailwind(
                  'bg-[#FAFAFA] px-4 h-[55px]   flex flex-row items-center justify-between',
                )}>
                <View>
                  <Text
                    style={tailwind(
                      'text-[21px] leading-[24px] font-[600] text-[#1C1C1E]',
                    )}>
                    이번달 절약한 금액
                  </Text>
                </View>
                <View>
                  <Text
                    style={tailwind(
                      'font-[700] text-[21px] leading-[24px] text-[#1C1C1E]',
                    )}>
                    {converterPrice(`${monthlySaving} 원`)}
                  </Text>
                </View>
              </View>
            </View>
            {previewBuyHistory && (
              <View style={tailwind('px-5 mb-[32px]')}>
                <Text
                  style={tailwind(
                    'text-[19px] leading-[22px] text-[#1C1C1E] font-[600] mb-[18px]',
                  )}>
                  구매내역
                </Text>
                {previewBuyHistory.Order.map(v => (
                  <View
                    key={v.id}
                    style={tailwind('flex flex-row items-center mb-5')}>
                    <FastImage
                      style={tailwind('w-[95px] h-[95px] mr-4')}
                      source={{
                        uri:
                          v.goods.GoodsImage.length > 0
                            ? v.goods.GoodsImage[0].location
                            : '',
                      }}
                    />
                    <View
                      style={tailwind('flex flex-col justify-center h-[80px]')}>
                      <View style={tailwind('flex flex-col items-start')}>
                        {v.status === '픽업 완료' ? (
                          <View
                            style={tailwind(
                              'bg-[#F4F4F4] rounded-[4px] px-2 py-1 mr-1',
                            )}>
                            <Text
                              style={tailwind(
                                'text-[#7B7B7C] text-[13px] leading-[16px] font-[600]',
                              )}>
                              {v.status}
                            </Text>
                          </View>
                        ) : validateExpiryDate(v.goods.expiryDate) ? (
                          <View
                            style={tailwind(
                              'bg-[#FFEBED] rounded-[4px] px-2 py-1 mr-1',
                            )}>
                            <Text
                              style={tailwind(
                                'text-[#EC344A] text-[13px] leading-[16px] font-[600]',
                              )}>
                              유통기한 초과 픽업불가
                            </Text>
                          </View>
                        ) : getBusinessHours(
                            v.goods.store.dayOff,
                            v.goods.store.businessHours,
                          ) === '영업중' ? (
                          <View
                            style={tailwind(
                              'bg-light rounded-[4px] px-2 py-1 mr-1',
                            )}>
                            <Text
                              style={tailwind(
                                'text-dark text-[13px] leading-[16px] font-[600]',
                              )}>
                              {v.status}
                            </Text>
                          </View>
                        ) : (
                          <View
                            style={tailwind(
                              'bg-[#FFEBED] rounded-[4px] px-2 py-1 mr-1',
                            )}>
                            <Text
                              style={tailwind(
                                'text-[#EC344A] text-[13px] leading-[16px] font-[600]',
                              )}>
                              영업시간 종료 픽업불가
                            </Text>
                          </View>
                        )}

                        <Text
                          style={tailwind(
                            'text-[17px] leading-[20px] font-[700] mt-1',
                          )}>
                          {v.goods.store.name}
                        </Text>
                      </View>
                      <Text
                        style={tailwind(
                          'text-[#39393B] text-[15px] leading-[18px] font-[400] mb-1 mt-1',
                        )}>
                        {v.goods.name}
                      </Text>
                      <Text
                        style={tailwind(
                          'text-[#A7A7A8] text-[14px] leading-[17px] font-[500] mb-1',
                        )}>{`픽업 가능시간 ${
                        getBusinessHoursTime(v.goods.store.businessHours) ===
                        '00:00-00:00'
                          ? '휴무'
                          : getBusinessHoursTime(v.goods.store.businessHours)
                      }`}</Text>
                      <Text
                        style={tailwind(
                          'text-[#A7A7A8] text-[14px] leading-[17px] font-[500]',
                        )}>{`결제일시 ${formatKR(
                        new Date(previewBuyHistory.createdAt),
                      ).slice(2, 10)}`}</Text>
                    </View>
                  </View>
                ))}
                <Pressable
                  onPress={() => {
                    navigation.navigate(RouterList.BuyHistory);
                  }}
                  style={tailwind(
                    'h-[39px] flex flex-col items-center justify-center border border-[#E9E9E9]',
                  )}>
                  <Text
                    style={tailwind('text-[15px] leading-[18px] font-[400]')}>
                    구매내역 전체보기
                  </Text>
                </Pressable>
              </View>
            )}
            <View style={tailwind('px-5')}>
              <Text
                style={tailwind(
                  'text-[19px] leading-[22px] text-[#1C1C1E] font-[600] mb-[18px]',
                )}>
                고객센터
              </Text>
              <Pressable
                onPress={() => {
                  Linking.openURL(`tel:010-2784-2756`);
                }}
                style={tailwind(
                  ' py-[18px] border-b border-[#E9E9E9] flex flex-row items-center justify-between',
                )}>
                <Text style={tailwind('text-[17px] leading-[20px] font-[400]')}>
                  고객센터 바로연결
                </Text>
                <ArrowRight24 />
              </Pressable>
              {user.role === UserRole.PARTNER ||
              user.role === UserRole.ADMIN ? (
                <Pressable
                  onPress={() => {
                    changeUserStateHandler(UserState.SELLER);
                  }}
                  style={tailwind(
                    ' py-[18px] border-b border-[#E9E9E9] flex flex-row items-center justify-between',
                  )}>
                  <Text
                    style={tailwind('text-[17px] leading-[20px] font-[400]')}>
                    판매자 페이지로 전환하기
                  </Text>
                  <ArrowRight24 />
                </Pressable>
              ) : (
                <View></View>
              )}
              {user.role === UserRole.ADMIN && (
                <Pressable
                  onPress={() => {
                    navigation.navigate(RouterList.Admin);
                  }}
                  style={tailwind(
                    ' py-[18px] border-b border-[#E9E9E9] flex flex-row items-center justify-between',
                  )}>
                  <Text
                    style={tailwind('text-[17px] leading-[20px] font-[400]')}>
                    유저 / 파트너 관리
                  </Text>
                  <ArrowRight24 />
                </Pressable>
              )}
            </View>
          </View>
        ) : (
          <View style={tailwind(' h-full bg-background relative')}>
            {/* <View
              style={tailwind(
                'flex flex-col items-end justify-center px-4 h-[50px]',
              )}>
              <Pressable
                onPress={() => {
                  navigation.navigate(RouterList.Setting);
                }}
                style={tailwind('')}>
                <SettingIcon />
              </Pressable>
            </View> */}
            <View style={tailwind('border-b border-[#E9E9E9] pb-[28px]')}>
              <View style={tailwind('px-5 flex flex-row items-center mb-3')}>
                {/* {user.role === UserRole.ADMIN ? (
                  <Text
                    style={tailwind(' text-[26px] leading-[29px] font-[700] text-primary')}>
                    {`관리자`}
                  </Text>
                ) :  */}
                {store.name === '' ? (
                  <Text
                    style={tailwind(
                      ' text-[26px] leading-[29px] font-[700] text-primary_og',
                    )}>
                    매장 등록이 필요합니다.
                  </Text>
                ) : (
                  <Text
                    style={tailwind(
                      ' text-[26px] leading-[29px] font-[700] text-primary_og',
                    )}>
                    {store.name}
                  </Text>
                )}
                {store.name !== '' && (
                  <Text
                    style={tailwind(
                      ' text-[26px] leading-[29px] font-[700] ml-1 ',
                    )}>
                    님
                  </Text>
                )}
              </View>
              <View style={tailwind('px-5')}>
                <Text
                  style={tailwind(
                    ' text-[17px] leading-[20px] font-[400] text-[#7B7B7C]',
                  )}>
                  휴대폰 뒷번호 4자리 확인 후 상품을 전달해 주세요.
                </Text>
              </View>
            </View>
            <View style={tailwind('px-5 mt-[28px] mb-[32px]')}>
              <View
                style={tailwind(
                  'bg-[#FAFAFA] px-4 h-[55px]   flex flex-row items-center justify-between',
                )}>
                <View>
                  <Text
                    style={tailwind(
                      'text-[21px] leading-[24px] font-[600] text-[#1C1C1E]',
                    )}>
                    이번달 판매한 금액
                  </Text>
                </View>
                <View>
                  <Text
                    style={tailwind(
                      'font-[700] text-[21px] leading-[24px] text-[#1C1C1E]',
                    )}>
                    {converterPrice(`${monthlySaleAmount} 원`)}
                  </Text>
                </View>
              </View>
            </View>
            <View style={tailwind('px-5 mb-[32px]')}>
              <Text
                style={tailwind(
                  'text-[19px] leading-[22px] text-[#1C1C1E] font-[600] mb-[18px]',
                )}>
                매장관리
              </Text>
              {/* <Pressable
                onPress={() => {
                  navigation.navigate(RouterList.GoodsManagement);
                }}
                style={tailwind(
                  ' py-[18px] border-b border-[#E9E9E9] flex flex-row items-center justify-between',
                )}>
                <Text style={tailwind('text-[14px] leading-[17px] font-[400]')}>
                  상품 관리 및 수정
                </Text>
                <ArrowRight24 />
              </Pressable> */}
              <Pressable
                onPress={() => {
                  navigation.navigate(RouterList.StoreAdd, {targeId: 0});
                }}
                style={tailwind(
                  ' py-[18px] border-b border-[#E9E9E9] flex flex-row items-center justify-between',
                )}>
                <Text style={tailwind('text-[17px] leading-[20px] font-[400]')}>
                  매장 설정
                </Text>
                <ArrowRight24 />
              </Pressable>
            </View>
            <View style={tailwind('px-5 ')}>
              <Text
                style={tailwind(
                  'text-[19px] leading-[22px] text-[#1C1C1E] font-[600] mb-[18px]',
                )}>
                고객센터
              </Text>
              <Pressable
                onPress={() => {
                  Linking.openURL(`tel:010-2784-2756`);
                }}
                style={tailwind(
                  ' py-[18px] border-b border-[#E9E9E9] flex flex-row items-center justify-between',
                )}>
                <Text style={tailwind('text-[17px] leading-[20px] font-[400]')}>
                  고객센터 바로 연결
                </Text>
                <ArrowRight24 />
              </Pressable>
              <Pressable
                onPress={() => {
                  changeUserStateHandler(UserState.BUYER);
                }}
                style={tailwind(
                  ' py-[18px] border-b border-[#E9E9E9] flex flex-row items-center justify-between',
                )}>
                <Text style={tailwind('text-[17px] leading-[20px] font-[400]')}>
                  구매자 페이지로 전환하기
                </Text>
                <ArrowRight24 />
              </Pressable>
              {user.role === UserRole.ADMIN && (
                <Pressable
                  onPress={() => {
                    navigation.navigate(RouterList.Admin);
                  }}
                  style={tailwind(
                    ' py-[18px] border-b border-[#E9E9E9] flex flex-row items-center justify-between',
                  )}>
                  <Text
                    style={tailwind('text-[17px] leading-[20px] font-[400]')}>
                    유저 / 파트너 관리
                  </Text>
                  <ArrowRight24 />
                </Pressable>
              )}
            </View>
          </View>
        )}
      </ScrollView>
      <Tabbar type={TabbarType.MYINFO} />
    </SafeAreaView>
  );
}
