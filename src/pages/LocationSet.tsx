import {
  View,
  Pressable,
  Dimensions,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import {DefaultFontText as Text} from '../components/DefaultFontText';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTailwind} from 'tailwind-rn/dist';
import {PressableOpacity} from 'react-native-pressable-opacity';
import NaverMapView, {Circle, Marker} from 'react-native-nmap';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import Postcode from '@actbase/react-daum-postcode';
import {convertRange} from '../utils/convertRange';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList, RouterList} from '../../Router';
import Geolocation from '@react-native-community/geolocation';
import addressSlice from '../slices/addressSlice';
import addressAPI from '../api/addressAPI';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {useAppDispatch} from '../store';
import loadingSlice from '../slices/loadingSlice';
import CurrentLocationIcon from '../assets/svg/current-location.svg';
import SearchIcon from '../assets/svg/search.svg';
import MyHomeIcon from '../assets/svg/myhome.svg';
import LocationIcon from '../assets/svg/location.svg';
import CheckIcon from '../assets/svg/check.svg';
import BottomSheet from 'reanimated-bottom-sheet';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {IAddress} from '../types/addressType';
import Carousel from 'react-native-snap-carousel';
import BackIcon from '../assets/svg/back.svg';
import ArrowBottomIcon from '../assets/svg/arrow-bottom.svg';
import infoAPI from '../api/infoAPI';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  ScrollView,
} from 'react-native-gesture-handler';

/**
 * 위도경도 계산
 * 위도 1Km = 1 / 109.958489129649955 // 0.00909434103647
 * 경도 1Km = 1 / 88.74 // 0.011268875366238
 * 현위치
 * 위도 37.56286560532598
 * 경도 126.9741303494414
 * 1km 범위 안
 * 위도
 * < 37.57195994636245
 * > 37.55377126428951
 * 경도
 * < 126.985399224807638
 * > 126.962861474075162
 * 대각
 * 126.96016693731815
 * 37.556427886700064
 *
 * 범위 1030이 1km
 */

export default function LocationSet() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const tailwind = useTailwind();
  const dispatch = useAppDispatch();
  const [isSearch, setIsSearch] = useState(false);
  const address = useSelector((state: RootState) => state.address.me);
  const addressList = useSelector((state: RootState) => state.address.list);
  const [isCurrentLocationRequest, setIsCurrentLocationRequest] =
    useState(false);
  const [isBottomSheet, setIsBottomSheet] = useState(false);
  const bottomSheetRef = useRef(null);
  const carousel = [0, 1];
  const carouselRef = useRef<Carousel<number>>(null);
  const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;
  const [isMyHome, setIsMyHome] = useState(false);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    const APIHandler = async () => {
      const response = await addressAPI.findPinned();
      if (response.data.status !== 404) {
        dispatch(addressSlice.actions.setAddress(response.data));
        setIsCurrentLocationRequest(true);
      }
    };
    APIHandler();
  }, [dispatch]);

  useEffect(() => {
    const findAllAddressAPIHandler = async () => {
      const response = await addressAPI.findAll();
      const addressListData: IAddress[] = response.data;
      if (addressListData.length > 0) {
        dispatch(addressSlice.actions.setList(addressListData));
        setIsCurrentLocationRequest(true);
      }
    };
    findAllAddressAPIHandler();
  }, [dispatch]);

  useEffect(() => {
    const changeReversLocationHandler02 = async (location: string) => {
      try {
        const response = await axios.get(
          `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${location}&output=json`,
          {
            headers: {
              'X-NCP-APIGW-API-KEY-ID': ',
              'X-NCP-APIGW-API-KEY': '',
            },
          },
        );
        dispatch(
          addressSlice.actions.setName({
            name: `${response.data.results[0].region.area1.alias} ${response.data.results[0].region.area2.name} ${response.data.results[0].region.area3.name}`,
          }),
        );
      } catch (e) {
        Alert.alert('위치를 찾을 수 없습니다.');
        dispatch(
          addressSlice.actions.setName({
            name: '',
          }),
        );
        console.log('error', e);
      }
    };
    if (address.name === '' && !isCurrentLocationRequest) {
      Geolocation.getCurrentPosition(info => {
        const longitude = info.coords.longitude;
        const latitude = info.coords.latitude;
        dispatch(
          addressSlice.actions.setLocation({
            latitude,
            longitude,
          }),
        );

        changeReversLocationHandler02(`${longitude},${latitude}`);
        setIsCurrentLocationRequest(true);
      });
    }
  }, [address, dispatch, isCurrentLocationRequest]);

  const changeReversLocationHandler = useCallback(
    async (location: string) => {
      try {
        const response = await axios.get(
          `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${location}&output=json`,
          {
            headers: {
              'X-NCP-APIGW-API-KEY-ID': '',
              'X-NCP-APIGW-API-KEY': '',
            },
          },
        );
        dispatch(
          addressSlice.actions.setName({
            name: `${response.data.results[0].region.area1.alias} ${response.data.results[0].region.area2.name} ${response.data.results[0].region.area3.name}`,
          }),
        );
        if (addressList.filter(v => v.type === 'MYHOME').length > 0) {
          if (
            addressList.filter(v => v.type === 'MYHOME')[0].name ===
            `${response.data.results[0].region.area1.alias} ${response.data.results[0].region.area2.name} ${response.data.results[0].region.area3.name}`
          ) {
            dispatch(addressSlice.actions.setType('MYHOME'));
          }
        }
      } catch (e) {
        Alert.alert('위치를 찾을 수 없습니다.');
        dispatch(
          addressSlice.actions.setName({
            name: '',
          }),
        );

        console.log('error', e);
      }
    },
    [dispatch, addressList],
  );

  const changeLocationHandler = useCallback(
    async (data: string) => {
      try {
        const response = await axios.get(
          `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${data}`,
          {
            headers: {
              'X-NCP-APIGW-API-KEY-ID': '',
              'X-NCP-APIGW-API-KEY': '',
            },
          },
        );
        dispatch(
          addressSlice.actions.setLocation({
            latitude: +response.data.addresses[0].y,
            longitude: +response.data.addresses[0].x,
          }),
        );
      } catch (e) {
        Alert.alert('위치를 찾을 수 없습니다.');
        dispatch(
          addressSlice.actions.setName({
            name: '',
          }),
        );
        console.log('error', e);
      }
    },
    [dispatch],
  );

  const createAddressAPIHanlder = useCallback(async () => {
    dispatch(loadingSlice.actions.setLoading(true));
    try {
      const response = await addressAPI.create({
        name: address.name,
        latitude: address.latitude,
        longitude: address.longitude,
        range: address.range,
        isPinned: 1,
        type: address.type,
      });
      dispatch(addressSlice.actions.setAddress(response.data));
      const verifyInfo = await infoAPI.verify();
      dispatch(loadingSlice.actions.setLoading(false));
      if (verifyInfo.data) {
        navigation.reset({routes: [{name: RouterList.Home}]});
      } else {
        navigation.navigate(RouterList.InformationInput);
      }
    } catch (e) {
      console.log(e);
    }
  }, [dispatch, navigation, address]);

  const resetAddress = useCallback(async () => {
    dispatch(loadingSlice.actions.setLoading(true));
    const addressData = await addressAPI.findPinned();
    if (addressData.data.status !== 404) {
      dispatch(addressSlice.actions.setAddress(addressData.data));
    } else {
      dispatch(
        addressSlice.actions.setAddress({
          id: 0,
          name: '',
          latitude: 0,
          longitude: 0,
          range: 3,
          isPinned: 0,
          type: 'NORMAL',
        }),
      );
    }
    const response = await addressAPI.findAll();
    const addressListData: IAddress[] = response.data;
    if (addressListData.length > 0) {
      dispatch(addressSlice.actions.setList(addressListData));
    } else {
      dispatch(addressSlice.actions.setList([]));
    }
    dispatch(loadingSlice.actions.setLoading(false));
  }, [dispatch]);

  const deleteAddressAPIHandler = useCallback(
    async (addressId: number) => {
      dispatch(loadingSlice.actions.setLoading(true));
      await addressAPI.deleteAddress({addressId});
      dispatch(loadingSlice.actions.setLoading(false));
      resetAddress();
    },
    [dispatch, resetAddress],
  );

  return (
    <>
      <SafeAreaView style={tailwind('bg-background')}>
        <View style={tailwind('relative')}>
          <View style={tailwind('px-5')}>
            <Pressable
              onPress={async () => {
                //@ts-ignore
                bottomSheetRef.current?.snapTo(0);
              }}
              style={tailwind(
                ' w-full h-[40px] mb-3 flex flex-col items-center justify-center  mt-5',
              )}>
              {address.name ? (
                <View style={tailwind('flex flex-row items-center')}>
                  <Text
                    style={tailwind(
                      'text-[22px] leading-[25px] font-[600] text-black mr-2',
                    )}>
                    {address.type === 'MYHOME' ? '우리집' : address.name}
                  </Text>
                  <ArrowBottomIcon width={10} height={10} />
                </View>
              ) : (
                <View style={tailwind('flex flex-row items-center')}>
                  <Text
                    style={tailwind(
                      'text-[22px] leading-[25px] font-[600] text-black mr-2',
                    )}>
                    주소설정
                  </Text>

                  <ArrowBottomIcon width={10} height={10} />
                </View>
              )}
            </Pressable>
          </View>

          <View style={{height: Dimensions.get('window').height - 400}}>
            {/*@ts-ignore */}
            <NaverMapView
              style={{width: '100%', height: '100%'}}
              // showsMyLocationButton={true}
              zoomControl={false}
              // center={{
              //   ...myLocation,
              //   zoom: 13,
              // }}
              center={
                address.latitude !== 0
                  ? {
                      latitude: address.latitude,
                      longitude: address.longitude,
                      zoom: 13,
                    }
                  : {
                      longitude: 126.90524760654188,
                      latitude: 37.52272557493458,
                      zoom: 13,
                    }
              }
              // onTouch={() => {
              //   console.log('check');
              // }}
              // onCameraChange={e =>
              //   console.log('onCameraChange', JSON.stringify(e))
              // }
              onMapClick={e => console.log('onMapClick', JSON.stringify(e))}>
              <Marker
                width={30}
                height={30}
                coordinate={{
                  latitude: address.latitude,
                  longitude: address.longitude,
                }}
                image={require('../assets/image/mylocation.png')}
                caption={{text: '내 위치'}}
                onClick={() => console.log('onClick! p0')}
              />
              {/* <Path
              coordinates={[P0, P1]}
              onClick={() => console.log('onClick! path')}
              width={3}
            /> */}
              {/* <Polyline
              coordinates={[P1, P2]}
              onClick={() => console.log('onClick! polyline')}
              strokeColor={'white'}
            /> */}
              <Circle
                coordinate={{
                  latitude: address.latitude,
                  longitude: address.longitude,
                }}
                color={'rgba(1,0,0,0.1)'}
                radius={30 + 1000 * address.range}
                onClick={() => console.log('onClick! circle')}
              />
              {/* <Polygon
              coordinates={[P0, P1, P2]}
              color={`rgba(0, 0, 0, 0.5)`}
              onClick={() => console.log('onClick! polygon')}
            /> */}
            </NaverMapView>
          </View>

          <View style={tailwind('h-[300px] rounded-t-[16px] bg-background ')}>
            <View
              style={tailwind(
                'flex flex-col items-center px-[23px] mt-[30px]',
              )}>
              <Text
                style={tailwind(
                  'text-[17px] leading-[20px] text-[#1C1C1E] font-[600]',
                )}>{`선택한 범위 내의 할인상품을 볼 수 있어요!`}</Text>
              <View style={tailwind('flex flex-row items-center mt-4')}>
                <Slider
                  style={tailwind('flex-1 h-[40px]')}
                  minimumValue={1}
                  onValueChange={value => {
                    dispatch(
                      addressSlice.actions.setRange({
                        range: +convertRange(value),
                      }),
                    );
                  }}
                  maximumValue={3}
                  value={address.range}
                  renderToHardwareTextureAndroid={true}
                  minimumTrackTintColor="#FF521C"
                  maximumTrackTintColor="#E5E5E5"
                  thumbTintColor="white"
                />
                <View style={tailwind('ml-2 w-[50px]')}>
                  <Text
                    style={tailwind(
                      'text-[14px] leading-[17px] font-[500] text-[#909090]',
                    )}>
                    {`${convertRange(address.range)}`}
                    km
                  </Text>
                </View>
              </View>

              <PressableOpacity
                onPress={() => {
                  Geolocation.getCurrentPosition(info => {
                    const longitude = info.coords.longitude;
                    const latitude = info.coords.latitude;
                    dispatch(
                      addressSlice.actions.setLocation({
                        latitude: 0,
                        longitude: 0,
                      }),
                    );
                    dispatch(
                      addressSlice.actions.setLocation({
                        latitude,
                        longitude,
                      }),
                    );
                    dispatch(addressSlice.actions.setType('NORMAL'));
                    changeReversLocationHandler(`${longitude},${latitude}`);
                  });
                }}
                style={tailwind(
                  'flex h-[52px] border border-[#FF521C] w-full mt-[16px] flex-row justify-center items-center',
                )}>
                <CurrentLocationIcon />
                <Text
                  style={tailwind(
                    'text-[13px] leading-[16px] font-[600] ml-1 text-primary_og',
                  )}>
                  현재위치로 찾기
                </Text>
              </PressableOpacity>
              <Pressable
                onPress={() => {
                  createAddressAPIHanlder();
                }}
                disabled={address.name ? false : true}
                style={tailwind(
                  `mt-[16px] h-[52px] w-full rounded-[4px] ${
                    address.name ? 'bg-primary' : 'bg-gray-200'
                  }  flex flex-col items-center justify-center`,
                )}>
                <Text
                  style={tailwind(
                    'text-[17px] leading-[20px] font-[600] text-black',
                  )}>
                  시작하기
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
      {isBottomSheet && (
        <View
          style={tailwind(
            'absolute inset-0 z-50 w-full h-full bg-black opacity-60',
          )}
        />
      )}
      <BottomSheet
        ref={bottomSheetRef}
        renderContent={() => (
          <View style={tailwind(' h-full rounded-t-2xl')}>
            <Carousel
              keyboardShouldPersistTaps={'handled'}
              ref={carouselRef}
              data={carousel}
              renderItem={({item}: {item: number}) => (
                <View style={tailwind('w-full h-full relative')}>
                  {item === 0 ? (
                    <View>
                      <GestureHandlerRootView>
                        <PanGestureHandler
                          onGestureEvent={() => {
                            //@ts-ignore
                            bottomSheetRef.current?.snapTo(2);
                          }}>
                          <View
                            style={tailwind(
                              'bg-white h-[24px] pt-[12px] flex flex-col items-center justify-start',
                            )}>
                            <View
                              style={tailwind(
                                'bg-gray-200 w-[40px] h-[4px] rounded-lg',
                              )}
                            />
                          </View>
                        </PanGestureHandler>
                      </GestureHandlerRootView>
                      <View
                        style={tailwind(
                          'w-full h-[48px] flex flex-col items-center justify-center bg-white relative',
                        )}>
                        <Text
                          style={tailwind(
                            'text-[20px] leading-[23px] font-[700]',
                          )}>
                          주소설정
                        </Text>
                        {isModified ? (
                          <Pressable
                            onPress={() => {
                              setIsModified(false);
                            }}
                            style={tailwind(
                              'absolute top-0 right-4 h-[48px] flex flex-col justify-center items-center w-[60px]',
                            )}>
                            <Text
                              style={tailwind(' text-[17px] leading-[20px]')}>
                              편집취소
                            </Text>
                          </Pressable>
                        ) : (
                          <Pressable
                            onPress={() => {
                              resetAddress();
                              setIsModified(true);
                            }}
                            style={tailwind(
                              'absolute top-0 right-0 h-[48px] flex flex-col justify-center items-center w-[60px]',
                            )}>
                            <Text
                              style={tailwind(' text-[17px] leading-[20px]')}>
                              편집
                            </Text>
                          </Pressable>
                        )}
                      </View>
                      <View style={tailwind('bg-white px-4 pb-4')}>
                        <Pressable
                          onPress={() => {
                            carouselRef.current?.snapToItem(1);
                            setIsSearch(true);
                          }}
                          style={tailwind(
                            'flex flex-row h-[40px] w-full bg-gray-100 rounded-lg items-center justify-start px-4',
                          )}>
                          <SearchIcon stroke={'#A7A7A8'} />
                          <Text
                            style={tailwind('ml-1 text-[#A7A7A8] font-[600]')}>
                            지번, 도로명, 건물명으로 검색
                          </Text>
                        </Pressable>
                      </View>
                      <View
                        style={tailwind(
                          'bg-gray-100 h-[11px] border-t border-gray-200 w-full',
                        )}
                      />
                      <View
                        style={[
                          tailwind('bg-white'),
                          {
                            height:
                              Dimensions.get('window').height -
                              140 -
                              StatusBarHeight!,
                          },
                        ]}>
                        <ScrollView style={tailwind('z-10')}>
                          <PressableOpacity
                            onPress={() => {
                              if (addressList.some(v => v.type === 'MYHOME')) {
                                changeLocationHandler(
                                  addressList.filter(
                                    v => v.type === 'MYHOME',
                                  )[0].name,
                                );
                                dispatch(
                                  addressSlice.actions.setName({
                                    name: addressList.filter(
                                      v => v.type === 'MYHOME',
                                    )[0].name,
                                  }),
                                );
                                dispatch(
                                  addressSlice.actions.setType('MYHOME'),
                                );
                                //@ts-ignore
                                bottomSheetRef.current?.snapTo(2);
                              } else {
                                carouselRef.current?.snapToItem(1);
                                setIsSearch(true);
                                setIsMyHome(true);
                              }
                            }}
                            style={tailwind(
                              'bg-white h-[70px] flex flex-row relative',
                            )}>
                            <View
                              style={tailwind(
                                'flex-1 flex flex-col items-center justify-center h-[70px]',
                              )}>
                              <MyHomeIcon
                                width={24}
                                height={24}
                                fill={'black'}
                              />
                            </View>
                            <View
                              style={tailwind(
                                'w-[80%] h-[70px] flex flex-col items-start justify-center border-b border-gray-200 relative',
                              )}>
                              {address.type === 'MYHOME' ? (
                                <View
                                  style={tailwind(
                                    'flex flex-row justify-between pr-4 w-full',
                                  )}>
                                  <View>
                                    <Text
                                      style={tailwind(
                                        'text-[16px] leading-[19px] font-[700]',
                                      )}>
                                      우리집
                                    </Text>
                                    <Text
                                      style={tailwind(
                                        'text-[15px] leading-[18px] text-gray-400 mt-1 font-[600]',
                                      )}>
                                      {address.name}
                                    </Text>
                                  </View>
                                  {address.type === 'MYHOME' && !isModified && (
                                    <CheckIcon
                                      width={24}
                                      height={24}
                                      fill={'black'}
                                      style={tailwind('mb-2')}
                                    />
                                  )}
                                </View>
                              ) : addressList.some(v => v.type === 'MYHOME') ? (
                                <View
                                  style={tailwind(
                                    'flex flex-row justify-between pr-4 w-full',
                                  )}>
                                  <View>
                                    <Text
                                      style={tailwind(
                                        'text-[16px] leading-[19px] font-[700]',
                                      )}>
                                      우리집
                                    </Text>
                                    <Text
                                      style={tailwind(
                                        'text-[15px] leading-[18px] text-gray-400 mt-1 font-[600]',
                                      )}>
                                      {
                                        addressList.filter(
                                          v => v.type === 'MYHOME',
                                        )[0].name
                                      }
                                    </Text>
                                  </View>

                                  {addressList.filter(
                                    v =>
                                      v.type === 'MYHOME' &&
                                      v.name === address.name,
                                  ).length > 0 &&
                                    !isModified && (
                                      <CheckIcon
                                        width={24}
                                        height={24}
                                        fill={'black'}
                                        style={tailwind('mb-2')}
                                      />
                                    )}
                                </View>
                              ) : (
                                <Text
                                  style={tailwind(
                                    'text-[16px] leading-[19px] font-[700]',
                                  )}>
                                  우리집 등록
                                </Text>
                              )}
                              {isModified &&
                                addressList.filter(v => v.type === 'MYHOME')
                                  .length > 0 && (
                                  <View
                                    style={tailwind(
                                      'absolute h-[70px] right-4 top-0 flex flex-col items-start justify-center  w-[50px]',
                                    )}>
                                    <Pressable
                                      onPress={() => {
                                        deleteAddressAPIHandler(
                                          addressList.filter(
                                            v => v.type === 'MYHOME',
                                          )[0].id,
                                        );
                                      }}
                                      style={tailwind(
                                        'bg-gray-100 rounded-xl px-3 py-1.5',
                                      )}>
                                      <Text>삭제</Text>
                                    </Pressable>
                                  </View>
                                )}
                            </View>
                          </PressableOpacity>
                          {address.type !== 'MYHOME' &&
                            addressList.filter(
                              v =>
                                v.type === 'MYHOME' && v.name === address.name,
                            ).length === 0 &&
                            address.name !== '' && (
                              <PressableOpacity
                                style={tailwind(
                                  'bg-white h-[70px] flex flex-row relative',
                                )}>
                                <View
                                  style={tailwind(
                                    'flex-1 flex flex-col items-center justify-center h-[70px]',
                                  )}>
                                  <LocationIcon
                                    width={24}
                                    height={24}
                                    fill={'black'}
                                  />
                                </View>
                                <View
                                  style={tailwind(
                                    'w-[80%] h-[70px] flex flex-col items-start justify-center border-b border-gray-200',
                                  )}>
                                  <Text
                                    style={tailwind(
                                      'text-[16px] leading-[19px] font-[700]',
                                    )}>
                                    {address.name}
                                  </Text>
                                </View>
                                {!isModified ? (
                                  <View
                                    style={tailwind(
                                      'absolute h-[70px] right-0 top-0 flex flex-col items-start justify-center  w-[40px]',
                                    )}>
                                    <CheckIcon
                                      width={24}
                                      height={24}
                                      fill={'black'}
                                      style={tailwind('mb-2')}
                                    />
                                  </View>
                                ) : (
                                  <View
                                    style={tailwind(
                                      'absolute h-[70px] right-4 top-0 flex flex-col items-start justify-center  w-[50px]',
                                    )}>
                                    <Pressable
                                      onPress={() => {
                                        if (address.id !== 0) {
                                          deleteAddressAPIHandler(address.id);
                                        } else {
                                          dispatch(
                                            addressSlice.actions.setAddress({
                                              id: 0,
                                              name: '',
                                              latitude: 0,
                                              longitude: 0,
                                              range: 3,
                                              isPinned: 0,
                                              type: 'NORMAL',
                                            }),
                                          );
                                        }
                                      }}
                                      style={tailwind(
                                        'bg-gray-100 rounded-xl px-3 py-1.5',
                                      )}>
                                      <Text>삭제</Text>
                                    </Pressable>
                                  </View>
                                )}
                              </PressableOpacity>
                            )}
                          {addressList.length > 0 &&
                            addressList
                              .filter(
                                v =>
                                  v.type !== 'MYHOME' &&
                                  v.name !== address.name,
                              )
                              .map(v => (
                                <PressableOpacity
                                  onPress={() => {
                                    dispatch(
                                      addressSlice.actions.setName({
                                        name: v.name,
                                      }),
                                    );
                                    dispatch(
                                      addressSlice.actions.setType('NORMAL'),
                                    );
                                    changeLocationHandler(v.name);
                                    //@ts-ignore
                                    bottomSheetRef.current?.snapTo(2);
                                  }}
                                  key={v.name}
                                  style={tailwind(
                                    'bg-white h-[70px] flex flex-row relative',
                                  )}>
                                  <View
                                    style={tailwind(
                                      'flex-1 flex flex-col items-center justify-center h-[70px]',
                                    )}>
                                    <LocationIcon
                                      width={24}
                                      height={24}
                                      fill={'black'}
                                    />
                                  </View>
                                  <View
                                    style={tailwind(
                                      'w-[80%] h-[70px] flex flex-col items-start justify-center border-b border-gray-200',
                                    )}>
                                    <Text
                                      style={tailwind(
                                        'text-[16px] leading-[19px] font-[700]',
                                      )}>
                                      {v.name}
                                    </Text>
                                  </View>
                                  {isModified && (
                                    <View
                                      style={tailwind(
                                        'absolute h-[70px] right-4 top-0 flex flex-col items-start justify-center  w-[50px]',
                                      )}>
                                      <Pressable
                                        onPress={() => {
                                          deleteAddressAPIHandler(v.id);
                                        }}
                                        style={tailwind(
                                          'bg-gray-100 rounded-xl px-3 py-1.5',
                                        )}>
                                        <Text>삭제</Text>
                                      </Pressable>
                                    </View>
                                  )}
                                </PressableOpacity>
                              ))}
                        </ScrollView>
                      </View>
                    </View>
                  ) : (
                    <View style={tailwind('w-full min-h-full h-full')}>
                      <View
                        style={tailwind(
                          'bg-white h-[24px] pt-[12px] flex flex-col items-center justify-start',
                        )}></View>
                      <View
                        style={tailwind(
                          'h-[48px] w-full bg-white flex flex-col items-center justify-center relative',
                        )}>
                        <Pressable
                          onPress={() => {
                            setIsSearch(false);
                            setIsMyHome(false);
                            carouselRef.current?.snapToItem(0);
                          }}
                          style={tailwind(
                            ' h-[48px] px-[16px] flex flex-col items-center justify-center absolute top-0 left-0',
                          )}>
                          <BackIcon width={21} height={21} fill={'black'} />
                        </Pressable>
                        <Text
                          style={tailwind(
                            'text-[20px] leading-[23px] font-[700]',
                          )}>
                          주소검색
                        </Text>
                      </View>
                      <Postcode
                        style={tailwind('w-full h-full')}
                        onError={() => {
                          console.log('error');
                        }}
                        jsOptions={{animation: true}}
                        onSelected={data => {
                          changeLocationHandler(data.address);
                          dispatch(
                            addressSlice.actions.setName({
                              name: data.address,
                            }),
                          );
                          if (isMyHome) {
                            dispatch(addressSlice.actions.setType('MYHOME'));
                          } else {
                            dispatch(addressSlice.actions.setType('NORMAL'));
                          }
                          setIsMyHome(false);
                          if (
                            addressList.filter(v => v.type === 'MYHOME')
                              .length > 0
                          ) {
                            if (
                              addressList.filter(v => v.type === 'MYHOME')[0]
                                .name === `${data.address}`
                            ) {
                              dispatch(addressSlice.actions.setType('MYHOME'));
                            }
                          }
                          setIsSearch(false);
                          carouselRef.current?.snapToItem(0);
                          //@ts-ignore
                          bottomSheetRef.current?.snapTo(2);
                        }}
                      />
                    </View>
                  )}
                </View>
              )}
              scrollEnabled={false}
              initialScrollIndex={0}
              itemWidth={Dimensions.get('window').width}
              sliderWidth={Dimensions.get('window').width}
              inactiveSlideOpacity={1}
              inactiveSlideScale={1}
            />
          </View>
        )}
        initialSnap={2}
        snapPoints={[
          Dimensions.get('window').height - StatusBarHeight!,
          Dimensions.get('window').height - StatusBarHeight!,
          0,
        ]}
        enabledGestureInteraction={!isSearch}
        borderRadius={10}
        onCloseEnd={() => {
          setIsBottomSheet(false);
        }}
        onOpenStart={() => {
          setIsBottomSheet(true);
        }}
      />
    </>
  );
}
