import {View, Text, Pressable} from 'react-native';
import React from 'react';
import {useTailwind} from 'tailwind-rn/dist';

export default function PicupButton() {
  const tailwind = useTailwind();
  return (
    <View
      style={tailwind(
        'absolute z-40 bottom-[80px] w-full flex flex-col items-center justify-center',
      )}>
      <Pressable
        onPress={() => {}}
        style={tailwind(
          'h-[45px] w-[320px] rounded-[4px] bg-primary flex flex-col items-center justify-center',
        )}>
        <Text
          style={tailwind(' text-[16px] leading-[19px] text-white font-[600]')}>
          1개 픽업 완료
        </Text>
      </Pressable>
    </View>
  );
}
