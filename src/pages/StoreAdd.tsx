import {
  View,
  Pressable,
  TextInput,
  Alert,
  Platform,
  Dimensions,
  StatusBar,
  Keyboard,
} from 'react-native';
import {DefaultFontText as Text} from '../components/DefaultFontText';
import React, {useCallback, useEffect, useState} from 'react';
import {useTailwind} from 'tailwind-rn/dist';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {RootStackParamList, RouterList} from '../../Router';
import {SafeAreaView} from 'react-native-safe-area-context';
import NaverMapView, {Marker} from 'react-native-nmap';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Postcode from '@actbase/react-daum-postcode';
import axios from 'axios';
import BusinessHours from '../components/BusinessHours';
import storeAPI from '../api/storeAPI';
import {useAppDispatch} from '../store';
import loadingSlice from '../slices/loadingSlice';
import {IStore} from '../types/storeType';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import BackIcon from '../assets/svg/back.svg';

export default function StoreAdd() {
  const tailwind = useTailwind();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'StoreAdd'>>();
  const [myLocation, setMylocation] = useState<{
    latitude: number;
    longitude: number;
  }>({latitude: 0, longitude: 0});
  const [name, setName] = useState('');
  const [storeNumber, setStoreNumber] = useState('');
  const [roadNameAddress, setRoadNameAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [picupZone, setPicupZone] = useState('');
  const [dayOff, setDayOff] = useState<string[]>([
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '0',
  ]);
  const [isPostCode, setIsPostCode] = useState(false);
  const [monStart, setMonStart] = useState('');
  const [monEnd, setMonEnd] = useState('');
  const [tueStart, setTueStart] = useState('');
  const [tueEnd, setTueEnd] = useState('');
  const [wedStart, setWedStart] = useState('');
  const [wedEnd, setWedEnd] = useState('');
  const [thuStart, setThuStart] = useState('');
  const [thuEnd, setThuEnd] = useState('');
  const [friStart, setFriStart] = useState('');
  const [friEnd, setFriEnd] = useState('');
  const [satStart, setSatStart] = useState('');
  const [satEnd, setSatEnd] = useState('');
  const [sunStart, setSunStart] = useState('');
  const [sunEnd, setSunEnd] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  const user = useSelector((state: RootState) => state.user.me);
  const [focus, setFocus] = useState<
    | ''
    | '매장명'
    | '도로명주소'
    | '상세주소'
    | '픽업존'
    | '전화번호'
    | '영업시간'
  >('');
  const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;

  useEffect(() => {
    const findOneStoreAPIHandler = async () => {
      if (user.id > 0) {
        dispatch(loadingSlice.actions.setLoading(true));
        if (route.params.targeId !== 0) {
          const response = await storeAPI.findOne(route.params.targeId);
          if (response.data.status !== 404) {
            const store: IStore = response.data;
            setName(store.name);
            setStoreNumber(store.storeNumber);
            setRoadNameAddress(store.roadNameAddress);
            setDetailAddress(store.detailAddress);
            setPicupZone(store.picupZone);
            setMylocation({
              latitude: store.latitude,
              longitude: store.longitude,
            });
            const dayOffArray = store.dayOff.split(',');
            const businessHoursArray = store.businessHours.split(',');
            setDayOff(dayOffArray);

            const sunArray = businessHoursArray[0].split('-');
            const monArray = businessHoursArray[1].split('-');
            const tueArray = businessHoursArray[2].split('-');
            const wedArray = businessHoursArray[3].split('-');
            const thuArray = businessHoursArray[4].split('-');
            const friArray = businessHoursArray[5].split('-');
            const satArray = businessHoursArray[6].split('-');
            setSunStart(sunArray[0]);
            setSunEnd(sunArray[1]);
            setMonStart(monArray[0]);
            setMonEnd(monArray[1]);
            setTueStart(tueArray[0]);
            setTueEnd(tueArray[1]);
            setWedStart(wedArray[0]);
            setWedEnd(wedArray[1]);
            setThuStart(thuArray[0]);
            setThuEnd(thuArray[1]);
            setFriStart(friArray[0]);
            setFriEnd(friArray[1]);
            setSatStart(satArray[0]);
            setSatEnd(satArray[1]);
            setIsUpdate(true);
          }
        } else {
          const response = await storeAPI.findOne(user.id);
          if (response.data.status !== 404) {
            const store: IStore = response.data;
            setName(store.name);
            setStoreNumber(store.storeNumber);
            setRoadNameAddress(store.roadNameAddress);
            setDetailAddress(store.detailAddress);
            setPicupZone(store.picupZone);
            setMylocation({
              latitude: store.latitude,
              longitude: store.longitude,
            });
            const dayOffArray = store.dayOff.split(',');
            const businessHoursArray = store.businessHours.split(',');
            setDayOff(dayOffArray);

            const sunArray = businessHoursArray[0].split('-');
            const monArray = businessHoursArray[1].split('-');
            const tueArray = businessHoursArray[2].split('-');
            const wedArray = businessHoursArray[3].split('-');
            const thuArray = businessHoursArray[4].split('-');
            const friArray = businessHoursArray[5].split('-');
            const satArray = businessHoursArray[6].split('-');
            setSunStart(sunArray[0]);
            setSunEnd(sunArray[1]);
            setMonStart(monArray[0]);
            setMonEnd(monArray[1]);
            setTueStart(tueArray[0]);
            setTueEnd(tueArray[1]);
            setWedStart(wedArray[0]);
            setWedEnd(wedArray[1]);
            setThuStart(thuArray[0]);
            setThuEnd(thuArray[1]);
            setFriStart(friArray[0]);
            setFriEnd(friArray[1]);
            setSatStart(satArray[0]);
            setSatEnd(satArray[1]);
            setIsUpdate(true);
          }
        }
        dispatch(loadingSlice.actions.setLoading(false));
      }
    };
    findOneStoreAPIHandler();
  }, [dispatch, user, route]);

  const changeLocationHandler = useCallback(async (data: string) => {
    try {
      const response = await axios.get(
        `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${data}`,
        {
          headers: {
            'X-NCP-APIGW-API-KEY-ID': 'p1frax9zqz',
            'X-NCP-APIGW-API-KEY': 'zDXK8OwqHimK6qBbmGwa76RjArsWJpmsSK7HLeeN',
          },
        },
      );
      setMylocation({
        latitude: +response.data.addresses[0].y,
        longitude: +response.data.addresses[0].x,
      });
    } catch (e) {
      Alert.alert('위치를 찾을 수 없습니다.');
      setRoadNameAddress('');
      console.log('error', e);
    }
  }, []);
  const createStoreAPIHandler = useCallback(
    async (businessHours: string, dayOfString: string) => {
      try {
        dispatch(loadingSlice.actions.setLoading(true));
        if (route.params.targeId !== 0) {
          await storeAPI.create({
            userId: route.params.targeId,
            name,
            storeNumber,
            roadNameAddress,
            detailAddress,
            picupZone,
            businessHours,
            dayOff: dayOfString,
            latitude: myLocation.latitude,
            longitude: myLocation.longitude,
          });
        } else {
          await storeAPI.create({
            userId: user.id,
            name,
            storeNumber,
            roadNameAddress,
            detailAddress,
            picupZone,
            businessHours,
            dayOff: dayOfString,
            latitude: myLocation.latitude,
            longitude: myLocation.longitude,
          });
        }

        Alert.alert('매장이 등록되었습니다.');
        if (route.params.targeId !== 0) {
          navigation.reset({routes: [{name: RouterList.Admin}]});
        } else {
          navigation.reset({routes: [{name: RouterList.MyInfo}]});
        }
      } catch (e) {
      } finally {
        dispatch(loadingSlice.actions.setLoading(false));
      }
    },
    [
      route,
      user,
      name,
      storeNumber,
      roadNameAddress,
      detailAddress,
      myLocation,
      picupZone,
      dispatch,
      navigation,
    ],
  );

  const updateStoreAPIHandler = useCallback(
    async (businessHours: string, dayOfString: string) => {
      try {
        dispatch(loadingSlice.actions.setLoading(true));
        if (route.params.targeId !== 0) {
          await storeAPI.update(
            {
              name,
              storeNumber,
              roadNameAddress,
              detailAddress,
              picupZone,
              businessHours,
              dayOff: dayOfString,
              latitude: myLocation.latitude,
              longitude: myLocation.longitude,
            },
            route.params.targeId,
          );
        } else {
          await storeAPI.update(
            {
              name,
              storeNumber,
              roadNameAddress,
              detailAddress,
              picupZone,
              businessHours,
              dayOff: dayOfString,
              latitude: myLocation.latitude,
              longitude: myLocation.longitude,
            },
            user.id,
          );
        }

        Alert.alert('매장이 수정되었습니다.');
        if (route.params.targeId !== 0) {
          navigation.reset({routes: [{name: RouterList.Admin}]});
        } else {
          navigation.reset({routes: [{name: RouterList.MyInfo}]});
        }
      } catch (e) {
      } finally {
        dispatch(loadingSlice.actions.setLoading(false));
      }
    },
    [
      route,
      user,
      name,
      storeNumber,
      roadNameAddress,
      detailAddress,
      myLocation,
      picupZone,
      dispatch,
      navigation,
    ],
  );

  const vaildationStoreData = useCallback(() => {
    let validate = '';
    if (name === '') {
      validate += '매장명 ';
    }
    if (roadNameAddress === '') {
      validate += '도로명주소 ';
    }
    if (detailAddress === '') {
      validate += '상세주소 ';
    }
    if (picupZone === '') {
      validate += '픽업존 ';
    }
    if (storeNumber === '') {
      validate += '전화번호 ';
    }

    if (validate !== '') {
      console.log(validate);
      Alert.alert(validate + '을(를) 입력하지 않았습니다.');
    } else {
      let dayOfString = '';
      dayOff.map((v, index) => {
        if (index === 0) {
          dayOfString += v;
        } else {
          dayOfString += `,${v}`;
        }
      });
      const businessHours = `${sunStart.length === 0 ? '00:00' : sunStart}-${
        sunEnd.length === 0 ? '00:00' : sunEnd
      },${monStart.length === 0 ? '00:00' : monStart}-${
        monEnd.length === 0 ? '00:00' : monEnd
      },${tueStart.length === 0 ? '00:00' : tueStart}-${
        tueEnd.length === 0 ? '00:00' : tueEnd
      },${wedStart.length === 0 ? '00:00' : wedStart}-${
        wedEnd.length === 0 ? '00:00' : wedEnd
      },${thuStart.length === 0 ? '00:00' : thuStart}-${
        thuEnd.length === 0 ? '00:00' : thuEnd
      },${friStart.length === 0 ? '00:00' : friStart}-${
        friEnd.length === 0 ? '00:00' : friEnd
      },${satStart.length === 0 ? '00:00' : satStart}-${
        satEnd.length === 0 ? '00:00' : satEnd
      }`;
      if (isUpdate) {
        updateStoreAPIHandler(businessHours, dayOfString);
      } else {
        createStoreAPIHandler(businessHours, dayOfString);
      }
    }
  }, [
    name,
    roadNameAddress,
    detailAddress,
    picupZone,
    storeNumber,
    dayOff,
    monStart,
    monEnd,
    tueStart,
    tueEnd,
    satStart,
    satEnd,
    sunStart,
    sunEnd,
    friStart,
    friEnd,
    wedStart,
    wedEnd,
    thuStart,
    thuEnd,
    isUpdate,
    createStoreAPIHandler,
    updateStoreAPIHandler,
  ]);

  return (
    <SafeAreaView style={tailwind('bg-background')}>
      <View style={tailwind('h-full')}>
        <View
          style={tailwind(
            `h-[56px] px-5 w-full bg-background border-b border-[#F4F4F4] flex flex-col items-center justify-center relative`,
          )}>
          <Pressable
            onPress={() => {
              if (route.params.targeId !== 0) {
                navigation.reset({routes: [{name: RouterList.Admin}]});
              } else {
                navigation.reset({routes: [{name: RouterList.MyInfo}]});
              }
            }}
            style={tailwind(
              'absolute top-0 px-[20px] left-0  h-[56px] flex flex-col items-center justify-center',
            )}>
            <BackIcon width={21} height={21} fill={'black'} />
          </Pressable>

          <Text style={tailwind('font-[600] text-[21px] leading-[24px]')}>
            {isUpdate ? `매장 수정` : `매장 등록`}
          </Text>
          {isUpdate ? (
            <Pressable
              onPress={() => {
                vaildationStoreData();
              }}
              style={tailwind(
                'absolute top-0 px-[20px] right-0  h-[56px] flex flex-col items-center justify-center',
              )}>
              <Text
                style={tailwind(
                  'text-[21px] leading-[24px] font-[400] text-[#FF521C]',
                )}>
                수정
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                vaildationStoreData();
              }}
              style={tailwind(
                'absolute top-0 px-[20px] right-0  h-[56px] flex flex-col items-center justify-center',
              )}>
              <Text
                style={tailwind(
                  'text-[21px] leading-[24px] font-[400] text-[#FF521C]',
                )}>
                등록
              </Text>
            </Pressable>
          )}
        </View>

        <View
          style={[
            tailwind(``),
            {
              height: Dimensions.get('window').height - 86 - StatusBarHeight!,
            },
          ]}>
          <KeyboardAwareScrollView
            style={tailwind(' bg-background')}
            extraScrollHeight={Platform.OS === 'ios' ? 80 : 80}
            extraHeight={100}
            // resetScrollToCoords={{x: 0, y: 0}}
            scrollEnabled={true}
            enableOnAndroid={true}
            keyboardOpeningTime={0}
            keyboardShouldPersistTaps={'handled'}>
            <View style={{height: 244}}>
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
                  myLocation.latitude !== 0
                    ? {
                        latitude: myLocation.latitude,
                        longitude: myLocation.longitude,
                        zoom: 13,
                      }
                    : {
                        longitude: 126.90524760654188,
                        latitude: 37.52272557493458,
                        zoom: 13,
                      }
                }
                onMapClick={e => console.log('onMapClick', JSON.stringify(e))}>
                <Marker
                  width={Platform.OS === 'android' ? 30 : 30}
                  height={Platform.OS === 'android' ? 30 : 30}
                  coordinate={{
                    latitude: myLocation.latitude,
                    longitude: myLocation.longitude,
                  }}
                  onClick={() => console.log('onClick! p0')}
                  image={require('../assets/image/store.png')}
                />
              </NaverMapView>
            </View>
            <View style={tailwind('px-5')}>
              <TextInput
                onFocus={() => {
                  setFocus('매장명');
                }}
                placeholderTextColor={'#D3D3D3'}
                style={tailwind(
                  `w-full h-[64px] border-b ${
                    focus === '매장명' ? 'border-primary' : 'border-[#F4F4F4]'
                  } text-[#1C1C1E] text-[20px] leading-[23px] font-[400]`,
                )}
                placeholder="매장명을 입력해주세요."
                value={name}
                onChangeText={text => setName(text)}
              />
              <Pressable
                onPress={() => {
                  setIsPostCode(true);
                  Keyboard.dismiss();
                  setFocus('도로명주소');
                }}
                style={tailwind(
                  ` h-[64px] border-b ${
                    focus === '도로명주소'
                      ? 'border-primary'
                      : 'border-[#F4F4F4]'
                  }  flex flex-row justify-between items-center`,
                )}>
                <View>
                  <Text
                    style={tailwind(
                      `text-[20px] leading-[23px] font-[400] ${
                        roadNameAddress === ''
                          ? 'text-[#D3D3D3]'
                          : 'text-[#1C1C1E]'
                      } `,
                    )}>
                    {roadNameAddress === ''
                      ? '도로명 주소를 입력해주세요.'
                      : roadNameAddress}
                  </Text>
                </View>
              </Pressable>
              <TextInput
                onFocus={() => {
                  setFocus('상세주소');
                }}
                placeholderTextColor={'#D3D3D3'}
                style={tailwind(
                  `w-full h-[64px] border-b ${
                    focus === '상세주소' ? 'border-primary' : 'border-[#F4F4F4]'
                  } text-[#1C1C1E] text-[20px] leading-[23px] font-[400]`,
                )}
                placeholder="상세주소를 입력해주세요."
                value={detailAddress}
                onChangeText={text => setDetailAddress(text)}
              />
              <TextInput
                onFocus={() => {
                  setFocus('픽업존');
                }}
                placeholderTextColor={'#D3D3D3'}
                style={tailwind(
                  `w-full h-[64px] border-b ${
                    focus === '픽업존' ? 'border-primary' : 'border-[#F4F4F4]'
                  } text-[#1C1C1E] text-[20px] leading-[23px] font-[400]`,
                )}
                placeholder="픽업존을 입력해주세요."
                value={picupZone}
                onChangeText={text => setPicupZone(text)}
              />
              <TextInput
                onFocus={() => {
                  setFocus('전화번호');
                }}
                placeholderTextColor={'#D3D3D3'}
                style={tailwind(
                  `w-full h-[64px] border-b ${
                    focus === '전화번호' ? 'border-primary' : 'border-[#F4F4F4]'
                  } text-[#1C1C1E] text-[20px] leading-[23px] font-[400]`,
                )}
                keyboardType="number-pad"
                placeholder="전화번호를 입력해주세요."
                value={storeNumber}
                onChangeText={text => setStoreNumber(text)}
              />
              <BusinessHours
                dayOff={dayOff}
                setDayOff={setDayOff}
                monStart={monStart}
                monEnd={monEnd}
                setMonStart={setMonStart}
                setMonEnd={setMonEnd}
                tueStart={tueStart}
                tueEnd={tueEnd}
                setTueStart={setTueStart}
                setTueEnd={setTueEnd}
                wedStart={wedStart}
                wedEnd={wedEnd}
                setWedStart={setWedStart}
                setWedEnd={setWedEnd}
                thuStart={thuStart}
                thuEnd={thuEnd}
                setThuStart={setThuStart}
                setThuEnd={setThuEnd}
                friStart={friStart}
                friEnd={friEnd}
                setFriStart={setFriStart}
                setFriEnd={setFriEnd}
                satStart={satStart}
                satEnd={satEnd}
                setSatStart={setSatStart}
                setSatEnd={setSatEnd}
                sunStart={sunStart}
                sunEnd={sunEnd}
                setSunStart={setSunStart}
                setSunEnd={setSunEnd}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
        {isPostCode && (
          <View
            style={tailwind('absolute inset-0 w-full h-full bg-background')}>
            <View
              style={tailwind(
                'h-[48px] w-full bg-background flex flex-col items-start justify-center',
              )}>
              <Pressable
                onPress={() => {
                  setIsPostCode(false);
                  setFocus('도로명주소');
                }}
                style={tailwind(
                  ' h-[48px] px-[16px] flex flex-col items-center justify-center',
                )}>
                <BackIcon width={21} height={21} fill={'black'} />
              </Pressable>
            </View>
            <Postcode
              style={tailwind('w-full h-full')}
              onError={() => {
                console.log('error');
              }}
              jsOptions={{animation: true}}
              onSelected={data => {
                setRoadNameAddress(data.address);
                changeLocationHandler(data.address);
                setIsPostCode(false);
              }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
