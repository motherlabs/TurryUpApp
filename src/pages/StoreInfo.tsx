import {View, Pressable, Platform, Linking, Alert} from 'react-native';
import {DefaultFontText as Text} from '../components/DefaultFontText';
import React, {useEffect, useState} from 'react';
import {useTailwind} from 'tailwind-rn/dist';
import {
  NavigationProp,
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {RootStackParamList, RouterList} from '../../Router';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackIcon from '../assets/svg/back.svg';
import NaverMapView, {Marker} from 'react-native-nmap';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import storeAPI from '../api/storeAPI';
import {useAppDispatch} from '../store';
import loadingSlice from '../slices/loadingSlice';
import {IStore} from '../types/storeType';
import {getBusinessHours} from '../utils/businessHours';

interface Props {
  setStatusbarColor: React.Dispatch<
    React.SetStateAction<'light-content' | 'dark-content'>
  >;
}

export default function StoreInfo({setStatusbarColor}: Props) {
  const tailwind = useTailwind();
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<RootStackParamList, 'StoreInfo'>>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [myLocation, setMylocation] = useState<{
    latitude: number;
    longitude: number;
  }>({latitude: 0, longitude: 0});
  const [name, setName] = useState('');
  const [storeNumber, setStoreNumber] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [picupZone, setPicupZone] = useState('');
  const [dayOffString, setDayOffString] = useState('');
  const [mon, setMon] = useState('');
  const [tue, setTue] = useState('');
  const [wed, setWed] = useState('');
  const [thu, setThu] = useState('');
  const [fri, setFri] = useState('');
  const [sat, setSat] = useState('');
  const [sun, setSun] = useState('');
  const [businessHours, setBusinessHours] = useState(
    '00:00-00:00,00:00-00:00,09:00-00:00,00:00-00:00,00:00-00:00,00:00-00:00,00:00-00:00',
  );

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setStatusbarColor('dark-content');
    }
    return () => {
      setStatusbarColor('dark-content');
    };
  }, [setStatusbarColor, isFocused]);

  useEffect(() => {
    const findOneStoreAPIHandler = async () => {
      if (route.params) {
        dispatch(loadingSlice.actions.setLoading(true));
        const response = await storeAPI.findOne(route.params.userId);
        if (response.data.status !== 404) {
          const store: IStore = response.data;
          setName(store.name);
          setStoreNumber(store.storeNumber);
          setStoreAddress(`${store.roadNameAddress} ${store.detailAddress}`);
          setPicupZone(store.picupZone);
          setMylocation({
            latitude: store.latitude,
            longitude: store.longitude,
          });
          setBusinessHours(store.businessHours);
          const businessHoursArray = store.businessHours.split(',');
          setDayOffString(store.dayOff);
          setMon(businessHoursArray[1]);
          setTue(businessHoursArray[2]);
          setWed(businessHoursArray[3]);
          setThu(businessHoursArray[4]);
          setFri(businessHoursArray[5]);
          setSat(businessHoursArray[6]);
          setSun(businessHoursArray[0]);
        } else {
          console.log('store not found');
          Alert.alert('현재 운영되지 않는 매장입니다.');
          return navigation.reset({routes: [{name: RouterList.MyInfo}]});
        }
        dispatch(loadingSlice.actions.setLoading(false));
      }
    };
    findOneStoreAPIHandler();
  }, [route, dispatch, navigation]);

  return (
    <SafeAreaView style={tailwind('bg-background')}>
      <KeyboardAwareScrollView
        extraScrollHeight={Platform.OS === 'ios' ? 0 : 0}
        extraHeight={100}
        resetScrollToCoords={{x: 0, y: 0}}
        scrollEnabled={true}
        enableOnAndroid={true}
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps={'handled'}
        style={tailwind('h-full bg-background')}>
        <View
          style={tailwind(
            'h-[70px] relative flex flex-col items-center justify-center bg-background',
          )}>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
            style={tailwind(
              'absolute h-[70px] flex flex-col items-start justify-center px-[13px] top-0 left-0',
            )}>
            <BackIcon width={21} height={21} fill={'black'} />
          </Pressable>
          <Text style={tailwind('text-[18px] leading-[21px] font-[600]')}>
            매장 정보
          </Text>
        </View>
        <View style={tailwind('bg-gray-500 h-[252px] w-full')}>
          {/*@ts-ignore */}
          <NaverMapView
            style={{width: '100%', height: 252}}
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
                    zoom: 14,
                    // tilt: 50,
                  }
                : {
                    longitude: 126.90524760654188,
                    latitude: 37.52272557493458,
                    zoom: 12,
                  }
            }
            onMapClick={e => console.log('onMapClick', JSON.stringify(e))}>
            <Marker
              width={40}
              height={40}
              coordinate={myLocation}
              onClick={() => console.log('onClick! p0')}
              image={require('../assets/image/store.png')}
            />
          </NaverMapView>
        </View>
        <View style={tailwind('py-[18px] px-[30px]')}>
          <View style={tailwind('flex flex-row items-center mb-2')}>
            <Text
              style={tailwind(
                'text-[23px] leading-[26px] font-[700] text-[#1C1C1E] mr-1',
              )}>
              {name}
            </Text>
            {name !== '' &&
            getBusinessHours(dayOffString, businessHours) === '영업중' ? (
              <View style={tailwind('bg-light rounded-[24px] px-2 py-1')}>
                <Text
                  style={tailwind(
                    'text-dark text-[13px] leading-[16px] font-[600]',
                  )}>
                  영업중
                </Text>
              </View>
            ) : (
              <View style={tailwind('bg-[#F4F4F4] rounded-[24px] px-2 py-1')}>
                <Text
                  style={tailwind(
                    'text-[#A7A7A8] text-[13px] leading-[16px] font-[600]',
                  )}>
                  영업종료
                </Text>
              </View>
            )}
          </View>
          <Text
            style={tailwind(
              'text-[17px] leading-[20px] text-[#4F4F51] font-[400] mb-2',
            )}>
            {storeAddress}
          </Text>
          <View style={tailwind('flex flex-row items-center mb-2')}>
            <Text
              style={tailwind(
                'text-[#4F4F51] text-[17px] leading-[20px] font-[600]',
              )}>
              전화:
            </Text>
            <Text
              style={tailwind(
                'ml-1 text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
              )}>
              {storeNumber}
            </Text>
          </View>
          <View style={tailwind('flex flex-row items-center mb-2')}>
            <Text
              style={tailwind(
                'text-[#4F4F51] text-[17px] leading-[20px] font-[600]',
              )}>
              픽업:
            </Text>
            <Text
              style={tailwind(
                'ml-1 text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
              )}>
              {picupZone}
            </Text>
          </View>
          <View style={tailwind('flex flex-col mb-[32px]')}>
            <Text
              style={tailwind(
                'text-[#4F4F51] text-[17px] leading-[20px] font-[600] mb-1',
              )}>
              픽업 가능시간
            </Text>
            <View style={tailwind('flex flex-row items-center mb-1')}>
              <Text
                style={tailwind(
                  'text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                )}>
                월:
              </Text>
              {dayOffString.includes('1') ? (
                <Text
                  style={tailwind(
                    'ml-1 text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                  )}>
                  휴무
                </Text>
              ) : (
                <Text
                  style={tailwind(
                    'ml-1 text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                  )}>
                  {mon}
                </Text>
              )}
            </View>
            <View style={tailwind('flex flex-row items-center mb-1')}>
              <Text
                style={tailwind(
                  'text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                )}>
                화:
              </Text>
              {dayOffString.includes('2') ? (
                <Text
                  style={tailwind(
                    'ml-1 text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                  )}>
                  휴무
                </Text>
              ) : (
                <Text
                  style={tailwind(
                    'ml-1 text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                  )}>
                  {tue}
                </Text>
              )}
            </View>
            <View style={tailwind('flex flex-row items-center mb-1')}>
              <Text
                style={tailwind(
                  'text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                )}>
                수:
              </Text>
              {dayOffString.includes('3') ? (
                <Text
                  style={tailwind(
                    'ml-1 text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                  )}>
                  휴무
                </Text>
              ) : (
                <Text
                  style={tailwind(
                    'ml-1 text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                  )}>
                  {wed}
                </Text>
              )}
            </View>
            <View style={tailwind('flex flex-row items-center mb-1')}>
              <Text
                style={tailwind(
                  'text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                )}>
                목:
              </Text>
              {dayOffString.includes('4') ? (
                <Text
                  style={tailwind(
                    'ml-1 text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                  )}>
                  휴무
                </Text>
              ) : (
                <Text
                  style={tailwind(
                    'ml-1 text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                  )}>
                  {thu}
                </Text>
              )}
            </View>
            <View style={tailwind('flex flex-row items-center mb-1')}>
              <Text
                style={tailwind(
                  'text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                )}>
                금:
              </Text>
              {dayOffString.includes('5') ? (
                <Text
                  style={tailwind(
                    'ml-1 text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                  )}>
                  휴무
                </Text>
              ) : (
                <Text
                  style={tailwind(
                    'ml-1 text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                  )}>
                  {fri}
                </Text>
              )}
            </View>
            <View style={tailwind('flex flex-row items-center mb-1')}>
              <Text
                style={tailwind(
                  'text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                )}>
                토:
              </Text>
              {dayOffString.includes('6') ? (
                <Text
                  style={tailwind(
                    'ml-1 text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                  )}>
                  휴무
                </Text>
              ) : (
                <Text
                  style={tailwind(
                    'ml-1 text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                  )}>
                  {sat}
                </Text>
              )}
            </View>
            <View style={tailwind('flex flex-row items-center')}>
              <Text
                style={tailwind(
                  'text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                )}>
                일:
              </Text>
              {dayOffString.includes('0') ? (
                <Text
                  style={tailwind(
                    'ml-1 text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                  )}>
                  휴무
                </Text>
              ) : (
                <Text
                  style={tailwind(
                    'ml-1 text-[#4F4F51] text-[17px] leading-[20px] font-[400]',
                  )}>
                  {sun}
                </Text>
              )}
            </View>
          </View>

          <Pressable
            style={tailwind(
              'w-full h-[52px] flex flex-col items-center justify-center bg-primary',
            )}
            onPress={() => {
              Linking.openURL(`tel:${storeNumber}`);
            }}>
            <Text
              style={tailwind(
                'text-[19px] leading-[22px] text-black font-[600]',
              )}>
              전화하기
            </Text>
          </Pressable>
        </View>
        <View style={tailwind('h-[10px] w-full bg-background')} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
