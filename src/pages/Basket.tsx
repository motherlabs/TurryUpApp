import {
  View,
  Text,
  Pressable,
  Dimensions,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTailwind} from 'tailwind-rn/dist';
import {ScrollView} from 'react-native-gesture-handler';
import {RootStackParamList, RouterList} from '../../Router';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {converterPrice} from '../utils/convertPrice';
import {formatRemainingExpiryDateKR} from '../utils/dateFormat';
import {useAppDispatch} from '../store';
import loadingSlice from '../slices/loadingSlice';
import basketSlice from '../slices/basketSlice';
import Tabbar, {TabbarType} from '../components/Tabbar';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import basketAPI from '../api/basketAPI';
import {IBasket} from '../types/basketType';
import goodsAPI from '../api/goodsAPI';
import {validateExpiryDate} from '../utils/validateExpiryDate';
import CheckBox from '@react-native-community/checkbox';
import BtnPlusIcon from '../assets/svg/btn-plus.svg';
import BtnMinusIcon from '../assets/svg/btn-minus.svg';

export default function Basket() {
  const tailwind = useTailwind();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const basketList = useSelector((state: RootState) => state.basket.basketList);
  const selectedList = useSelector(
    (state: RootState) => state.basket.selectedList,
  );

  const [totalAmount, setTotalAmount] = useState(0);
  const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;

  useEffect(() => {
    const findAllBasketAPIHandler = async () => {
      dispatch(loadingSlice.actions.setLoading(true));
      const response = await basketAPI.findAll();
      dispatch(loadingSlice.actions.setLoading(false));
      if (response.data.length > 0) {
        const baskets: IBasket[] = response.data;
        baskets.map(v => {
          setTotalAmount(prev => prev + v.goods.salePrice * v.quantity);
        });
        dispatch(basketSlice.actions.setSelectedList(response.data));
        dispatch(basketSlice.actions.setList(response.data));
      }
    };
    findAllBasketAPIHandler();
  }, [dispatch]);

  useEffect(() => {
    setTotalAmount(0);
    if (selectedList.length > 0) {
      basketList.map(v => {
        setTotalAmount(prev => {
          if (selectedList.some(item => item.id === v.id)) {
            return prev + v.goods.salePrice * v.quantity;
          }
          return prev;
        });
      });
    }
  }, [selectedList, basketList]);

  const checkBasletListQuentity = useCallback(async () => {
    try {
      dispatch(loadingSlice.actions.setLoading(true));
      const response = await basketAPI.findAll();
      const basketListData: IBasket[] = response.data;
      const filterBasketListData: IBasket[] = basketListData.filter(v =>
        selectedList.some(item => item.id === v.id),
      );
      let basketIdList: number[] = [];
      let message = '';

      filterBasketListData.map(v => {
        if (
          v.quantity > v.goods.quantity ||
          validateExpiryDate(v.goods.expiryDate)
        ) {
          message += `${v.goods.name} `;
          basketIdList.push(v.id);
        } else {
          return;
        }
      });
      if (basketIdList.length > 0) {
        await basketAPI.deleteAll({basketIdList});
        const response2 = await basketAPI.findAll();
        dispatch(basketSlice.actions.setList(response2.data));
        Alert.alert(
          `죄송합니다. 다른분의 구매로 ${message} 제품이 품절되었습니다.`,
        );
      } else {
        for await (const item of selectedList) {
          await goodsAPI.updateQuantity({
            quantity: item.goods.quantity - item.quantity,
            goodsId: item.goods.id,
          });
        }
        navigation.reset({
          routes: [{name: RouterList.Payment, params: {amount: totalAmount}}],
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(loadingSlice.actions.setLoading(false));
    }
  }, [dispatch, navigation, totalAmount, selectedList]);

  const resetBasket = useCallback(async () => {
    dispatch(loadingSlice.actions.setLoading(true));
    const response = await basketAPI.findAll();
    dispatch(loadingSlice.actions.setLoading(false));
    if (response.data.length > 0) {
      const baskets: IBasket[] = response.data;
      baskets.map(v => {
        setTotalAmount(prev => prev + v.goods.salePrice * v.quantity);
      });
      dispatch(basketSlice.actions.setSelectedList(response.data));
      dispatch(basketSlice.actions.setList(response.data));
    } else {
      dispatch(basketSlice.actions.setList([]));
      dispatch(basketSlice.actions.setSelectedList([]));
    }
  }, [dispatch]);

  const incrementHandler = useCallback(
    async (basketId: number) => {
      if (
        basketList.filter(v => v.id === basketId)[0].goods.quantity ===
        basketList.filter(v => v.id === basketId)[0].quantity
      ) {
        Alert.alert('상품의 최대 수량보다 많습니다.');
      } else {
        const quantity =
          basketList.filter(v => v.id === basketId)[0].quantity + 1;
        dispatch(loadingSlice.actions.setLoading(true));
        await basketAPI.updateQuantity({basketId, quantity});
        dispatch(loadingSlice.actions.setLoading(false));
        resetBasket();
      }
    },
    [basketList, resetBasket, dispatch],
  );

  const decrementHandler = useCallback(
    async (basketId: number) => {
      if (
        basketList.filter(v => v.id === basketId)[0].quantity === 1 ||
        basketList.filter(v => v.id === basketId)[0].quantity === 0
      ) {
        return;
      } else {
        const quantity =
          basketList.filter(v => v.id === basketId)[0].quantity - 1;
        dispatch(loadingSlice.actions.setLoading(true));
        await basketAPI.updateQuantity({basketId, quantity});
        dispatch(loadingSlice.actions.setLoading(false));
        resetBasket();
      }
    },
    [basketList, resetBasket, dispatch],
  );

  const deleteBasketAPIHandler = useCallback(
    async (basketId: number) => {
      dispatch(loadingSlice.actions.setLoading(true));
      await basketAPI.deleteAll({basketIdList: [basketId]});
      dispatch(loadingSlice.actions.setLoading(false));
      resetBasket();
    },
    [resetBasket, dispatch],
  );

  const deleteAllBasketAPIHandler = useCallback(async () => {
    if (selectedList.length > 0) {
      dispatch(loadingSlice.actions.setLoading(true));
      const basketIdList: number[] = [];
      selectedList.map(v => {
        basketIdList.push(v.id);
      });
      await basketAPI.deleteAll({basketIdList});
      dispatch(loadingSlice.actions.setLoading(false));
      resetBasket();
    }
  }, [resetBasket, dispatch, selectedList]);

  return (
    <SafeAreaView style={tailwind('bg-background')}>
      <View
        style={tailwind(
          'rounded-t-[10px] h-[60px] w-full  flex flex-col items-center justify-center border-b border-gray-200',
        )}>
        <Text style={tailwind(' text-[18px] text-black font-[600]')}>
          장바구니
        </Text>
      </View>
      <View
        style={{
          height: Dimensions.get('window').height - 210 - StatusBarHeight!,
        }}>
        {basketList.length > 0 ? (
          <View>
            <View
              style={tailwind(
                'bg-white h-[60px] w-full flex flex-row items-center justify-between border-b-4 border-gray-200',
              )}>
              <View style={tailwind('ml-[21px] flex flex-row items-center')}>
                <Pressable
                  style={tailwind('flex flex-row items-center')}
                  onPress={() => {
                    dispatch(basketSlice.actions.setSelectedList([]));
                    dispatch(basketSlice.actions.setSelectedList(basketList));
                  }}>
                  <CheckBox
                    onValueChange={_ => {}}
                    style={tailwind(' w-[20px] h-[20px]')}
                    onAnimationType="fade"
                    offAnimationType="fade"
                    lineWidth={1}
                    boxType="square"
                    disabled={true}
                    tintColor="#DEE2E8"
                    value={
                      selectedList.length === basketList.length ? true : false
                    }
                    onCheckColor="#FF4D14"
                    onTintColor="#FF4D14"
                  />
                  <Text
                    style={tailwind(
                      'text-[#848688] text-[12px] ml-2',
                    )}>{`전체선택 (${selectedList.length}/${basketList.length})`}</Text>
                </Pressable>
              </View>
              <View style={tailwind('mr-[21px]')}>
                <Pressable
                  onPress={() => {
                    deleteAllBasketAPIHandler();
                  }}
                  style={tailwind(
                    'w-[50px] h-[30px] rounded-lg flex flex-col items-center justify-center bg-[#F4F4F4]',
                  )}>
                  <Text style={tailwind('text-[12px] font-[600]')}>삭제</Text>
                </Pressable>
              </View>
            </View>
            <ScrollView
              style={[
                tailwind(''),
                {
                  height:
                    Dimensions.get('window').height - 250 - StatusBarHeight!,
                },
              ]}>
              <View style={tailwind('h-full')}>
                {basketList.map(v => (
                  <View
                    key={v.id}
                    style={tailwind(
                      ' p-[21px] flex flex-col justify-start border-b-4 border-gray-200',
                    )}>
                    <Text style={tailwind(' text-[12px] font-[400]')}>
                      {v.goods.store.name}
                    </Text>
                    <View
                      style={tailwind('mt-[10px] flex flex-row items-center')}>
                      <CheckBox
                        onValueChange={checked => {
                          if (checked) {
                            dispatch(
                              basketSlice.actions.setSelectedList([
                                ...selectedList,
                                v,
                              ]),
                            );
                          } else {
                            const filtered = selectedList.filter(
                              item => item.id !== v.id,
                            );
                            dispatch(
                              basketSlice.actions.setSelectedList(filtered),
                            );
                          }
                        }}
                        style={tailwind(' w-[20px] h-[20px]')}
                        onAnimationType="fade"
                        offAnimationType="fade"
                        lineWidth={1}
                        boxType="square"
                        disabled={false}
                        tintColor="#DEE2E8"
                        value={selectedList.some(item => item.id === v.id)}
                        onCheckColor="#FF4D14"
                        onTintColor="#FF4D14"
                      />
                      <Text style={tailwind('ml-2 text-[14px] font-[700]')}>
                        {v.goods.name}
                      </Text>
                    </View>
                    <View style={tailwind('mt-2 flex flex-row items-center')}>
                      <View style={tailwind('w-[100px] h-[100px] mr-[32px]')}>
                        <FastImage
                          style={tailwind('w-full h-full ')}
                          resizeMode={'cover'}
                          source={{
                            uri:
                              v.goods.GoodsImage.length > 0
                                ? v.goods.GoodsImage[0].location
                                : '',
                          }}
                        />
                      </View>
                      <View>
                        <Text
                          style={{
                            textDecorationLine: 'line-through',
                            textDecorationStyle: 'solid',
                            fontSize: 12,
                            color: '#ACB4BE',
                          }}>{`${converterPrice(
                          v.goods.originPrice.toString(),
                        )}원`}</Text>
                        <View
                          style={tailwind('flex flex-row items-center mt-1')}>
                          <Text
                            style={tailwind(
                              'text-[14px] font-[600] text-[#1C1C1E]',
                            )}>{`${converterPrice(
                            v.goods.salePrice.toString(),
                          )}원`}</Text>
                          <Text
                            style={tailwind(
                              'text-[#0066FF] text-[12px] font-[600] ml-2',
                            )}>{`${
                            v.goods.discount + v.goods.additionalDiscount
                          }%`}</Text>
                        </View>
                        <Text
                          style={tailwind(
                            'text-[14px] font-[700] text-[#0066FF] mt-1',
                          )}>
                          {formatRemainingExpiryDateKR(v.goods.expiryDate)}
                        </Text>
                        <View
                          style={tailwind('flex flex-row items-center mt-2')}>
                          <Pressable
                            onPress={() => {
                              deleteBasketAPIHandler(v.id);
                            }}
                            style={tailwind(
                              'w-[50px] h-[30px] rounded-lg flex flex-col items-center justify-center bg-[#F4F4F4]',
                            )}>
                            <Text style={tailwind('text-[12px] font-[600]')}>
                              삭제
                            </Text>
                          </Pressable>
                          <View
                            style={tailwind(
                              'ml-[20px] flex flex-row items-center',
                            )}>
                            <Pressable
                              onPress={() => {
                                decrementHandler(v.id);
                              }}>
                              <BtnMinusIcon />
                            </Pressable>
                            <Text
                              style={tailwind('mx-4 text-[18px] font-[600]')}>
                              {v.quantity}
                            </Text>
                            <Pressable
                              onPress={() => {
                                incrementHandler(v.id);
                              }}>
                              <BtnPlusIcon />
                            </Pressable>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        ) : (
          <View
            style={tailwind(
              'flex flex-col items-center justify-center w-full h-full justify-center bg-white',
            )}>
            <FastImage
              style={tailwind('w-[180px] h-[180px] ')}
              resizeMode={'contain'}
              source={require('../assets/image/empty-food.png')}
            />
            <View style={tailwind('mt-2')}>
              <Text style={tailwind('text-[19px] font-[500] text-[#909090]')}>
                장바구니가 비어있어요!
              </Text>
            </View>
          </View>
        )}
      </View>

      {basketList.length > 0 ? (
        <View
          style={tailwind(
            'flex flex-row items-center justify-center h-[60px] w-full border-t border-gray-200',
          )}>
          <View
            style={tailwind(
              'w-[44%] flex flex-col items-center justify-center h-[60px] bg-white',
            )}>
            <Text
              style={tailwind(
                'text-[16px] font-[600]',
              )}>{`합계 ${converterPrice(totalAmount.toString())}원`}</Text>
          </View>
          <Pressable
            style={tailwind(
              `w-[56%] flex flex-col items-center justify-center h-[60px] ${
                totalAmount ? 'bg-primary' : 'bg-[#DEE2E8]'
              }`,
            )}
            onPress={() => {
              if (totalAmount) {
                checkBasletListQuentity();
              }
            }}>
            <Text
              style={tailwind(
                `text-[16px] font-[600] ${
                  totalAmount ? 'text-black' : 'text-white'
                }`,
              )}>
              구매하기
            </Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={() => {
            navigation.navigate(RouterList.Home);
          }}
          style={tailwind(
            'flex flex-row items-center justify-center h-[60px] w-full bg-primary',
          )}>
          <Text style={tailwind('text-[16px] font-[600] text-black')}>
            실시간 상품 살펴보기
          </Text>
        </Pressable>
      )}

      <Tabbar type={TabbarType.BUYERBASKET} />
    </SafeAreaView>
  );
}
