import {View, Text, Pressable} from 'react-native';
import React, {useEffect} from 'react';
import {useTailwind} from 'tailwind-rn/dist';
import {useAppDispatch} from '../store';
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {RootStackParamList, RouterList} from '../../Router';
import {RootState} from '../store/reducer';
import {useSelector} from 'react-redux';
import {UserRole} from '../types/userType';
import BackIcon from '../assets/svg/back.svg';
import StartPartnerIcon from '../assets/svg/start-partner.svg';
import {SafeAreaView} from 'react-native-safe-area-context';

interface Props {
  setStatusbarColor: React.Dispatch<
    React.SetStateAction<'light-content' | 'dark-content'>
  >;
}

export default function PartnerStart({setStatusbarColor}: Props) {
  const tailwind = useTailwind();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // const [visible, setVisible] = useState(false);
  const user = useSelector((state: RootState) => state.user.me);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setStatusbarColor('light-content');
    }
    return () => {
      setStatusbarColor('dark-content');
    };
  }, [setStatusbarColor, isFocused]);

  useEffect(() => {
    if (user.id > 0) {
      if (user.role === UserRole.PARTNER) {
        navigation.reset({routes: [{name: RouterList.PartnerHome}]});
      } else {
        navigation.reset({routes: [{name: RouterList.Home}]});
      }
    }
  }, [user, dispatch, navigation]);

  // useEffect(() => {
  //   const firstVisitHandler = async () => {
  //     await wait(500);
  //     setVisible(true);
  //   };
  //   firstVisitHandler();
  // }, []);

  return (
    <>
      <SafeAreaView style={tailwind(' bg-[#282828] relative')}>
        <View style={tailwind('relative h-full w-full bg-[#282828]')}>
          {/* <View style={tailwind('absolute z-40 w-full h-full bg-gray-300')}>
        <FastImage
          source={require('../assets/image/start-bg-dark.png')}
          style={tailwind('w-full h-full')}
          resizeMode={'cover'}
        />
      </View>
      <View
        style={tailwind(
          'flex-col items-center absolute z-50  w-full   top-[33%] relative',
        )}>
        <Logo />
        <View style={tailwind('mt-3 flex-col items-center')}>
          <Text style={tailwind('text-white font-bold text-[22px]')}>
            파트너 앱
          </Text>
        </View>
        <View style={tailwind('mt-5 flex-col items-center')}>
          <Text style={tailwind('font-[600] text-[14px] text-white')}>
            지금 내 주위에 어떤 할인이 있는지
          </Text>
          <Text style={tailwind('font-[600] text-[14px] text-white')}>
            서둘러 확인해보세요.
          </Text>
        </View>
      </View> */}
          <Pressable
            onPress={() => {
              navigation.reset({routes: [{name: RouterList.Start}]});
            }}
            style={tailwind('absolute top-[8px] left-0  p-4 z-50')}>
            <BackIcon width={28} height={28} fill={'white'} />
          </Pressable>
          <View
            style={tailwind(
              'absolute top-[25%] w-full flex flex-col items-center',
            )}>
            <StartPartnerIcon />
          </View>
          <View
            style={tailwind(
              'absolute bottom-[11%] z-50 w-full flex flex-col items-center',
            )}>
            {/* <FadeInOut visible={visible} scale={true}>
          <Tooltip />
        </FadeInOut> */}
            <Pressable
              onPress={() => {
                navigation.navigate(RouterList.PartnerLogin);
              }}
              style={tailwind(
                'w-[315px] bg-primary h-[52px] rounded-[4px] flex flex-col items-center justify-center',
              )}>
              <Text
                style={tailwind(
                  'text-black font-[600] text-[16px] leading-[19px]',
                )}>
                시작하기
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
