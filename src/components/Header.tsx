import {View, Pressable} from 'react-native';
import React from 'react';
import {useTailwind} from 'tailwind-rn/dist';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../Router';
import BackIcon from '../assets/svg/back.svg';

interface Props {
  isBack: boolean;
  navigationHandler?: () => void;
}

export default function Header({isBack, navigationHandler = () => {}}: Props) {
  const tailwind = useTailwind();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View
      style={tailwind(
        'h-[60px] w-full bg-background flex flex-col items-start justify-center',
      )}>
      <Pressable
        style={tailwind(
          ' h-[60px] px-[13px] flex flex-row items-center justify-start',
        )}
        onPress={() => {
          if (isBack) {
            navigation.goBack();
          } else {
            navigationHandler();
          }
        }}>
        <BackIcon width={21} height={21} fill={'black'} />
      </Pressable>
    </View>
  );
}
