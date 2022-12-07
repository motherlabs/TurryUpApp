import {AppState, Platform, StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/pages/Home';
import Payment from './src/pages/Payment';
import Login from './src/pages/Login';
import Start from './src/pages/Start';
import LocationSet from './src/pages/LocationSet';
import Basket from './src/pages/Basket';
import MyInfo from './src/pages/MyInfo';
import Detail from './src/pages/Detail';
import StoreInfo from './src/pages/StoreInfo';
import Store from './src/pages/Store';
import Setting from './src/pages/Setting';
import BuyHistory from './src/pages/BuyHistory';
import GoodsAdd from './src/pages/GoodsAdd';
import {useSelector} from 'react-redux';
import {RootState} from './src/store/reducer';
import Loading from './src/components/Loading';
import addressAPI from './src/api/addressAPI';
import {useAppDispatch} from './src/store';
import addressSlice from './src/slices/addressSlice';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import Config from 'react-native-config';
import userAPI from './src/api/userAPI';
import userSlice from './src/slices/userSlice';
import Admin from './src/pages/Admin';
import StoreAdd from './src/pages/StoreAdd';
import {UserRole, UserState} from './src/types/userType';
import storeAPI from './src/api/storeAPI';
import storeSlice from './src/slices/storeSlice';
import categoryAPI from './src/api/categoryAPI';
import categorySlice from './src/slices/categorySlice';
import PartnerHome from './src/pages/PartnerHome';
import PartnerStart from './src/pages/PartnerStart';
import SplashScreen from 'react-native-splash-screen';
import PartnerLogin from './src/pages/PartnerLogin';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import TermsOfService from './src/pages/TermsOfService';
import PrivacyPolicy from './src/pages/PrivacyPolicy';

export type RootStackParamList = {
  Admin: undefined;
  StoreAdd: {targeId: number};
  Home: undefined;
  Payment: {amount: string};
  Start: undefined;
  Login: undefined;
  LocationSet: undefined;
  MyInfo: undefined;
  Basket: undefined;
  Detail: {goodsId: number};
  StoreInfo: {userId: number};
  Store: {userId: number};
  Setting: undefined;
  BuyHistory: undefined;
  GoodsAdd: {isUpdate: boolean; goodsId: number; isHome: boolean};
  StoreSetting: undefined;
  PartnerHome: undefined;
  PartnerStart: undefined;
  PartnerLogin: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
};

export const RouterList = {
  Admin: 'Admin',
  StoreAdd: 'StoreAdd',
  Home: 'Home',
  Payment: 'Payment',
  Start: 'Start',
  Login: 'Login',
  LocationSet: 'LocationSet',
  MyInfo: 'MyInfo',
  Basket: 'Basket',
  Detail: 'Detail',
  StoreInfo: 'StoreInfo',
  Store: 'Store',
  Setting: 'Setting',
  BuyHistory: 'BuyHistory',
  GoodsAdd: 'GoodsAdd',
  StoreSetting: 'StoreSetting',
  PartnerHome: 'PartnerHome',
  PartnerStart: 'PartnerStart',
  PartnerLogin: 'PartnerLogin',
  PrivacyPolicy: 'PrivacyPolicy',
  TermsOfService: 'TermsOfService',
} as const;
export type RouterList = typeof RouterList[keyof typeof RouterList];

export default function Router() {
  const Stack = createNativeStackNavigator();
  // const Tab = createBottomTabNavigator();
  // const tabbarType = useSelector((state: RootState) => state.tabbar.type);
  // const isTabbar = useSelector((state: RootState) => state.tabbar.isTabbar);
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const dispatch = useAppDispatch();
  // const goods = useSelector((state: RootState) => state.goods.goods);
  // const basket = useSelector((state: RootState) => state.basket.basketList);
  // const isDarkMode = useColorScheme() === 'dark';
  const user = useSelector((state: RootState) => state.user.me);
  const [statusbarColor, setStatusbarColor] = useState<
    'light-content' | 'dark-content'
  >('dark-content');

  useEffect(() => {
    const findOneStoreAPIHandler = async () => {
      const myStore = await storeAPI.findOne(user.id);
      if (myStore.data.status !== 404) {
        console.log('store exist');
        dispatch(storeSlice.actions.setStore(myStore.data));
      }
    };

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('FCM Message Data:', remoteMessage);
      if (remoteMessage.notification?.android?.channelId === 'partner-order') {
        if (user.id > 0) {
          if (AppState.currentState === 'active') {
            findOneStoreAPIHandler();
            if (Platform.OS === 'android') {
              PushNotification.localNotification({
                message: `${remoteMessage.notification.body}`,
                title: remoteMessage.notification.title,
                actions: ['ReplyInput'],
              });
            }
          }
        }
      }
      if (remoteMessage.category === 'partner-order') {
        if (user.id > 0) {
          if (AppState.currentState === 'active') {
            findOneStoreAPIHandler();
            PushNotificationIOS.addNotificationRequest({
              id: 'partner-order',
              title: `${remoteMessage.notification!.title}`,
              body: `${remoteMessage.notification!.body}`,
              sound: 'default',
            });
          }
        }
      }
    });

    return unsubscribe;
  }, [dispatch, user]);

  useEffect(() => {
    const findOneStoreAPIHandler = async () => {
      const myStore = await storeAPI.findOne(user.id);
      if (myStore.data.status !== 404) {
        console.log('store exist');
        dispatch(storeSlice.actions.setStore(myStore.data));
      }
    };

    const unsubscribe = messaging().setBackgroundMessageHandler(
      async remoteMessage => {
        console.log('FCM Background Message Data:', remoteMessage);
        if (
          remoteMessage.notification?.android?.channelId === 'partner-order'
        ) {
          if (user.id > 0) {
            if (AppState.currentState === 'background') {
              findOneStoreAPIHandler();
            }
            console.log(
              remoteMessage.notification.title,
              remoteMessage.notification.body,
            );
          }
          console.log('partner-order');
        }
      },
    );

    return unsubscribe;
  }, [dispatch, user]);

  //기기토큰 설정
  useEffect(() => {
    const getToken = async () => {
      try {
        if (!messaging().isDeviceRegisteredForRemoteMessages) {
          await messaging().registerDeviceForRemoteMessages();
        }
        const token = await messaging().getToken();
        console.log('phone token: ', token);
        if (token) {
          await EncryptedStorage.setItem('fcmToken', token);
        }
      } catch (e) {}
    };
    getToken();
  }, []);

  useEffect(() => {
    const APIHandler = async () => {
      try {
        const accessToken = await EncryptedStorage.getItem('accessToken');
        const category = await categoryAPI.findAll();
        dispatch(categorySlice.actions.setCategories(category.data));
        if (accessToken) {
          console.log('there is Token');
          const address = await addressAPI.findPinned();
          const userResponse = await userAPI.auth();
          dispatch(userSlice.actions.setUser(userResponse.data));
          const fcmToken = await EncryptedStorage.getItem('fcmToken');
          if (fcmToken) {
            console.log('there is fcmToken');
            if (userResponse.data.fcmToken !== fcmToken) {
              console.log('not matched fcmToken');
              await userAPI.updateFcmToken({fcmToken});
            }
          }
          if (userResponse.data.role === UserRole.PARTNER) {
            dispatch(userSlice.actions.changeState(UserState.SELLER));
            const store = await storeAPI.findOne(userResponse.data.id);
            if (store.data.status !== 404) {
              console.log('store exist');
              dispatch(storeSlice.actions.setStore(store.data));
            }
          }
          if (address.data.status !== 404) {
            console.log('exist address', address.data);
            dispatch(addressSlice.actions.setAddress(address.data));
          }
          SplashScreen.hide();
        } else {
          SplashScreen.hide();
          console.log('not Found Token');
        }
      } catch (e) {
        console.log(e);
      } finally {
        SplashScreen.hide();
      }
    };
    APIHandler();
  }, [dispatch]);

  //토근 만료시 재발급
  useEffect(() => {
    axios.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        const {
          config,
          response: {status},
        } = error;
        if (status === 401) {
          console.log('reissuance Token');
          console.log(status);
          const originalRequest = config;
          const uniqueCode = await EncryptedStorage.getItem('uniqueCode');
          if (uniqueCode) {
            const response = await axios.post(`${Config.API_URL}auth/refresh`, {
              uniqueCode,
            });
            if (response.data.status === 404) {
              return;
            }
            await EncryptedStorage.setItem(
              'accessToken',
              response.data.accessToken,
            );
            originalRequest.headers = {
              Authorization: `Bearer ${response.data.accessToken}`,
            };

            // 전 리퀘스트 다시 요청
            return axios(originalRequest);
          } else {
            return;
          }
        }
        return Promise.reject(error);
      },
    );
  }, []);

  // const pushBasketHandler = useCallback(async () => {
  //   dispatch(
  //     basketSlice.actions.setList([
  //       ...basket,
  //       {id: basket.length + 1, goods: goods},
  //     ]),
  //   );
  // }, [dispatch, basket, goods]);

  return (
    <>
      <StatusBar barStyle={statusbarColor} />
      <SafeAreaProvider>
        <NavigationContainer>
          {/* <Tab.Navigator>
            <Tab.Screen
              name={RouterList.Home}
              options={{
                title: '홈',
                tabBarIcon: ({color}) => {
                  return <HomeIcon stroke={color} />;
                },
                tabBarActiveTintColor: '#1C1C1E',
                tabBarInactiveTintColor: '#D3D3D3',
                headerShown: false,
              }}>
              {_ => <Home />}
            </Tab.Screen>
            <Tab.Screen
              name={RouterList.Basket}
              options={{
                title: '장바구니',
                tabBarIcon: ({color}) => {
                  return <BasketIcon stroke={color} />;
                },
                tabBarActiveTintColor: '#1C1C1E',
                tabBarInactiveTintColor: '#D3D3D3',
                headerShown: false,
              }}>
              {_ => <Basket />}
            </Tab.Screen>
            <Tab.Screen
              name={RouterList.MyInfo}
              options={{
                title: 'MY',
                tabBarIcon: ({color}) => {
                  return <MyInfoIcon stroke={color} />;
                },
                tabBarActiveTintColor: '#1C1C1E',
                tabBarInactiveTintColor: '#D3D3D3',
                headerShown: false,
              }}>
              {_ => <MyInfo />}
            </Tab.Screen>
          </Tab.Navigator> */}

          <Stack.Navigator initialRouteName={RouterList.Start}>
            <Stack.Screen
              name={RouterList.Home}
              options={{headerShown: false, animation: 'none'}}>
              {_ => <Home />}
            </Stack.Screen>
            <Stack.Screen
              name={RouterList.PartnerHome}
              options={{headerShown: false, animation: 'none'}}>
              {_ => <PartnerHome />}
            </Stack.Screen>
            <Stack.Screen
              name={RouterList.Admin}
              options={{headerShown: false, animation: 'slide_from_right'}}>
              {_ => <Admin />}
            </Stack.Screen>
            <Stack.Screen
              name={RouterList.StoreAdd}
              options={{headerShown: false, animation: 'slide_from_right'}}>
              {_ => <StoreAdd />}
            </Stack.Screen>
            <Stack.Screen
              name={RouterList.Basket}
              options={{headerShown: false, animation: 'none'}}>
              {_ => <Basket />}
            </Stack.Screen>
            <Stack.Screen
              name={RouterList.GoodsAdd}
              options={{headerShown: false, animation: 'none'}}>
              {_ => <GoodsAdd />}
            </Stack.Screen>
            <Stack.Screen
              name={RouterList.MyInfo}
              options={{headerShown: false, animation: 'none'}}>
              {_ => <MyInfo />}
            </Stack.Screen>
            <Stack.Screen
              name={RouterList.Detail}
              options={{headerShown: false, animation: 'slide_from_right'}}>
              {_ => <Detail setStatusbarColor={setStatusbarColor} />}
            </Stack.Screen>
            <Stack.Screen
              name={RouterList.StoreInfo}
              options={{headerShown: false, animation: 'slide_from_right'}}>
              {_ => <StoreInfo setStatusbarColor={setStatusbarColor} />}
            </Stack.Screen>
            <Stack.Screen
              name={RouterList.Store}
              options={{headerShown: false, animation: 'slide_from_right'}}>
              {_ => <Store />}
            </Stack.Screen>
            <Stack.Screen
              name={RouterList.Setting}
              options={{headerShown: false, animation: 'slide_from_right'}}>
              {_ => <Setting />}
            </Stack.Screen>

            <Stack.Screen
              name={RouterList.BuyHistory}
              options={{headerShown: false, animation: 'slide_from_right'}}>
              {_ => <BuyHistory />}
            </Stack.Screen>

            <Stack.Screen
              name={RouterList.TermsOfService}
              options={{headerShown: false, animation: 'slide_from_right'}}>
              {_ => <TermsOfService />}
            </Stack.Screen>

            <Stack.Screen
              name={RouterList.PrivacyPolicy}
              options={{headerShown: false, animation: 'slide_from_right'}}>
              {_ => <PrivacyPolicy />}
            </Stack.Screen>

            <Stack.Screen
              name={RouterList.Payment}
              options={{headerShown: false, animation: 'slide_from_bottom'}}>
              {_ => <Payment />}
            </Stack.Screen>
            <Stack.Screen
              name={RouterList.Start}
              options={{headerShown: false, animation: 'fade'}}>
              {_ => <Start />}
            </Stack.Screen>
            <Stack.Screen
              name={RouterList.PartnerStart}
              options={{headerShown: false, animation: 'fade'}}>
              {_ => <PartnerStart setStatusbarColor={setStatusbarColor} />}
            </Stack.Screen>
            <Stack.Screen
              name={RouterList.Login}
              options={{headerShown: false, animation: 'slide_from_right'}}>
              {_ => <Login />}
            </Stack.Screen>
            <Stack.Screen
              name={RouterList.PartnerLogin}
              options={{headerShown: false, animation: 'slide_from_right'}}>
              {_ => <PartnerLogin />}
            </Stack.Screen>
            <Stack.Screen
              name={RouterList.LocationSet}
              options={{headerShown: false, animation: 'slide_from_right'}}>
              {_ => <LocationSet />}
            </Stack.Screen>
          </Stack.Navigator>

          {isLoading && <Loading />}
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
}
