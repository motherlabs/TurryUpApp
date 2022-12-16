import {
  View,
  Text,
  Pressable,
  Alert,
  Dimensions,
  Modal,
  Share,
  Platform,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTailwind} from 'tailwind-rn/dist';
import {RootStackParamList, RouterList} from '../../Router';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';

import {
  NavigationProp,
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useAppDispatch} from '../store';
import loadingSlice from '../slices/loadingSlice';
import goodsAPI from '../api/goodsAPI';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import goodsSlice from '../slices/goodsSlice';
import {GoodsImage, IGoods} from '../types/goodsType';
import {converterPrice} from '../utils/convertPrice';
import {formatRemainingExpiryDateKR} from '../utils/dateFormat';
import basketSlice from '../slices/basketSlice';
import BtnPlusIcon from '../assets/svg/btn-plus.svg';
import BtnMinusIcon from '../assets/svg/btn-minus.svg';
import Target14 from '../assets/svg/target-14.svg';
import ArrowRightGreenIcon from '../assets/svg/arrow-right-green.svg';
import basketAPI from '../api/basketAPI';
import {useAnimatedRef} from 'react-native-reanimated';
import ImageViewer from 'react-native-image-zoom-viewer';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {validateExpiryDate} from '../utils/validateExpiryDate';
import BackIcon from '../assets/svg/back.svg';
import BasketIcon from '../assets/svg/basket.svg';
import ShareIcon from '../assets/svg/share.svg';

interface Props {
  setStatusbarColor: React.Dispatch<
    React.SetStateAction<'light-content' | 'dark-content'>
  >;
}

export default function Detail({setStatusbarColor}: Props) {
  const tailwind = useTailwind();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<RootStackParamList, 'Detail'>>();
  const goods = useSelector((state: RootState) => state.goods.goods);
  const [quantity, setQuantity] = useState(1);

  const aref = useAnimatedRef<ScrollView>();
  const basketCount = useSelector((state: RootState) => state.basket.count);
  const [images, setImages] = useState<{url: string}[]>([]);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const carouselRef = useRef<Carousel<GoodsImage>>(null);
  const [isHeaderColor, setIsHeaderColor] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setStatusbarColor('light-content');
    }
    return () => {
      setStatusbarColor('dark-content');
    };
  }, [setStatusbarColor, isFocused]);

  const onShare = useCallback(async () => {
    try {
      const result = await Share.share({
        message: '덕템 공유',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          Alert.alert('성공적으로 공유되었습니다.');
        } else {
          // shared
          console.log('check2');
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (e) {
      console.log('share error', e);
    }
  }, []);

  useEffect(() => {
    const findOneGoodsAPIHandler = async () => {
      dispatch(loadingSlice.actions.setLoading(true));
      const goodsData: IGoods = await goodsAPI.findOne(route.params.goodsId);
      dispatch(goodsSlice.actions.setGoods(goodsData));
      dispatch(loadingSlice.actions.setLoading(false));
      if (goodsData.quantity === 0) {
        setQuantity(0);
      }
      goodsData.GoodsImage.map(v => {
        setImages(prev => [...prev, {url: v.location}]);
      });
    };
    findOneGoodsAPIHandler();
  }, [dispatch, route, setQuantity]);

  const createBasketAPIHandler = useCallback(async () => {
    dispatch(loadingSlice.actions.setLoading(true));
    await basketAPI.create({goodsId: goods.id, quantity});
    dispatch(loadingSlice.actions.setLoading(false));
    dispatch(basketSlice.actions.incrementCount());

    Alert.alert('장바구니에 담았습니다.');
    navigation.goBack();
  }, [dispatch, goods, quantity, navigation]);

  const changeGoodsHandler = useCallback(
    async (goodsId: number) => {
      dispatch(loadingSlice.actions.setLoading(true));
      const goodsData: IGoods = await goodsAPI.findOne(goodsId);
      dispatch(goodsSlice.actions.setGoods(goodsData));
      dispatch(loadingSlice.actions.setLoading(false));
      if (goodsData.quantity === 0) {
        setQuantity(0);
      }
      aref.current!.scrollTo({x: 0, y: 0});
    },
    [dispatch, aref],
  );

  const incrementHandler = useCallback(() => {
    if (goods.quantity === quantity) {
      Alert.alert('상품의 최대 수량보다 많습니다.');
    } else {
      setQuantity(prev => prev + 1);
    }
  }, [goods, quantity]);

  const decrementHandler = useCallback(() => {
    if (quantity === 1 || quantity === 0) {
      return;
    } else {
      setQuantity(prev => prev - 1);
    }
  }, [quantity]);

  return (
    <>
      <View
        style={tailwind(
          `absolute top-0 left-0 z-40 ${
            Platform.OS === 'android' ? 'h-[50px]' : 'h-[90px]'
          } ${
            isHeaderColor ? 'bg-[#00000066]' : 'bg-transparent'
          }  w-full  flex flex-col items-start justify-end`,
        )}>
        <View
          style={tailwind('flex flex-row justify-between items-end w-full')}>
          <Pressable
            style={tailwind(
              ' h-[50px]  px-[13px] flex flex-row items-center justify-start',
            )}
            onPress={() => {
              navigation.goBack();
            }}>
            <BackIcon
              width={24}
              height={24}
              style={tailwind('')}
              fill={'white'}
            />
          </Pressable>
          {/* <View
            style={tailwind(
              'h-[60px] flex flex-col items-center justify-center',
            )}>
            <Text style={tailwind('text-[18px] font-[600] text-[#1C1C1E]')}>
              {goods.store.name}
            </Text>
            <Text
              style={tailwind(
                'text-[#A7A7A8] text-[10px] font-[500] mt-1',
              )}>{`${getDistanceFromLatLonInKm(
              address.latitude,
              address.longitude,
              goods.store.latitude,
              goods.store.longitude,
            )}km`}</Text>
          </View> */}
          <View style={tailwind('flex flex-row items-center')}>
            <Pressable
              onPress={() => {
                onShare();
              }}
              style={tailwind(
                ' h-[50px] mr-2 flex flex-row items-center justify-start relative',
              )}>
              <ShareIcon fill={'white'} />
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate(RouterList.Basket);
              }}
              style={tailwind(
                ' h-[40px] pl-[13px] pr-[20px] flex flex-row items-center justify-start relative',
              )}>
              <BasketIcon fill={'white'} />
              {basketCount > 0 && (
                <View
                  style={tailwind(
                    `absolute top-[3px] ${
                      basketCount > 9
                        ? 'right-[4px] w-[40px]'
                        : 'right-[9px] w-[20px]'
                    } bg-[#FF594F] h-[20px] flex flex-col items-center justify-center rounded-full`,
                  )}>
                  <Text
                    style={tailwind(
                      'text-white text-[12px] leading-[15px] font-[700]',
                    )}>{`${basketCount > 99 ? '99+' : basketCount}`}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </View>
      <View
        style={[
          tailwind(``),
          {
            height: Dimensions.get('window').height - 110,
          },
        ]}>
        <ScrollView
          onScroll={e => {
            if (
              e.nativeEvent.contentOffset.y >=
              410 - (Platform.OS === 'android' ? 50 : 90)
            ) {
              setIsHeaderColor(true);
            } else {
              setIsHeaderColor(false);
            }
          }}
          ref={aref}
          style={tailwind('h-full bg-background')}>
          <View style={tailwind('flex w-full h-[410px] mb-[18px] relative')}>
            {images.length > 0 && (
              <Carousel
                ref={carouselRef}
                data={goods.GoodsImage}
                renderItem={({item}: {item: GoodsImage}) => (
                  <Pressable
                    style={tailwind('relative')}
                    onPress={() => {
                      setVisible(true);
                    }}>
                    <FastImage
                      style={tailwind('h-full')}
                      source={{uri: item.location}}
                    />
                  </Pressable>
                )}
                initialScrollIndex={currentImageIdx}
                itemWidth={Dimensions.get('window').width}
                sliderWidth={Dimensions.get('window').width}
                onSnapToItem={index => {
                  setCurrentImageIdx(index);
                }}
                inactiveSlideOpacity={1}
                inactiveSlideScale={1}
              />
            )}
            {visible && (
              <Modal visible={visible} animationType="slide" transparent={true}>
                <ImageViewer
                  renderIndicator={(
                    currentIndex: number | undefined,
                    allSize: number | undefined,
                  ) => (
                    <View
                      style={tailwind(
                        'absolute bottom-[10%] w-full flex flex-row justify-center z-10 ',
                      )}>
                      {allSize! > 1 &&
                        Array.from({length: allSize!}).map((_, index) => (
                          <View
                            key={index}
                            style={tailwind(
                              `w-[7px] h-[7px] rounded-full ${
                                currentIndex === index + 1
                                  ? 'bg-white'
                                  : 'bg-gray-500 opacity-50'
                              } ${index + 1 === 0 ? '' : 'ml-4'}`,
                            )}
                          />
                        ))}
                    </View>
                  )}
                  renderHeader={() => (
                    <View
                      style={tailwind(
                        'absolute top-[8%] w-full flex flex-row justify-end z-10 ',
                      )}>
                      <Pressable
                        onPress={() => {
                          setVisible(false);
                        }}
                        style={tailwind(
                          'w-[60px] h-[40px] flex flex-col items-center justify-center',
                        )}>
                        <Text
                          style={tailwind(
                            'text-[40px] leading-[43px] text-white',
                          )}>
                          x
                        </Text>
                      </Pressable>
                    </View>
                  )}
                  enablePreload={true}
                  swipeDownThreshold={0.5}
                  imageUrls={images}
                  onSwipeDown={() => {
                    setVisible(false);
                    if (carouselRef.current) {
                      carouselRef.current.snapToItem(currentImageIdx);
                    }
                  }}
                  enableSwipeDown={true}
                  index={currentImageIdx}
                  onChange={index => {
                    setCurrentImageIdx(index!);
                  }}
                />
              </Modal>
            )}
            <Pressable
              onPress={() => {
                setVisible(true);
              }}
              style={tailwind(
                'w-full h-[70px] absolute left-0 right-0 bottom-0',
              )}>
              <Pagination
                dotsLength={goods.GoodsImage.length}
                activeDotIndex={currentImageIdx}
                animatedDuration={1}
                dotStyle={{
                  width: 7,
                  height: 7,
                  borderRadius: 5,
                  marginHorizontal: 0,
                  marginTop: 20,
                  backgroundColor: 'white',
                }}
                inactiveDotStyle={{
                  backgroundColor: 'gray',
                  // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={1}
              />
            </Pressable>
          </View>
          <View style={tailwind(' px-4')}>
            <View style={tailwind('flex flex-row justify-between w-full mb-5')}>
              <View>
                <Text
                  style={tailwind(
                    'text-[21px] leading-[24px] text-[#39393B] font-[700] mb-1',
                  )}>
                  {goods.name}
                </Text>
                <Text
                  style={tailwind(
                    'text-[15px] leading-[18px] text-[#0066FF] font-[700]',
                  )}>
                  {`${formatRemainingExpiryDateKR(goods.expiryDate)}`}
                </Text>

                <Text
                  style={{
                    textDecorationLine: 'line-through',
                    textDecorationStyle: 'solid',
                    fontSize: 19,
                    color: '#A7A7A8',
                    marginTop: 12,
                    marginBottom: 4,
                    lineHeight: 22,
                  }}>
                  {`${converterPrice(goods.originPrice.toString())}원`}
                </Text>
                <View style={tailwind('flex flex-row items-center')}>
                  <Text
                    style={tailwind(
                      'text-[27px] leading-[30px] font-[700] mr-2',
                    )}>
                    {`${converterPrice(goods.salePrice.toString())}원`}
                  </Text>
                  <Text
                    style={tailwind(
                      'text-[#FF2E00] text-[27px] leading-[30px] font-[700]',
                    )}>
                    {`${goods.discount + goods.additionalDiscount}%`}
                  </Text>
                </View>
              </View>
              <View style={tailwind('flex flex-col justify-between')}>
                <Pressable
                  onPress={() => {
                    navigation.navigate(RouterList.StoreInfo, {
                      userId: goods.store.userId,
                    });
                  }}
                  style={tailwind(
                    'flex flex-row items-center justify-center px-4 py-2 border border-[#E9E9E9] rounded-[30px]',
                  )}>
                  <Target14 />
                  <Text
                    style={tailwind(
                      'text-[#1C1C1E] text-[13px] leading-[16px] font-[600] ml-1 leading-[14px]',
                    )}>
                    매장 위치
                  </Text>
                </Pressable>
                <View
                  style={tailwind(
                    'flex flex-row items-center justify-between',
                  )}>
                  <Pressable onPress={decrementHandler}>
                    <BtnMinusIcon />
                  </Pressable>

                  <Text
                    style={tailwind(
                      `text-[21px] leading-[24px] ${
                        quantity === 0 ? 'text-[#DEE2E8]' : ''
                      }`,
                    )}>{`${quantity}`}</Text>
                  <Pressable onPress={incrementHandler}>
                    <BtnPlusIcon />
                  </Pressable>
                </View>
              </View>
            </View>
            <View
              style={tailwind(
                'flex flex-row items-start justify-start  py-[16px] mb-[24px] border-t border-b border-[#E9E9E9]',
              )}>
              <Text
                style={tailwind(
                  'text-[15px] leading-[18px] mr-[12px] font-[600] text-[#7B7B7C] leading-[18px]',
                )}>
                안내사항
              </Text>
              <View>
                <Text
                  style={tailwind(
                    'text-[15px] leading-[18px] font-[400] text-[#7B7B7C]',
                  )}>
                  사진 상 이미지와 실제 이미지는 상품의 포장
                </Text>
                <Text
                  style={tailwind(
                    'text-[15px] leading-[18px] font-[400] text-[#7B7B7C]',
                  )}>
                  여부에 따라 다소 차이가 날 수 있습니다.
                </Text>
              </View>
            </View>
            {goods.store.Goods.length > 1 && (
              <View>
                <View
                  style={tailwind(
                    'flex flex-row justify-between items-center mb-2',
                  )}>
                  <Text
                    style={tailwind(
                      'text-[19px] leading-[22px] font-[600] text-[#1C1C1E]',
                    )}>
                    이 매장 상품 더보기
                  </Text>
                  <Pressable
                    style={tailwind('flex flex-row items-center')}
                    onPress={() => {
                      navigation.navigate(RouterList.Store, {
                        userId: goods.store.userId,
                      });
                    }}>
                    <Text
                      style={tailwind(
                        'text-[15px] leading-[18px] font-[400] text-[#1C1C1E] mr-1',
                      )}>
                      전체보기
                    </Text>
                    <ArrowRightGreenIcon />
                  </Pressable>
                </View>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {goods.store.Goods.length > 0 &&
                    goods.store.Goods.filter(v => v.id !== goods.id).map(v => (
                      <Pressable
                        onPress={() => {
                          if (
                            validateExpiryDate(v.expiryDate) ||
                            v.quantity === 0
                          ) {
                          } else {
                            changeGoodsHandler(v.id);
                          }
                        }}
                        key={v.id}
                        style={tailwind('h-[280px]  w-[130px]  mr-[11px] ')}>
                        <View style={tailwind('w-full h-[150px]')}>
                          {(validateExpiryDate(v.expiryDate) ||
                            v.quantity === 0) && (
                            <View
                              style={tailwind(
                                'absolute inset-0 z-30 h-full w-full',
                              )}>
                              <View
                                style={tailwind(
                                  'absolute inset-0 w-full h-full bg-black z-30 opacity-40',
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
                          style={tailwind(
                            'mt-1 text-[15px] leading-[18px] text-[#39393B] font-[700]',
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
                              fontSize: 14,
                              lineHeight: 17,
                              color: '#A7A7A8',
                            },
                          ]}>
                          {`${converterPrice(v.originPrice.toString())}원`}
                        </Text>
                        <View style={tailwind('flex flex-row items-center')}>
                          <Text
                            style={tailwind(
                              'text-[17px] leading-[20px] font-[700] text-[#1C1C1E]',
                            )}>
                            {`${converterPrice(v.salePrice.toString())}원`}
                          </Text>
                          <Text
                            style={tailwind(
                              'text-[#FF2E00] text-[17px] leading-[20px] font-[700] ml-1',
                            )}>
                            {`${v.discount + v.additionalDiscount}%`}
                          </Text>
                        </View>
                        <View
                          style={tailwind('flex flex-row items-center mt-1')}>
                          <Text
                            style={tailwind(
                              'text-[14px] leading-[17px] font-[700] text-[#0066FF]',
                            )}>
                            {`${formatRemainingExpiryDateKR(v.expiryDate)}`}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                </ScrollView>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
      <View
        style={tailwind(
          'flex-1 h-[90px] bg-background px-2 pt-4 w-full border-t border-gray-200 flex flex-col items-center justify-start',
        )}>
        <Pressable
          disabled={goods.quantity === 0 ? true : false}
          onPress={() => {
            createBasketAPIHandler();
          }}
          style={tailwind(
            `flex flex-row items-center justify-center h-[55px] w-full ${
              goods.quantity === 0 ? 'bg-[#E9E9E9]' : 'bg-primary'
            } `,
          )}>
          <Text
            style={tailwind(
              `text-[19px] leading-[22px] font-[600]  ${
                goods.quantity === 0 ? 'text-[#D3D3D3]' : 'text-black'
              }`,
            )}>
            {`${goods.quantity === 0 ? '품절' : '구매하기'}`}
          </Text>
        </Pressable>
      </View>
      {/* <SafeAreaView /> */}
    </>
  );
}
