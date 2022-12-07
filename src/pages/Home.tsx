import {
  View,
  Text,
  Pressable,
  Platform,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useTailwind} from 'tailwind-rn/dist';
import {RootStackParamList, RouterList} from '../../Router';
import FastImage from 'react-native-fast-image';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import goodsAPI from '../api/goodsAPI';
import {useAppDispatch} from '../store';
import loadingSlice from '../slices/loadingSlice';
import {IGoods} from '../types/goodsType';
import goodsSlice from '../slices/goodsSlice';
import {converterPrice} from '../utils/convertPrice';
import {formatRemainingExpiryDateKR} from '../utils/dateFormat';
import getDistanceFromLatLonInKm from '../utils/distanceLatLonInKm';
import Tabbar, {TabbarType} from '../components/Tabbar';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {SafeAreaView} from 'react-native-safe-area-context';
import categoryAPI from '../api/categoryAPI';
import categorySlice from '../slices/categorySlice';
import {useAnimatedRef} from 'react-native-reanimated';
import {wait} from '../utils/timeout';
import infiniteScrollSlice from '../slices/infiniteScrollSlice';
import {validateExpiryDate} from '../utils/validateExpiryDate';
import ArrowBottomIcon from '../assets/svg/arrow-bottom.svg';

export default function Home() {
  const tailwind = useTailwind();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const address = useSelector((state: RootState) => state.address.me);
  const dispatch = useAppDispatch();
  const goodsList = useSelector((state: RootState) => state.goods.goodsList);
  const categories = useSelector(
    (state: RootState) => state.category.categories,
  );
  const [filteredGoodsList, setFilteredGoodsList] = useState<IGoods[]>([]);
  const [filteredCategory, setFilteredCategory] = useState('');
  const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;

  const homeScrollRef = useAnimatedRef<FlatList<IGoods>>();
  const [isRefresh, setIsRefresh] = useState(false);
  const infiniteScroll = useSelector(
    (state: RootState) => state.infiniteScroll,
  );
  const [isFetching, setIsFetching] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isNotScroll, setIsNotScroll] = useState(false);

  useEffect(() => {
    if (address.name === '') {
      // return Alert.alert('주소를 등록해주세요.');
    } else {
      const findAllUserLocationListGoodsAPIHandler = async () => {
        dispatch(loadingSlice.actions.setLoading(true));
        const goodsListData: IGoods[] = await goodsAPI.findAllUserLocationList({
          latitude: address.latitude,
          longitude: address.longitude,
          range: address.range - 0.8,
          skip: 0,
          take: infiniteScroll.take,
          category: '',
        });
        if (goodsListData.length > 0) {
          const accurateRangeFilteredGoodsList = goodsListData
            .filter(
              v =>
                +getDistanceFromLatLonInKm(
                  address.latitude,
                  address.longitude,
                  v.store.latitude,
                  v.store.longitude,
                ) *
                  10 <=
                address.range * 10,
            )
            .sort(() => Math.random() - 0.5);
          dispatch(
            goodsSlice.actions.setGoodsList(accurateRangeFilteredGoodsList),
          );
          setFilteredGoodsList(accurateRangeFilteredGoodsList);
          dispatch(infiniteScrollSlice.actions.setSkip(10));
        }
        dispatch(loadingSlice.actions.setLoading(false));
      };
      if (!visible) {
        findAllUserLocationListGoodsAPIHandler();
        setVisible(true);
      }
    }
  }, [address, dispatch, infiniteScroll, visible]);

  useEffect(() => {
    const findAllCategoryAPIHandler = async () => {
      dispatch(loadingSlice.actions.setLoading(true));
      const category = await categoryAPI.findAll();
      dispatch(categorySlice.actions.setCategories(category.data));
      dispatch(loadingSlice.actions.setLoading(false));
    };
    findAllCategoryAPIHandler();
  }, [dispatch]);

  const changeCategoryHandler = useCallback(
    async (name: string) => {
      dispatch(loadingSlice.actions.setLoading(true));
      const goodsListData: IGoods[] = await goodsAPI.findAllUserLocationList({
        latitude: address.latitude,
        longitude: address.longitude,
        range: address.range - 0.8,
        skip: 0,
        take: infiniteScroll.take,
        category: name,
      });
      dispatch(loadingSlice.actions.setLoading(false));
      if (goodsListData.length > 0) {
        const accurateRangeFilteredGoodsList = goodsListData
          .filter(
            v =>
              +getDistanceFromLatLonInKm(
                address.latitude,
                address.longitude,
                v.store.latitude,
                v.store.longitude,
              ) *
                10 <=
              address.range * 10,
          )
          .sort(() => Math.random() - 0.5);
        dispatch(
          goodsSlice.actions.setGoodsList(accurateRangeFilteredGoodsList),
        );
        setFilteredGoodsList(accurateRangeFilteredGoodsList);
        dispatch(infiniteScrollSlice.actions.setSkip(10));
      } else {
        setFilteredGoodsList([]);
      }
      setIsNotScroll(false);
      if (name === '') {
        setFilteredCategory('');
      } else {
        setFilteredCategory(name);
      }
    },
    [setFilteredGoodsList, address, dispatch, infiniteScroll],
  );

  const onRefresh = useCallback(async () => {
    setIsRefresh(true);
    const goodsListData: IGoods[] = await goodsAPI.findAllUserLocationList({
      latitude: address.latitude,
      longitude: address.longitude,
      range: address.range - 0.8,
      skip: 0,
      take: infiniteScroll.take,
      category: filteredCategory,
    });
    if (goodsListData.length > 0) {
      const accurateRangeFilteredGoodsList = goodsListData
        .filter(
          v =>
            +getDistanceFromLatLonInKm(
              address.latitude,
              address.longitude,
              v.store.latitude,
              v.store.longitude,
            ) *
              10 <=
            address.range * 10,
        )
        .sort(() => Math.random() - 0.5);
      dispatch(goodsSlice.actions.setGoodsList(accurateRangeFilteredGoodsList));
      setFilteredGoodsList(accurateRangeFilteredGoodsList);
      dispatch(infiniteScrollSlice.actions.setSkip(10));
    }
    await wait(500);
    setIsNotScroll(false);
    setIsRefresh(false);
  }, [address, dispatch, infiniteScroll, filteredCategory]);

  const infiniteScrollHandler = useCallback(async () => {
    setIsFetching(true);
    const goodsListData: IGoods[] = await goodsAPI.findAllUserLocationList({
      latitude: address.latitude,
      longitude: address.longitude,
      range: address.range - 0.8,
      skip: infiniteScroll.skip,
      take: infiniteScroll.take,
      category: filteredCategory,
    });
    if (goodsListData.length > 0) {
      const accurateRangeFilteredGoodsList = goodsListData
        .filter(
          v =>
            +getDistanceFromLatLonInKm(
              address.latitude,
              address.longitude,
              v.store.latitude,
              v.store.longitude,
            ) *
              10 <=
            address.range * 10,
        )
        .sort(() => Math.random() - 0.5);
      dispatch(
        goodsSlice.actions.setGoodsList([
          ...goodsList,
          ...accurateRangeFilteredGoodsList,
        ]),
      );
      setFilteredGoodsList(prev => [
        ...prev,
        ...accurateRangeFilteredGoodsList,
      ]);
      dispatch(infiniteScrollSlice.actions.setSkip(infiniteScroll.skip + 10));
    }
    if (goodsListData.length < 10) {
      setIsNotScroll(true);
    }
    setIsFetching(false);
  }, [address, dispatch, infiniteScroll, goodsList, filteredCategory]);

  return (
    <SafeAreaView style={tailwind('bg-background')}>
      <Pressable
        onPress={() => {
          navigation.reset({routes: [{name: RouterList.LocationSet}]});
        }}
        style={tailwind(
          'flex flex-row items-center justify-start border-b border-line  h-[60px]',
        )}>
        <Text style={tailwind('text-[22px] font-[600] ml-4 mr-2')}>
          {`${
            address.name === ''
              ? '주소 등록이 필요합니다'
              : address.type === 'MYHOME'
              ? '우리집'
              : address.name
          }`}
        </Text>
        <ArrowBottomIcon width={21} height={21} />
      </Pressable>
      <View style={tailwind('flex flex-row h-[70px] items-center px-4')}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Pressable
            onPress={() => {
              changeCategoryHandler('');
            }}
            style={tailwind(
              `${
                filteredCategory === '' ? 'bg-primary_og' : 'bg-[#F4F4F4]'
              } px-5  h-[36px] rounded-[24px] mr-[13px] flex flex-col items-center justify-center`,
            )}>
            <Text
              style={tailwind(
                `${
                  filteredCategory === '' ? 'text-white' : 'text-[#1C1C1E]'
                } text-[14px] font-[700]`,
              )}>
              전체보기
            </Text>
          </Pressable>
          {categories.length > 0 &&
            categories.map(v => (
              <Pressable
                onPress={() => {
                  changeCategoryHandler(v.name);
                }}
                key={v.id}
                style={tailwind(
                  `${
                    v.name === filteredCategory
                      ? 'bg-primary_og'
                      : 'bg-[#F4F4F4]'
                  }  px-5 h-[36px] rounded-[24px] mr-[13px] flex flex-col items-center justify-center`,
                )}>
                <Text
                  style={tailwind(
                    `${
                      v.name === filteredCategory
                        ? 'text-white'
                        : 'text-[#1C1C1E]'
                    }  text-[14px] font-[700]`,
                  )}>
                  {v.name}
                </Text>
              </Pressable>
            ))}
        </ScrollView>
      </View>
      <View
        style={[
          tailwind(``),
          {
            height: Dimensions.get('window').height - 220 - StatusBarHeight!,
          },
        ]}>
        {/* flex flex-row w-full flex-wrap justify-between */}
        {filteredGoodsList.length > 0 ? (
          <FlatList
            style={tailwind('px-4')}
            ref={homeScrollRef}
            numColumns={2}
            data={filteredGoodsList}
            keyExtractor={item => item.id.toString()}
            onEndReachedThreshold={0.8}
            refreshControl={
              <RefreshControl
                onRefresh={onRefresh}
                refreshing={isRefresh}
                tintColor="#FF521C"
              />
            }
            onEndReached={() => {
              // if (!isNextItem) {
              //   setIsNextItem(true);
              // } else {
              if (!isFetching && !isNotScroll) {
                infiniteScrollHandler();
              }
              // }
            }}
            ListFooterComponent={
              isFetching ? (
                <ActivityIndicator color={'#FF521C'} size={40} />
              ) : null
            }
            renderItem={({item, index}: {item: IGoods; index: number}) => {
              return (
                <Pressable
                  onPress={() => {
                    if (
                      validateExpiryDate(item.expiryDate) ||
                      item.quantity === 0
                    ) {
                    } else {
                      navigation.navigate(RouterList.Detail, {
                        goodsId: item.id,
                      });
                    }
                  }}
                  key={item.id}
                  style={tailwind(
                    `h-[280px] w-[50%]  mb-[12px]  ${
                      (index + 1) % 2 === 1 ? 'pr-[6px]' : 'pl-[6px]'
                    }`,
                  )}>
                  <View style={tailwind('w-full h-[150px] relative')}>
                    {(validateExpiryDate(item.expiryDate) ||
                      item.quantity === 0) && (
                      <View
                        style={tailwind('absolute inset-0 z-30 h-full w-full')}>
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
                              'text-white text-[19px] font-[600]',
                            )}>
                            품절
                          </Text>
                        </View>
                      </View>
                    )}

                    <FastImage
                      style={tailwind('h-full w-full')}
                      resizeMode={'cover'}
                      source={{uri: item.GoodsImage[0].location}}
                    />
                  </View>
                  <Text
                    numberOfLines={1}
                    style={tailwind('mt-[15px] text-[14px] font-[400]')}>
                    {item.store.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={tailwind(
                      'mt-1 text-[18px] text-[#39393B] font-[700]',
                    )}>
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      tailwind('mt-2'),
                      {
                        textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid',
                        fontSize: 15,
                        color: '#A7A7A8',
                      },
                    ]}>
                    {`${converterPrice(item.originPrice.toString())}원`}
                  </Text>
                  <View style={tailwind('flex flex-row items-center')}>
                    <Text
                      style={tailwind('text-[18px] font-[700] text-[#1C1C1E]')}>
                      {`${converterPrice(item.salePrice.toString())}원`}
                    </Text>
                    <Text
                      style={tailwind(
                        'text-[#FF2E00] text-[18px] font-[700] ml-1',
                      )}>
                      {`${item.discount + item.additionalDiscount}%`}
                    </Text>
                  </View>
                  <View style={tailwind('flex flex-row items-center mt-1')}>
                    <Text
                      style={tailwind('text-[16px] font-[700] text-[#0066FF]')}>
                      {`${formatRemainingExpiryDateKR(item.expiryDate)}`}
                    </Text>
                    {/* <Text
                      style={tailwind(
                        'text-[13px] font-[500] text-[#A7A7A8] ',
                      )}>
                      {`${getDistanceFromLatLonInKm(
                        address.latitude,
                        address.longitude,
                        item.store.latitude,
                        item.store.longitude,
                      )}km`}
                    </Text> */}
                  </View>
                </Pressable>
              );
            }}
          />
        ) : (
          <View
            style={tailwind(
              'absolute top-[40%] left-0 w-full  flex flex-col items-center justify-center',
            )}>
            <Text style={tailwind('text-[17px] text-[#A7A7A8] font-[400]')}>
              현재 판매중인 상품이 없습니다.
            </Text>
            <Text style={tailwind('text-[17px] text-[#A7A7A8] font-[400]')}>
              잠시만 기다려 주세요!
            </Text>
          </View>
        )}
      </View>

      <Tabbar type={TabbarType.BUYERHOME} homeScrollRef={homeScrollRef} />
      {/* <CheckBox
          onValueChange={checked => {
            console.log(checked);
          }}
          style={tailwind('mr-2 w-6 h-6')}
          onAnimationType="fade"
          offAnimationType="bounce"
          boxType="square"
          disabled={false}
          tintColor="black"
          value={true}
          onCheckColor="black"
          onTintColor="black"
        /> */}
    </SafeAreaView>
  );
}
