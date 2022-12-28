import {
  View,
  Text,
  StatusBar,
  Platform,
  Pressable,
  Dimensions,
} from 'react-native';
import React from 'react';
import {useTailwind} from 'tailwind-rn/dist';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../Router';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import BackIcon from '../assets/svg/back.svg';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function Inquiry() {
  const tailwind = useTailwind();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;

  return (
    <SafeAreaView style={tailwind('bg-background')}>
      <View
        style={tailwind('px-4 border-b  h-[56px] border-[#F4F4F4] relative ')}>
        <View
          style={tailwind(
            'flex flex-col h-[56px]  items-center justify-center',
          )}>
          <Text style={tailwind(' text-[21px] leading-[24px] font-[600]')}>
            문의사항
          </Text>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
            style={tailwind(
              'absolute top-0 left-0 h-[56px] flex flex-col items-center justify-center pr-5',
            )}>
            <BackIcon width={21} height={21} fill={'black'} />
          </Pressable>
        </View>
      </View>
      <View
        style={[
          tailwind(``),
          {
            height: Dimensions.get('window').height - 90 - StatusBarHeight!,
          },
        ]}>
        <View style={tailwind('px-4 py-5 h-full bg-background')}>
          <Text
            style={tailwind(
              'text-[21px] font-[700]',
            )}>{`픽업은 언제까지 하면 되나요?`}</Text>
          <Text style={tailwind('text-[17px] font-[400] mt-2')}>
            - 픽업은 소비기한에 한하여 가게 영업 시간 내에 하시면 됩니다. 기한을
            지나거나 영업 외 방문 시 폐기로 인해 상품 제공이 어렵습니다. 꼭 기한
            및 시간 내 방문 부탁드립니다.
          </Text>
          <Text
            style={tailwind(
              'text-[21px] font-[700] mt-4',
            )}>{`주문취소, 교환, 환불은 어떻게 하나요?`}</Text>
          <Text style={tailwind('text-[17px] font-[400] mt-2')}>
            - 마감할인 상품 특성 상 결제 완료 시 구매하신 상품의 주문 취소,
            교환, 환불은 불가합니다. 신중한 구매 부탁드립니다.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
