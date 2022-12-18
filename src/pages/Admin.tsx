import {View, Keyboard, Pressable} from 'react-native';
import {DefaultFontText as Text} from '../components/DefaultFontText';
import React, {useCallback, useEffect, useState} from 'react';
import {useTailwind} from 'tailwind-rn/dist';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import userAPI from '../api/userAPI';
import {UserRole} from '../types/userType';
import {useAppDispatch} from '../store';
import loadingSlice from '../slices/loadingSlice';
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {RootStackParamList, RouterList} from '../../Router';
import BackIcon from '../assets/svg/back.svg';

type IUsers = {
  id: number;
  phoneNumber: string;
  role: UserRole;
  Store: [] | null;
};

export default function Admin() {
  const tailwind = useTailwind();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [users, setUsers] = useState<IUsers[] | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<IUsers[] | null>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      console.log('admin check');

      const findAllUserAPIHandler = async () => {
        dispatch(loadingSlice.actions.setLoading(true));
        const response = await userAPI.findAll();
        setUsers(response.data);
        setFilteredUsers(response.data);
        dispatch(loadingSlice.actions.setLoading(false));
      };
      findAllUserAPIHandler();
    }
  }, [isFocused, dispatch]);

  const updateRoleUserAPIHandler = useCallback(
    async (data: {userId: number; role: UserRole}) => {
      dispatch(loadingSlice.actions.setLoading(true));
      try {
        await userAPI.updateRole(data);
        const response = await userAPI.findAll();
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (e) {
      } finally {
        dispatch(loadingSlice.actions.setLoading(false));
      }
    },
    [dispatch],
  );

  const changeFilteredUsers = useCallback(
    (phoneNumber: string) => {
      if (users) {
        setFilteredUsers(
          users.filter(v => v.phoneNumber.includes(phoneNumber)),
        );
      }
    },
    [users],
  );

  return (
    <SafeAreaView style={tailwind('bg-background')}>
      <View style={tailwind('px-5')}>
        <View
          style={tailwind(
            'h-[50px] w-full relative flex flex-row items-center justify-start  border-b-2 border-gray-500',
          )}>
          <Pressable
            onPress={() => {
              navigation.reset({routes: [{name: RouterList.MyInfo}]});
            }}
            style={tailwind(
              ' h-[50px] flex flex-col items-start justify-center pr-4',
            )}>
            <BackIcon width={21} height={21} fill={'black'} />
          </Pressable>
          <TextInput
            placeholder="ex. 01055601225"
            onChangeText={text => {
              changeFilteredUsers(text);
            }}
          />
        </View>
      </View>
      <TouchableWithoutFeedback
        style={tailwind('')}
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <ScrollView style={tailwind('px-5 mt-6 h-full')}>
          {filteredUsers &&
            filteredUsers.map(v => (
              <View
                key={v.id}
                style={tailwind(
                  'h-[40px]  flex flex-row items-center justify-between border-b border-gray-300 mb-3',
                )}>
                <Pressable
                  onPress={() => {
                    navigation.navigate(RouterList.StoreAdd, {targeId: v.id});
                  }}>
                  <Text>{v.phoneNumber}</Text>
                </Pressable>
                {v.role === UserRole.USER ? (
                  <Text>유저</Text>
                ) : (
                  <View
                    style={tailwind(
                      'flex flex-row justify-center items-center',
                    )}>
                    <Text>파트너</Text>
                    {v.Store === null && (
                      <Text style={tailwind('text-xs text-primary ml-1')}>
                        매장등록 필요
                      </Text>
                    )}
                  </View>
                )}
                {v.role === UserRole.USER ? (
                  <Pressable
                    onPress={() => {
                      updateRoleUserAPIHandler({
                        userId: v.id,
                        role: UserRole.PARTNER,
                      });
                    }}
                    style={tailwind(
                      'h-[30] bg-primary rounded-lg flex flex-col items-center justify-center px-2',
                    )}>
                    <Text style={tailwind('text-white')}>파트너로 변경</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => {
                      updateRoleUserAPIHandler({
                        userId: v.id,
                        role: UserRole.USER,
                      });
                    }}
                    style={tailwind(
                      'h-[30] bg-gray-300 rounded-lg flex flex-col items-center justify-center px-2',
                    )}>
                    <Text style={tailwind('text-black')}>유저로 변경</Text>
                  </Pressable>
                )}
              </View>
            ))}
          <View style={tailwind('h-[250px] w-full bg-background')} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
