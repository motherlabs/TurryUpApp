import {View, Pressable, Platform, StatusBar, Dimensions} from 'react-native';
import {DefaultFontText as Text} from '../components/DefaultFontText';
import React, {useEffect} from 'react';
import {useTailwind} from 'tailwind-rn/dist';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList, RouterList} from '../../Router';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {useAppDispatch} from '../store';
import paymentAPI from '../api/paymentAPI';
import loadingSlice from '../slices/loadingSlice';
import paymentSlice from '../slices/paymentSlice';
import {converterPrice} from '../utils/convertPrice';
import {formatKR} from '../utils/dateFormat';
import ArrowRight12 from '../assets/svg/arrow-right-12.svg';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {getBusinessHours, getBusinessHoursTime} from '../utils/businessHours';
import {validateExpiryDate} from '../utils/validateExpiryDate';
import BackIcon from '../assets/svg/back.svg';

export default function BuyHistory() {
  const tailwind = useTailwind();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const paymentList = useSelector(
    (state: RootState) => state.payment.paymentList,
  );
  const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;

  useEffect(() => {
    const findAllPaymentAPIHandler = async () => {
      try {
        dispatch(loadingSlice.actions.setLoading(true));
        const paymentListData = await paymentAPI.findAll();
        if (paymentListData.data.length > 0) {
          dispatch(paymentSlice.actions.setPaymentList(paymentListData.data));
        }
      } catch (e) {
        console.log(e);
      } finally {
        dispatch(loadingSlice.actions.setLoading(false));
      }
    };
    findAllPaymentAPIHandler();
  }, [dispatch]);

  return (
    <SafeAreaView style={tailwind('bg-background')}>
      <View
        style={tailwind('px-4 border-b  h-[56px] border-[#F4F4F4] relative ')}>
        <View
          style={tailwind(
            'flex flex-col h-[56px]  items-center justify-center',
          )}>
          <Text style={tailwind(' text-[21px] leading-[24px] font-[600]')}>
            구매내역
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
      <View
        style={[
          tailwind(``),
          {
            height: Dimensions.get('window').height - 90 - StatusBarHeight!,
          },
        ]}>
        <ScrollView style={tailwind('bg-background')}>
          {paymentList.length > 0 &&
            paymentList.map(v =>
              v.Order.map(item => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    navigation.navigate(RouterList.StoreInfo, {
                      userId: item.goods.store.userId,
                    });
                  }}
                  style={tailwind('border-b border-[#F4F4F4] px-4 py-5')}>
                  <View style={tailwind('flex flex-row items-center mb-4')}>
                    {item.status === '주문 취소' ? (
                      <View
                        style={tailwind(
                          'bg-[#FFEBED] rounded-[4px] px-2 py-1 mr-1',
                        )}>
                        <Text
                          style={tailwind(
                            'text-[#EC344A] text-[13px] leading-[16px] font-[600]',
                          )}>
                          재고소진으로 인한 주문취소
                        </Text>
                      </View>
                    ) : item.status === '픽업 완료' ? (
                      <View
                        style={tailwind(
                          'bg-[#F4F4F4] rounded-[4px] px-2 py-1 mr-1',
                        )}>
                        <Text
                          style={tailwind(
                            'text-[#7B7B7C] text-[13px] leading-[16px] font-[600]',
                          )}>
                          {item.status}
                        </Text>
                      </View>
                    ) : validateExpiryDate(item.goods.expiryDate) ? (
                      <View
                        style={tailwind(
                          'bg-[#FFEBED] rounded-[4px] px-2 py-1 mr-1',
                        )}>
                        <Text
                          style={tailwind(
                            'text-[#EC344A] text-[13px] leading-[16px] font-[600]',
                          )}>
                          소비기한 초과 픽업불가
                        </Text>
                      </View>
                    ) : getBusinessHours(
                        item.goods.store.dayOff,
                        item.goods.store.businessHours,
                      ) === '영업중' ? (
                      <View
                        style={tailwind(
                          'bg-light rounded-[4px] px-2 py-1 mr-1',
                        )}>
                        <Text
                          style={tailwind(
                            'text-dark text-[13px] leading-[16px] font-[600]',
                          )}>
                          {item.status}
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
                        'text-[17px] leading-[20px] font-[700] mr-2',
                      )}>
                      {item.goods.store.name}
                    </Text>
                    <ArrowRight12 />
                  </View>
                  <View style={tailwind('flex flex-row items-center')}>
                    <FastImage
                      style={tailwind('w-[95px] h-[95px]  mr-[16px]')}
                      source={{
                        uri:
                          item.goods.GoodsImage.length > 0
                            ? item.goods.GoodsImage[0].location
                            : '',
                      }}
                    />
                    <View>
                      <Text
                        style={tailwind(
                          'text-[17px] leading-[20px] font-[700] text-[#39393B] mb-1',
                        )}>
                        {item.goods.name}
                      </Text>
                      <Text
                        style={tailwind(
                          'text-[#A7A7A8] text-[14px] leading-[17px] font-[500] mb-1',
                        )}>{`픽업 가능시간 ${
                        getBusinessHoursTime(item.goods.store.businessHours) ===
                        '00:00-00:00'
                          ? '휴무'
                          : getBusinessHoursTime(item.goods.store.businessHours)
                      }`}</Text>
                      <Text
                        style={tailwind(
                          'text-[#A7A7A8] text-[14px] leading-[17px] font-[500] mb-1',
                        )}>{`결제일시 ${formatKR(new Date(v.createdAt)).slice(
                        2,
                        10,
                      )}`}</Text>
                      <Text
                        style={tailwind(
                          'text-[14px] leading-[17px] font-[500] text-[#7B7B7C] mb-1',
                        )}>
                        {`수량 : ${item.quantity}`}
                      </Text>
                      <Text
                        style={tailwind(
                          'text-[17px] leading-[20px] font-[700] text-[#1C1C1E]',
                        )}>
                        {`${converterPrice(
                          (item.goods.salePrice * item.quantity).toString(),
                        )}원`}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )),
            )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
