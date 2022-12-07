import {View, ActivityIndicator} from 'react-native';
import React from 'react';
import {useTailwind} from 'tailwind-rn/dist';

export default function Loading() {
  const tailwind = useTailwind();
  return (
    <View
      style={tailwind(
        'absolute inset-0 h-full w-full z-50 items-center justify-center',
      )}>
      <View style={tailwind('absolute inset-0 w-full ')} />
      <ActivityIndicator color={'#FF521C'} size={40} />
    </View>
  );
}
