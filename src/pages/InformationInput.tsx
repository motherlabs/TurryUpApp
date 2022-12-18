import {View, Platform, StatusBar, Pressable, Dimensions} from 'react-native';
import {DefaultFontText as Text} from '../components/DefaultFontText';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTailwind} from 'tailwind-rn/dist';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../Router';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import BackIcon from '../assets/svg/back.svg';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {GenderType} from '../types/infoType';
import ArrowRight24 from '../assets/svg/arrow-right-24.svg';
import RNPickerSelect from 'react-native-picker-select';
import CheckBox from '@react-native-community/checkbox';
import infoAPI from '../api/infoAPI';
import {useAppDispatch} from '../store';
import loadingSlice from '../slices/loadingSlice';

export default function InformationInput() {
  const tailwind = useTailwind();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;
  const [gender, setGender] = useState<GenderType>('NONE');
  const [birthYear, setBirthYear] = useState('태어난 해');
  const [yearList, setYearList] = useState<{label: string; value: string}[]>(
    [],
  );
  const [interestGooods, setInterestGoods] = useState<string[]>([]);
  const selectRef = useRef<RNPickerSelect>(null);
  const interestGoodsList = [
    '과일',
    '정육',
    '채소',
    '샐러드',
    '냉장/냉동\n간편식',
    '통저림/\n면즉석밥',
    '수산/건어물',
    '밀키트',
    '김치/반찬',
    '쌀/잡곡',
    '뻥/디저트',
    '유아식',
    '장/양념\n소스',
    '간식/빙과\n떡',
    '커피/음료',
    '우유/유제품',
    '계란',
    '생필품',
    '꽃',
    '반려동물',
  ];

  useEffect(() => {
    const date = new Date();
    const currentYear = date.getFullYear();
    setYearList([]);
    for (let index = 1900; index < currentYear; index++) {
      setYearList(prev => [
        ...prev,
        {label: index.toString(), value: index.toString()},
      ]);
    }
  }, []);

  const createInfoAPIHandler = useCallback(async () => {
    try {
      dispatch(loadingSlice.actions.setLoading(true));
      let interestGoodsString = '';
      interestGooods.map((v, index) => {
        if (index === 0) {
          interestGoodsString += v;
        } else {
          interestGoodsString += `,${v}`;
        }
      });
      await infoAPI.create({
        birthYear: +birthYear,
        gender,
        interestGoods: interestGoodsString,
      });
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(loadingSlice.actions.setLoading(false));
      navigation.goBack();
    }
  }, [interestGooods, gender, birthYear, dispatch, navigation]);

  return (
    <>
      <SafeAreaView style={tailwind('bg-background')}>
        <View style={tailwind('px-4 h-[56px]  relative ')}>
          <View
            style={tailwind(
              'flex flex-col h-[56px]  items-center justify-center',
            )}>
            {/* <Text style={tailwind(' text-[21px] font-[600]')}>구매내역</Text> */}
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
              height: Dimensions.get('window').height - 166 - StatusBarHeight!,
            },
          ]}>
          <ScrollView style={tailwind('bg-background')}>
            <View style={tailwind('px-[30px] mt-2')}>
              <Text
                style={tailwind(
                  'text-[#000000] text-[22px] leading-[25px] font-[600]',
                )}>
                알려주시는 내용으로 더 알맞은 상품을 추천해 드릴게요.
              </Text>
              <View style={tailwind('mt-[28px]')}>
                <Text
                  style={tailwind(
                    'text-[#1C1C1E] text-[17px] leading-[20px] font-[500]',
                  )}>
                  성별
                </Text>
                <View style={tailwind('mt-2 flex flex-row')}>
                  <Pressable
                    onPress={() => {
                      if (gender === 'NONE') {
                        setGender('MALE');

                        if (Platform.OS === 'android') {
                          //@ts-ignore
                          selectRef.current?.focus()!;
                        } else {
                          selectRef.current?.togglePicker(true);
                        }
                      } else {
                        setGender('MALE');
                      }
                    }}
                    style={tailwind(
                      `w-[72px] h-[40px] rounded-[4px] flex flex-col items-center justify-center ${
                        gender === 'MALE' ? 'bg-primary_og' : 'bg-[#F4F4F4]'
                      }  mr-[15px]`,
                    )}>
                    <Text
                      style={tailwind(
                        `${
                          gender === 'MALE' ? 'text-white' : 'text-[#1C1C1E] '
                        } font-[700]`,
                      )}>
                      남자
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      if (gender === 'NONE') {
                        setGender('FEMALE');
                        if (Platform.OS === 'android') {
                          //@ts-ignore
                          selectRef.current?.focus()!;
                        } else {
                          selectRef.current?.togglePicker(true);
                        }
                      } else {
                        setGender('FEMALE');
                      }
                    }}
                    style={tailwind(
                      `w-[72px] h-[40px] rounded-[4px] flex flex-col items-center justify-center ${
                        gender === 'FEMALE' ? 'bg-primary_og' : 'bg-[#F4F4F4]'
                      }  mr-[15px]`,
                    )}>
                    <Text
                      style={tailwind(
                        `${
                          gender === 'FEMALE' ? 'text-white' : 'text-[#1C1C1E] '
                        } font-[700]`,
                      )}>
                      여자
                    </Text>
                  </Pressable>
                </View>
                <View style={tailwind('mt-[25px] flex flex-row items-center')}>
                  <View style={tailwind('flex flex-row items-center')}>
                    <View style={tailwind('')}>
                      <RNPickerSelect
                        useNativeAndroidPickerStyle={false}
                        style={{inputAndroid: {color: 'black'}}}
                        ref={Platform.OS === 'ios' ? selectRef : null}
                        pickerProps={{
                          //@ts-ignore
                          ref: Platform.OS === 'android' ? selectRef : null,
                        }}
                        placeholder={{
                          label: '태어난 해를 선택해주세요.',
                          value: birthYear,
                        }}
                        onOpen={() => {
                          if (birthYear === '태어난 해') {
                            setBirthYear('1972');
                            if (Platform.OS === 'android') {
                              //@ts-ignore
                              selectRef.current?.focus()!;
                            } else {
                              selectRef.current?.togglePicker(true);
                            }
                          }
                          console.log('check open');
                        }}
                        // onDonePress={() => {
                        //   originPriceRef.current?.focus();
                        // }}
                        items={yearList}
                        value={birthYear}
                        onValueChange={value => setBirthYear(value)}>
                        <Text
                          style={tailwind(
                            'text-[#1C1C1E] text-[17px] leading-[20px] font-[500] mr-3',
                          )}>
                          {birthYear}
                        </Text>
                      </RNPickerSelect>
                    </View>
                    <ArrowRight24 width={18} height={18} />
                  </View>
                </View>
                <View style={tailwind('mt-[40px]')}>
                  <View style={tailwind('flex flex-row items-center')}>
                    <Text
                      style={tailwind(
                        'text-[#1C1C1E] text-[17px] leading-[20px] font-[500]',
                      )}>
                      관심 상품
                    </Text>
                    <View style={tailwind('ml-4 flex flex-row items-center')}>
                      <Pressable
                        style={tailwind('flex flex-row items-center')}
                        onPress={() => {
                          if (
                            interestGoodsList.length === interestGooods.length
                          ) {
                            setInterestGoods([]);
                          } else {
                            setInterestGoods(interestGoodsList);
                          }
                        }}>
                        <CheckBox
                          onValueChange={_ => {}}
                          style={tailwind(' w-[16px] h-[16px]')}
                          onAnimationType="fade"
                          offAnimationType="fade"
                          lineWidth={1}
                          boxType="square"
                          animationDuration={0}
                          disabled={true}
                          tintColor="#DEE2E8"
                          value={
                            interestGoodsList.length === interestGooods.length
                              ? true
                              : false
                          }
                          onCheckColor="#FF4D14"
                          onTintColor="#FF4D14"
                        />
                        <Text
                          style={tailwind(
                            `text-[#848688] text-[14px] leading-[17px] ${
                              Platform.OS === 'android' ? 'ml-4' : 'ml-2'
                            }`,
                          )}>{`(전체선택)`}</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={tailwind(
                'mt-[20px] pl-[30px] flex flex-row items-center flex-wrap justify-between',
              )}>
              {interestGoodsList.map((v, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    if (interestGooods.some(item => item === v)) {
                      const filtered = interestGooods.filter(
                        item => item !== v,
                      );
                      setInterestGoods(filtered);
                    } else {
                      setInterestGoods(prev => [...prev, v]);
                    }
                  }}
                  style={tailwind(
                    `w-[72px] h-[40px] rounded-[4px] flex flex-col items-center justify-center ${
                      interestGooods.some(item => item === v)
                        ? 'bg-primary_og'
                        : 'bg-[#F4F4F4]'
                    }  mr-[10px] mb-4`,
                  )}>
                  <Text
                    style={tailwind(
                      `${
                        interestGooods.some(item => item === v)
                          ? 'text-white'
                          : 'text-[#1C1C1E] '
                      } font-[700] text-center`,
                    )}>
                    {v}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
        <View
          style={tailwind(
            'h-[110px] bg-background px-4 pt-4 w-full border-t border-gray-200 flex flex-col items-center justify-start',
          )}>
          <Pressable
            disabled={
              gender === 'NONE' ||
              birthYear === '' ||
              interestGooods.length === 0
                ? true
                : false
            }
            onPress={() => {
              createInfoAPIHandler();
            }}
            style={tailwind(
              `flex flex-row items-center justify-center rounded-[4px] h-[55px] w-full ${
                gender === 'NONE' ||
                birthYear === '' ||
                interestGooods.length === 0
                  ? 'bg-[#DEE2E8]'
                  : 'bg-[#FFE145]'
              } `,
            )}>
            <Text
              style={tailwind(
                `text-[19px]  leading-[22px] font-[600]  ${
                  gender === 'NONE' ||
                  birthYear === '' ||
                  interestGooods.length === 0
                    ? 'text-white'
                    : 'text-black'
                }`,
              )}>
              {`${
                gender === 'NONE' ||
                birthYear === '' ||
                interestGooods.length === 0
                  ? '시작하기'
                  : '시작하기'
              }`}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}
