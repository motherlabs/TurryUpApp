import {View, Text, TextInput, Pressable, Platform, Alert} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTailwind} from 'tailwind-rn/dist';
import {RootStackParamList, RouterList} from '../../Router';
import CircleCancel from '../assets/svg/cicle-cancel.svg';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useKeyboardEvent from '../hooks/useKeyboardEvent';
import Timer from '../components/Timer';
import {wait} from '../utils/timeout';
import {PressableOpacity} from 'react-native-pressable-opacity';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import userAPI from '../api/userAPI';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useAppDispatch} from '../store';
import userSlice from '../slices/userSlice';
import loadingSlice from '../slices/loadingSlice';
import Config from 'react-native-config';
import addressAPI from '../api/addressAPI';
import addressSlice from '../slices/addressSlice';
import {UserRole, UserState} from '../types/userType';
import storeAPI from '../api/storeAPI';
import storeSlice from '../slices/storeSlice';
import BackIcon from '../assets/svg/back.svg';

export default function Login() {
  const tailwind = useTailwind();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {isKeyboardActivate, keyboardHeight} = useKeyboardEvent();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [certifyNumber, setCertifyNumber] = useState('');
  const [SMSCode, setSMSCode] = useState('');
  const [isRequest, setIsRequest] = useState(false);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [isTester, setIsTester] = useState(false);
  const [pwd, setPwd] = useState('');
  const [timer, setTimer] = useState(180);
  const certifyInput = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const dispatch = useAppDispatch();
  const testerInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const focusPhoneInputHandler = async () => {
      await wait(600);
      if (phoneInputRef.current) {
        phoneInputRef.current.focus();
      }
    };
    focusPhoneInputHandler();
  }, [phoneInputRef]);

  const checkSMSCodeMatchesHandler = useCallback(async () => {
    try {
      dispatch(loadingSlice.actions.setLoading(true));
      if (SMSCode === certifyNumber) {
        const response = await userAPI.signIn(phoneNumber);
        if (response.data.method === 'signUp') {
          console.log('회원가입');
          await EncryptedStorage.setItem(
            'uniqueCode',
            response.data.uniqueCode,
          );
          await EncryptedStorage.setItem(
            'accessToken',
            response.data.accessToken,
          );
          dispatch(userSlice.actions.setUser(response.data.user));
          const fcmToken = await EncryptedStorage.getItem('fcmToken');
          if (fcmToken) {
            console.log('there is fcmToken');
            if (response.data.user.fcmToken !== fcmToken) {
              console.log('not matched fcmToken');
              await userAPI.updateFcmToken({fcmToken});
            }
          }
          dispatch(loadingSlice.actions.setLoading(false));
          navigation.reset({routes: [{name: RouterList.LocationSet}]});
        } else {
          console.log('로그인');
          await EncryptedStorage.setItem(
            'uniqueCode',
            response.data.uniqueCode,
          );
          await EncryptedStorage.setItem(
            'accessToken',
            response.data.accessToken,
          );
          const existAddress = await addressAPI.findPinned();
          dispatch(userSlice.actions.setUser(response.data.user));
          dispatch(userSlice.actions.changeState(UserState.BUYER));
          const fcmToken = await EncryptedStorage.getItem('fcmToken');
          if (fcmToken) {
            console.log('there is fcmToken');
            if (response.data.user.fcmToken !== fcmToken) {
              console.log('not matched fcmToken');
              await userAPI.updateFcmToken({fcmToken});
            }
          }
          dispatch(loadingSlice.actions.setLoading(false));
          if (existAddress.data.status === 404) {
            return navigation.reset({routes: [{name: RouterList.LocationSet}]});
          } else {
            dispatch(addressSlice.actions.setAddress(existAddress.data));
            if (response.data.user.role === UserRole.PARTNER) {
              const store = await storeAPI.findOne(response.data.user.id);
              if (store.data.status !== 404) {
                dispatch(storeSlice.actions.setStore(store.data));
              }
              return navigation.reset({routes: [{name: RouterList.Home}]});
            } else {
              return navigation.reset({routes: [{name: RouterList.Home}]});
            }
          }
        }
      } else {
        Alert.alert('인증번호가 정확하지 않습니다. 다시 한 번 입력해주세요.');
      }
    } catch (e) {
    } finally {
      dispatch(loadingSlice.actions.setLoading(false));
    }
  }, [certifyNumber, SMSCode, phoneNumber, dispatch, navigation]);

  const sendSMSUserAPIHandler = useCallback(async () => {
    if (Config.TESTER_ID === phoneNumber) {
      setIsTester(true);
      await wait(500);
      testerInputRef.current?.focus();
    } else {
      try {
        const response = await userAPI.sendSMS(phoneNumber);
        setSMSCode(response.data.toString());
        await wait(500);
        certifyInput.current?.focus();
      } catch (e) {
        console.log(e);
      }
    }
  }, [phoneNumber, setIsTester]);

  return (
    <>
      <SafeAreaView style={tailwind('bg-background relative')}>
        <View
          style={tailwind(
            'bg-background w-full h-[60px] flex flex-col items-start justify-center',
          )}>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
            style={tailwind(' px-3 h-[60px] flex flex-col justify-center')}>
            <BackIcon fill={'black'} />
          </Pressable>
        </View>
        {isTester && (
          <View
            style={tailwind(
              'absolute inset-0 h-full w-full z-40 items-center justify-center',
            )}>
            <View
              style={tailwind('absolute inset-0 w-full bg-black opacity-70')}
            />
            <View
              style={tailwind(
                'absolute left-0 top-[20%] w-full flex flex-col justify-start items-center',
              )}>
              <View
                style={tailwind(
                  'bg-white w-[80%] h-[200px] rounded-lg flex flex-col items-center justify-center',
                )}>
                <Text>test access required password</Text>
                <TextInput
                  ref={testerInputRef}
                  style={tailwind('mt-3')}
                  placeholder="password"
                  secureTextEntry={true}
                  value={pwd}
                  onChangeText={e => {
                    setPwd(e);
                  }}
                  onSubmitEditing={() => {
                    if (pwd === Config.TESTER_PWD) {
                      setSMSCode('test');
                      setCertifyNumber('test');
                      checkSMSCodeMatchesHandler();
                    } else {
                      Alert.alert('password is wrong');
                      setPwd('');
                    }
                  }}
                />
                <View
                  style={tailwind(
                    'flex flex-row items-center justify-center w-full mt-10',
                  )}>
                  <Pressable
                    onPress={() => {
                      setIsTester(false);
                    }}
                    style={tailwind(
                      'h-[30px] w-1/3 bg-gray-300 rounded-lg  flex flex-col items-center justify-center',
                    )}>
                    <Text>Cancel</Text>
                  </Pressable>
                  <View style={tailwind('w-[8px]')} />
                  <Pressable
                    onPress={() => {
                      if (pwd === Config.TESTER_PWD) {
                        setSMSCode('test');
                        setCertifyNumber('test');
                        checkSMSCodeMatchesHandler();
                      } else {
                        Alert.alert('password is wrong');
                        setPwd('');
                      }
                    }}
                    style={tailwind(
                      'h-[30px] w-1/3 bg-primary rounded-lg flex flex-col items-center justify-center',
                    )}>
                    <Text style={tailwind('text-white')}>Conform</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        )}
        <KeyboardAwareScrollView
          style={tailwind(' h-full pb-[20px] pt-4')}
          extraScrollHeight={Platform.OS === 'ios' ? 0 : 0}
          extraHeight={100}
          resetScrollToCoords={{x: 0, y: 0}}
          scrollEnabled={true}
          enableOnAndroid={true}
          keyboardOpeningTime={0}
          keyboardShouldPersistTaps={'handled'}>
          <View style={tailwind('px-[30px]')}>
            <View>
              <Text
                style={tailwind(
                  'leading-[36] text-[26px] leading-[29px] font-[700]',
                )}>{`반갑습니다!
휴대폰 번호로 가입해주세요.`}</Text>
              <Text
                style={tailwind(
                  'text-[15px] leading-[18px] text-[#4F4F51] font-[500] mt-2',
                )}>{`휴대폰 번호는 안전하게 보관되며 공개되지 않아요`}</Text>
            </View>
          </View>
          <View style={tailwind('mt-[37px] px-[30px]')}>
            <View>
              <Text
                style={tailwind(
                  `text-[15px] leading-[18px] font-[700]  ${
                    isRequest ? 'text-black' : 'text-black'
                  }`,
                )}>{`휴대폰 번호`}</Text>
              <View
                style={tailwind(
                  'mt-[6px] relative flex flex-row w-full h-[48px] flex flex-row',
                )}>
                <TextInput
                  ref={phoneInputRef}
                  style={tailwind(
                    '  font-[400] text-[16px] leading-[19px] flex-1 border-b-2 border-gray-500',
                  )}
                  placeholder="휴대폰 번호를 입력해주세요."
                  keyboardType="number-pad"
                  maxLength={11}
                  editable={!isRequest}
                  value={phoneNumber}
                  onChangeText={e => {
                    setPhoneNumber(e);
                  }}
                />
                {isRequest ? (
                  <PressableOpacity
                    onPress={() => {
                      sendSMSUserAPIHandler();
                      const clearHandler = async () => {
                        setIsRequest(false);
                        setTimer(180);
                        setIsTimeOut(false);
                        setCertifyNumber('');
                        await wait(500);
                        setIsRequest(true);
                        await wait(500);
                        certifyInput.current?.focus();
                      };
                      clearHandler();
                    }}
                    style={tailwind(
                      'w-[61px] ml-2 mt-2 h-[38px] flex flex-row items-center justify-center bg-gray-200 rounded-[4px] ',
                    )}>
                    <Text
                      style={tailwind('text-[14px] leading-[17px] font-[600]')}>
                      재발송
                    </Text>
                  </PressableOpacity>
                ) : (
                  <Pressable
                    onPress={() => {
                      setPhoneNumber('');
                    }}
                    style={tailwind('py-[15px] absolute right-[15px]')}>
                    <CircleCancel style={tailwind('flex-1')} fill={'#DEE2E8'} />
                  </Pressable>
                )}
              </View>
            </View>
          </View>

          {isRequest && (
            <View style={tailwind('mt-[32px] px-[30px]')}>
              <View>
                <Text
                  style={tailwind(
                    'text-[15px] leading-[18px] font-[700] text-black',
                  )}>{`인증번호`}</Text>
                <View
                  style={tailwind(
                    'mt-[6px] relative flex flex-row w-full h-[48px] border-b-2 border-gray-500',
                  )}>
                  <TextInput
                    ref={certifyInput}
                    style={tailwind(
                      '  font-[400] text-[16px] leading-[19px] w-full',
                    )}
                    placeholder="인증번호를 입력해주세요."
                    keyboardType="number-pad"
                    maxLength={6}
                    value={certifyNumber}
                    onChangeText={e => {
                      setCertifyNumber(e);
                    }}
                  />

                  <View style={tailwind('py-[15px] absolute right-[15px]')}>
                    <Timer setIsTimeOut={setIsTimeOut} timer={timer} />
                  </View>
                </View>
              </View>
            </View>
          )}
        </KeyboardAwareScrollView>
      </SafeAreaView>
      {isRequest && !isTester && (
        <Pressable
          disabled={certifyNumber.length < 6 ? true : false}
          onPress={() => {
            if (isTimeOut) {
              Alert.alert('제한시간을 초과했습니다.');
            } else {
              checkSMSCodeMatchesHandler();
            }
          }}
          style={[
            tailwind(
              `${
                isKeyboardActivate
                  ? `absolute  ${
                      certifyNumber.length < 6 ? 'bg-[#DEE2E8]' : 'bg-primary'
                    } w-full  h-[52px] flex flex-col items-center justify-center `
                  : 'hidden'
              } `,
            ),
            {bottom: keyboardHeight},
          ]}>
          <Text
            style={tailwind(
              `  ${
                certifyNumber.length < 6 ? 'text-white' : 'text-black'
              }  text-[16px] leading-[19px] font-[600]`,
            )}>
            인증하기
          </Text>
        </Pressable>
      )}
      {!isRequest && (
        <Pressable
          disabled={phoneNumber.length < 11 ? true : false}
          onPress={() => {
            sendSMSUserAPIHandler();
            const clearHandler = async () => {
              setIsRequest(true);
            };
            clearHandler();
          }}
          style={[
            tailwind(
              `${
                isKeyboardActivate
                  ? `absolute z-40 ${
                      phoneNumber.length < 11 ? 'bg-[#DEE2E8]' : 'bg-primary'
                    } w-full  h-[52px] flex flex-col items-center justify-center`
                  : 'hidden'
              } `,
            ),
            {bottom: keyboardHeight},
          ]}>
          <Text
            style={tailwind(
              ` ${
                phoneNumber.length < 11 ? 'text-white' : 'text-black'
              }  text-[16px] leading-[19px] font-[600] `,
            )}>
            인증번호 보내기
          </Text>
        </Pressable>
      )}
    </>
  );
}
