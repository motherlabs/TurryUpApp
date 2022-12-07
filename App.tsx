import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {TailwindProvider} from 'tailwind-rn';
import Router from './Router';
import store from './src/store';
import utilities from './tailwind.json';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import CodePush, {CodePushOptions} from 'react-native-code-push';

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// });

// messaging().onMessage(async remoteMessage => {
//   console.log('A new FCM message arrived!', remoteMessage);
// });
PushNotification.configure({
  // (optional) 토큰이 생성될 때 실행됨(토큰을 서버에 등록할 때 쓸 수 있음)
  onRegister: async function (token: any) {
    console.log('TOKEN:', token);
  },

  // (required) 리모트 노티를 수신하거나, 열었거나 로컬 노티를 열었을 때 실행
  onNotification: function (notification: any) {
    console.log('NOTIFICATION:', notification);
    console.log('check2');
    if (notification.channelId === 'partner-order') {
      // if (notification.message || notification.data.message) {
      //   store.dispatch(
      //     userSlice.actions.showPushPopup(
      //       notification.message || notification.data.message,
      //     ),
      //   );
      // }
      if (notification.foreground) {
        console.log('order handler');
        // storeSlice.actions.orderHandler(notification.data.tagetId);
      }
    }

    // process the notification

    // (required) 리모트 노티를 수신하거나, 열었거나 로컬 노티를 열었을 때 실행
    notification.finish(PushNotificationIOS.FetchResult.NoData);

    if (notification.foreground) {
      console.log('check4');
      // PushNotification.localNotification({
      //   title: notification.title,
      //   message: notification.message,
      //   channelId: notification.channelId,
      // });
    }
  },

  // (optional) 등록한 액션을 누렀고 invokeApp이 false 상태일 때 실행됨, true면 onNotification이 실행됨 (Android)
  onAction: function (notification: any) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);
    console.log('check3');

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err: Error) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});
PushNotification.createChannel(
  {
    channelId: 'partner-order', // (required)
    channelName: '파트너 주문 알림용', // (required)
    channelDescription: '파트너 주문오는 알림', // (optional) default: undefined.
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: 4, // (optional) default: 4. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  },
  (created: boolean) =>
    console.log(`createChannel notification returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

const codePushOptions: CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
  // 언제 업데이트를 체크하고 반영할지를 정한다.
  // ON_APP_RESUME은 Background에서 Foreground로 오는 것을 의미
  // ON_APP_START은 앱이 실행되는(켜지는) 순간을 의미
  installMode: CodePush.InstallMode.IMMEDIATE,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
  // 업데이트를 어떻게 설치할 것인지 (IMMEDIATE는 강제설치를 의미)
};

const App = () => {
  // const user = useSelector((state: RootState) => state.user.me);
  // const dispatch = useAppDispatch();
  // const [loaded] = Font.useFonts({
  //   Pretendard: require('./assets/fonts/PretendardVariable.ttf'),
  // });

  // if (!loaded) {
  //   return null;
  // }

  // const isDarkMode = useColorScheme() === 'dark';
  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     console.log('FCM Message Data:', remoteMessage);
  //   });

  //   return unsubscribe;
  // }, []);

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  useEffect(() => {
    CodePush.sync({
      installMode: CodePush.InstallMode.IMMEDIATE,
      mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
      updateDialog: {
        mandatoryUpdateMessage:
          '필수 업데이트가 있어 설치 후 앱을 재시작합니다.',
        mandatoryContinueButtonLabel: '재시작',
        optionalIgnoreButtonLabel: '나중에',
        optionalInstallButtonLabel: '재시작',
        optionalUpdateMessage: '업데이트가 있습니다. 설치하시겠습니까?',
        title: '업데이트 안내',
      },
    });
  }, []);

  return (
    // <SafeAreaView style={backgroundStyle}>
    //   <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
    <>
      <Provider store={store}>
        <TailwindProvider utilities={utilities}>
          <Router />
        </TailwindProvider>
      </Provider>
    </>
    // </SafeAreaView>
  );
};

export default CodePush(codePushOptions)(App);
