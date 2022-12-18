import {
  View,
  Platform,
  Pressable,
  TextInput,
  Alert,
  Keyboard,
  StatusBar,
  Dimensions,
  Switch,
} from 'react-native';
import {DefaultFontText as Text} from '../components/DefaultFontText';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTailwind} from 'tailwind-rn/dist';
import FastImage from 'react-native-fast-image';
import ImageCropPicker from 'react-native-image-crop-picker';
import CicleCancel from '../assets/svg/cicle-cancel.svg';
import ImageResizer from 'react-native-image-resizer';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import RNPickerSelect from 'react-native-picker-select';
import goodsAPI from '../api/goodsAPI';
import {convertBase64} from '../utils/convertBase64';
import {useAppDispatch} from '../store';
import loadingSlice from '../slices/loadingSlice';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {RootStackParamList, RouterList} from '../../Router';
import {IGoods} from '../types/goodsType';
import CameraIcon from '../assets/svg/camera.svg';
import ArrowSmallBottom from '../assets/svg/arrow-small-bottom.svg';
import useMustNumber from '../hooks/useMustNumber';
import {converterPrice} from '../utils/convertPrice';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatDate} from '../utils/dateFormat';
import {wait} from '../utils/timeout';
import Tabbar, {TabbarType} from '../components/Tabbar';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import FadeInOut from 'react-native-fade-in-out';
import PhotoLibrary from '../assets/svg/photo-library.svg';
import PhotoCamera from '../assets/svg/photo-camera.svg';
import categorySlice from '../slices/categorySlice';
import categoryAPI from '../api/categoryAPI';
import BackIcon from '../assets/svg/back.svg';

export default function GoodsAdd() {
  const tailwind = useTailwind();
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<RootStackParamList, 'GoodsAdd'>>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const categories = useSelector(
    (state: RootState) => state.category.categories,
  );
  const store = useSelector((state: RootState) => state.store.me);
  const [images, setImages] = useState<
    {uri: string; filename: string; type: string; id?: number}[]
  >([]);
  const [selectedCategory, setSelectedCategory] =
    useState('카테고리 선택 하세요');
  const [name, setName] = useState('');
  const [originPrice, setOriginPrice, changeoriginPriceHandler] =
    useMustNumber('');
  const [salePrice, setSalePrice, changeSalePriceHandler] = useMustNumber('');
  const [quantity, setQuantity, changeQuentityHandler] = useMustNumber('', {
    length: 3,
    limit: 0,
  });
  const [expiryDate, setExpiryDate] = useState('');
  const [selectCategories, setSelectedCategories] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const nameRef = useRef<TextInput>(null);
  const categoryRef = useRef<RNPickerSelect>(null);
  const originPriceRef = useRef<TextInput>(null);
  const salePriceRef = useRef<TextInput>(null);
  const quantityRef = useRef<TextInput>(null);
  const [focus, setFocus] = useState<
    '' | '이름' | '카테고리' | '정상가' | '할인판매가' | '판매수량' | '유통기한'
  >('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const StatusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;
  const [isPhotoModal, setIsPhotoModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [updateImages, setUpdateImages] = useState<
    {uri: string; filename: string; type: string}[]
  >([]);
  const [deleteImages, setDeleteImages] = useState<
    {
      location: string;
      id: number;
    }[]
  >([]);

  const [isAutoDiscount, setIsAutoDiscount] = useState(false);

  useEffect(() => {
    const findAllCategoryAPIHandler = async () => {
      try {
        dispatch(loadingSlice.actions.setLoading(true));
        const category = await categoryAPI.findAll();
        dispatch(categorySlice.actions.setCategories(category.data));
      } catch (e) {
      } finally {
        dispatch(loadingSlice.actions.setLoading(false));
      }
    };
    findAllCategoryAPIHandler();
  }, [dispatch]);

  useEffect(() => {
    setSelectedCategories([]);
    if (categories.length > 0) {
      categories.map(v => {
        setSelectedCategories(prev => [
          ...prev,
          {label: v.name, value: v.name},
        ]);
      });
    }
  }, [categories]);

  useEffect(() => {
    if (route.params) {
      if (route.params.goodsId !== 0) {
        const findOneGoodsAPIHandler = async () => {
          dispatch(loadingSlice.actions.setLoading(true));
          const goods: IGoods = await goodsAPI.findOne(route.params.goodsId);
          goods.GoodsImage.map(v => {
            setImages(prev => [
              ...prev,
              {uri: v.location, filename: '', type: '', id: v.id},
            ]);
          });
          setName(goods.name);
          setSelectedCategory(goods.category.name);
          setOriginPrice(goods.originPrice.toString());
          setSalePrice(goods.salePrice.toString());
          setQuantity(goods.quantity.toString());
          setExpiryDate(formatDate(new Date(goods.expiryDate)));
          dispatch(loadingSlice.actions.setLoading(false));
          if (goods.isAutoDiscount) {
            setIsAutoDiscount(true);
          }
        };
        findOneGoodsAPIHandler();
      } else {
      }
    }
    //eslint-disable-next-line
  }, [route, dispatch]);

  const responseHandler = useCallback(
    async (response: any) => {
      // setPreview(prev => [
      //   ...prev,
      //   {uri: `data:${response.mime};base64,${response.data}`},
      // ]);
      const orientation = (response.exif as any)?.Orientation;
      console.log('orientation', orientation);
      return ImageResizer.createResizedImage(
        `data:${response.mime};base64,${response.data}`,
        600,
        600,
        response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
        100,
        Platform.OS === 'android' ? 90 : 0,
      ).then(r => {
        if (route.params.isUpdate) {
          if (updateImages.length + images.length === 3) {
            return Alert.alert('상품이미지는 3장까지 등록 가능합니다.');
          }
          setUpdateImages(prev => [
            ...prev,
            {
              // uri: r.uri,
              uri: Platform.OS === 'android' ? `${r.uri}` : r.uri,
              filename: r.name,
              type: response.mime,
            },
          ]);
        } else {
          if (images.length === 3) {
            return Alert.alert('상품이미지는 3장까지 등록 가능합니다.');
          }
          setImages(prev => [
            ...prev,
            {
              // uri: r.uri,
              uri: Platform.OS === 'android' ? `${r.uri}` : r.uri,
              filename: r.name,
              type: response.mime,
            },
          ]);
        }
      });
    },
    [images, route, updateImages],
  );

  const takePhotoHandler = useCallback(() => {
    return ImageCropPicker.openCamera({
      includeExif: true,
      includeBase64: true,
    })
      .then(response => {
        responseHandler(response);
      })
      .catch(console.log);
  }, [responseHandler]);

  const changeFileHandler = useCallback(() => {
    return ImageCropPicker.openPicker({
      includeBase64: true,
      includeExif: true,
    })
      .then(response => {
        responseHandler(response);
      })
      .catch(console.log);
  }, [responseHandler]);

  const updateGoodsAPIHandler = useCallback(async () => {
    dispatch(loadingSlice.actions.setLoading(true));
    let validate = '';
    try {
      if (name === '') {
        validate += '상품명 ';
      }
      if (originPrice === '') {
        validate += '정상가 ';
      }
      if (salePrice === '') {
        validate += '할인판매가 ';
      }
      if (quantity === '') {
        validate += '판매수량 ';
      }
      if (expiryDate === '') {
        validate += '유통기한 ';
      }
      if (selectedCategory === '카테고리 선택 하세요') {
        validate += '카테고리 ';
      }
      if (validate !== '') {
        console.log(validate);
        Alert.alert(validate + '을(를) 입력하지 않았습니다.');
      } else {
        if (images.length + updateImages.length <= 0) {
          return Alert.alert('이미지를 등록해주세요.');
        }
        if (parseInt(originPrice) < parseInt(salePrice)) {
          return Alert.alert('판매가가 정가보다 높을 수 없습니다.');
        }
        const discount = String(
          Math.floor(
            ((parseInt(originPrice) - parseInt(salePrice)) /
              parseInt(originPrice)) *
              100,
          ),
        );
        let categoryId: string = '';
        categories.map(v => {
          if (v.name === selectedCategory) {
            categoryId = v.id.toString();
          }
        });

        const rnFormData: {
          name: string;
          data: string;
          filename?: string;
          type?: string;
        }[] = [];

        if (isAutoDiscount) {
          rnFormData.push({name: 'isAutoDiscount', data: '1'});
        } else {
          rnFormData.push({name: 'isAutoDiscount', data: '0'});
        }

        rnFormData.push({name: 'name', data: name});
        rnFormData.push({name: 'originPrice', data: originPrice});
        rnFormData.push({name: 'salePrice', data: salePrice});
        rnFormData.push({name: 'quantity', data: quantity});
        rnFormData.push({name: 'discount', data: discount.toString()});
        rnFormData.push({
          name: 'expiryDate',
          data: expiryDate,
        });
        rnFormData.push({name: 'categoryId', data: categoryId.toString()});

        if (updateImages.length !== 0) {
          for await (const image of updateImages) {
            const result = await convertBase64(image);
            console.log(typeof result.data);
            rnFormData.push({
              name: 'image',
              data: result.data,
              filename: result.filename,
              type: result.type,
            });
          }
        }

        let deleteImageIdList: string = '';
        let deleteImageLocationList: string = '';
        if (deleteImages.length) {
          deleteImages.map(v => {
            if (deleteImageIdList === '' || deleteImageLocationList === '') {
              deleteImageIdList += v.id.toString();
              deleteImageLocationList += v.location;
            } else {
              deleteImageIdList += `,${v.id.toString()}`;
              deleteImageLocationList += `,${v.location}`;
            }
          });
        }
        rnFormData.push({name: 'deleteImageIdList', data: deleteImageIdList});
        rnFormData.push({
          name: 'deleteImageLocationList',
          data: deleteImageLocationList,
        });
        await goodsAPI.update(rnFormData, route.params.goodsId);

        // await goodsAPI.update(
        //   {
        //     categoryId,
        //     discount,
        //     expiryDate: expiryDate,
        //     name,
        //     quantity,
        //     salePrice,
        //     originPrice,
        //   },
        //   route.params.goodsId,
        // );

        Alert.alert('상품이 수정되었습니다.');
        if (route.params.isHome) {
          navigation.reset({routes: [{name: RouterList.PartnerHome}]});
        } else {
        }
      }
    } catch (e) {
    } finally {
      dispatch(loadingSlice.actions.setLoading(false));
    }
  }, [
    isAutoDiscount,
    navigation,
    dispatch,
    name,
    originPrice,
    salePrice,
    expiryDate,
    quantity,
    selectedCategory,
    categories,
    route,
    updateImages,
    images,
    deleteImages,
  ]);

  const createGoodsAPIHandler = useCallback(async () => {
    dispatch(loadingSlice.actions.setLoading(true));
    let validate = '';
    try {
      if (name === '') {
        validate += '상품명 ';
      }
      if (originPrice === '') {
        validate += '정상가 ';
      }
      if (salePrice === '') {
        validate += '할인판매가 ';
      }
      if (quantity === '') {
        validate += '판매수량 ';
      }
      if (expiryDate === '') {
        validate += '유통기한 ';
      }
      if (selectedCategory === '카테고리 선택 하세요') {
        validate += '카테고리 ';
      }
      if (validate !== '') {
        Alert.alert(validate + '을(를) 입력하지 않았습니다.');
      } else {
        if (images.length <= 0) {
          return Alert.alert('이미지를 등록해주세요.');
        }
        if (parseInt(originPrice) < parseInt(salePrice)) {
          return Alert.alert('판매가가 정가보다 높을 수 없습니다.');
        }
        const discount = Math.floor(
          ((parseInt(originPrice) - parseInt(salePrice)) /
            parseInt(originPrice)) *
            100,
        );
        let categoryId = 0;
        categories.map(v => {
          if (v.name === selectedCategory) {
            categoryId = v.id;
          }
        });

        const rnFormData: {
          name: string;
          data: string;
          filename?: string;
          type?: string;
        }[] = [];
        if (isAutoDiscount) {
          rnFormData.push({name: 'isAutoDiscount', data: '1'});
        } else {
          rnFormData.push({name: 'isAutoDiscount', data: '0'});
        }

        rnFormData.push({name: 'name', data: name});
        rnFormData.push({name: 'originPrice', data: originPrice});
        rnFormData.push({name: 'salePrice', data: salePrice});
        rnFormData.push({name: 'quantity', data: quantity});
        rnFormData.push({name: 'discount', data: discount.toString()});
        rnFormData.push({
          name: 'expiryDate',
          data: expiryDate,
        });
        rnFormData.push({name: 'categoryId', data: categoryId.toString()});
        rnFormData.push({name: 'storeId', data: store.id.toString()});
        for await (const image of images) {
          const result = await convertBase64(image);
          console.log(typeof result.data);
          rnFormData.push({
            name: 'image',
            data: result.data,
            filename: result.filename,
            type: result.type,
          });
        }

        await goodsAPI.create(rnFormData);
        Alert.alert('상품이 등록 되었습니다.');
        navigation.reset({routes: [{name: RouterList.PartnerHome}]});
      }
    } catch (e) {
      console.log(e);
      Alert.alert('상품 등록에 실패했습니다. 관리자에게 문의하세요.');
    } finally {
      dispatch(loadingSlice.actions.setLoading(false));
    }
  }, [
    navigation,
    name,
    originPrice,
    salePrice,
    quantity,
    selectedCategory,
    images,
    categories,
    store,
    dispatch,
    expiryDate,
    isAutoDiscount,
  ]);

  return (
    <>
      <SafeAreaView style={tailwind('bg-background')}>
        <View
          style={tailwind(
            `h-[56px] px-5 w-full bg-background border-b border-[#F4F4F4] flex flex-col items-center justify-center relative`,
          )}>
          {route.params.isUpdate && (
            <Pressable
              onPress={() => {
                if (route.params.isHome) {
                  navigation.navigate(RouterList.PartnerHome);
                } else {
                }
              }}
              style={tailwind(
                'absolute top-0 px-[20px] left-0  h-[56px] flex flex-col items-center justify-center',
              )}>
              <BackIcon width={21} height={21} fill={'black'} />
            </Pressable>
          )}
          <Text style={tailwind('font-[600] text-[21px] leading-[24px]')}>
            {route.params.isUpdate ? `상품 수정` : `상품 등록`}
          </Text>
          {route.params.isUpdate ? (
            <Pressable
              onPress={updateGoodsAPIHandler}
              style={tailwind(
                'absolute top-0 px-[20px] right-0  h-[56px] flex flex-col items-center justify-center',
              )}>
              <Text
                style={tailwind(
                  'text-[21px] leading-[24px] font-[400] text-[#FF521C]',
                )}>
                수정
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={createGoodsAPIHandler}
              style={tailwind(
                'absolute top-0 px-[20px] right-0  h-[56px] flex flex-col items-center justify-center',
              )}>
              <Text
                style={tailwind(
                  'text-[21px] leading-[24px] font-[400] text-[#FF521C]',
                )}>
                등록
              </Text>
            </Pressable>
          )}
        </View>
        <View
          style={[
            tailwind(``),
            {
              height: Dimensions.get('window').height - 146 - StatusBarHeight!,
            },
          ]}>
          <KeyboardAwareScrollView
            style={tailwind(' h-full pb-[20px] bg-background')}
            extraScrollHeight={Platform.OS === 'ios' ? 80 : 80}
            extraHeight={100}
            resetScrollToCoords={{x: 0, y: 0}}
            scrollEnabled={true}
            enableOnAndroid={true}
            keyboardOpeningTime={0}
            keyboardShouldPersistTaps={'handled'}>
            <View
              style={tailwind(
                'flex px-[20px] w-[110px] h-[110px] relative flex-row w-full justify-start items-center',
              )}>
              <Pressable
                onPress={async () => {
                  setIsPhotoModal(prev => !prev);
                  await wait(200);
                  setVisible(true);
                }}
                style={tailwind(
                  'w-[72px] h-[72px] mr-5 border border-[#E9E9E9] flex flex-col items-center justify-center',
                )}>
                <CameraIcon style={tailwind('mb-[6px]')} />
                <Text
                  style={tailwind(
                    'text-[14px] font-[400] text-[#D3D3D3]',
                  )}>{`${images.length}/3`}</Text>
              </Pressable>

              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={tailwind('flex-1 overflow-hidden')}>
                {images.length !== 0 &&
                  images.map(v => (
                    <View
                      key={v.uri}
                      style={tailwind(
                        'w-[90px] h-[110px]  relative flex flex-col items-start justify-center',
                      )}>
                      <FastImage
                        style={tailwind('w-[72px] h-[72px] ')}
                        source={v}
                      />

                      <Pressable
                        onPress={() => {
                          if (route.params.isUpdate) {
                            setDeleteImages(prev => [
                              ...prev,
                              {location: v.uri, id: v.id!},
                            ]);
                            const filtered = images.filter(
                              item => item.uri !== v.uri,
                            );
                            setImages(filtered);
                          } else {
                            const filtered = images.filter(
                              item => item.uri !== v.uri,
                            );
                            setImages(filtered);
                          }
                        }}
                        style={tailwind(
                          'absolute w-[30px] h-[30px] z-30 rounded-full flex flex-col items-center justify-center right-[5px] top-[6px]',
                        )}>
                        <CicleCancel fill={'#0AD473'} />
                      </Pressable>
                    </View>
                  ))}
                {updateImages.length !== 0 &&
                  updateImages.map(v => (
                    <View
                      key={v.uri}
                      style={tailwind(
                        'w-[90px] h-[110px]  relative flex flex-col items-start justify-center',
                      )}>
                      <FastImage
                        style={tailwind('w-[72px] h-[72px] ')}
                        source={v}
                      />

                      <Pressable
                        onPress={() => {
                          const filtered = updateImages.filter(
                            item => item.uri !== v.uri,
                          );
                          setImages(filtered);
                        }}
                        style={tailwind(
                          'absolute w-[30px] h-[30px] z-30 rounded-full flex flex-col items-center justify-center right-[5px] top-[6px]',
                        )}>
                        <CicleCancel fill={'#0AD473'} />
                      </Pressable>
                    </View>
                  ))}
              </ScrollView>
            </View>
            <View style={tailwind('px-5 relative')}>
              <TextInput
                ref={nameRef}
                onFocus={() => {
                  setFocus('이름');
                }}
                style={tailwind(
                  `w-full h-[64px] border-b ${
                    focus === '이름' ? 'border-primary' : 'border-[#F4F4F4]'
                  } text-[#1C1C1E] text-[20px] leading-[23px] font-[400]`,
                )}
                placeholder="상품명을 입력하세요"
                placeholderTextColor={'#D3D3D3'}
                // onEndEditing={() => {
                //   categoryRef.current?.togglePicker();
                //   setFocus('카테고리');
                // }}
                value={name}
                onChangeText={text => setName(text)}
              />
              <Pressable
                onPress={() => {
                  categoryRef.current?.togglePicker();
                  setFocus('카테고리');
                }}
                style={tailwind(
                  ` h-[64px] border-b ${
                    focus === '카테고리' ? 'border-primary' : 'border-[#F4F4F4]'
                  }  flex flex-row justify-between items-center`,
                )}>
                <View>
                  <RNPickerSelect
                    ref={categoryRef}
                    placeholder={{
                      label: '카테고리 선택 하세요',
                      value: selectedCategory,
                    }}
                    onOpen={() => {
                      setFocus('카테고리');
                    }}
                    // onDonePress={() => {
                    //   originPriceRef.current?.focus();
                    // }}
                    items={selectCategories}
                    onValueChange={value => setSelectedCategory(value)}>
                    <Text
                      style={tailwind(
                        `text-[20px] leading-[23px] font-[400] ${
                          selectedCategory === '카테고리 선택 하세요'
                            ? 'text-[#D3D3D3]'
                            : 'text-[#1C1C1E]'
                        } `,
                      )}>
                      {selectedCategory}
                    </Text>
                  </RNPickerSelect>
                </View>
                <ArrowSmallBottom style={tailwind('mr-4')} />
              </Pressable>
              <TextInput
                ref={originPriceRef}
                onFocus={() => {
                  setFocus('정상가');
                }}
                style={tailwind(
                  `w-full h-[64px] border-b ${
                    focus === '정상가' ? 'border-primary' : 'border-[#F4F4F4]'
                  } text-[#1C1C1E] text-[20px] leading-[23px] font-[400]`,
                )}
                placeholder="정상가를 입력하세요"
                keyboardType="number-pad"
                placeholderTextColor={'#D3D3D3'}
                value={converterPrice(originPrice)}
                onChangeText={text => changeoriginPriceHandler(text)}
              />
              <TextInput
                ref={salePriceRef}
                onFocus={() => {
                  setFocus('할인판매가');
                }}
                style={tailwind(
                  `w-full h-[64px] border-b ${
                    focus === '할인판매가'
                      ? 'border-primary'
                      : 'border-[#F4F4F4]'
                  } text-[#1C1C1E] text-[20px] leading-[23px] font-[400]`,
                )}
                placeholder="할인판매가를 입력해주세요."
                placeholderTextColor={'#D3D3D3'}
                keyboardType="number-pad"
                value={converterPrice(salePrice)}
                onChangeText={text => changeSalePriceHandler(text)}
              />
              <TextInput
                ref={quantityRef}
                onFocus={() => {
                  setFocus('판매수량');
                }}
                style={tailwind(
                  `w-full h-[64px] border-b ${
                    focus === '판매수량' ? 'border-primary' : 'border-[#F4F4F4]'
                  } text-[#1C1C1E] text-[20px] leading-[23px] font-[400]`,
                )}
                placeholder="판매수량"
                keyboardType="number-pad"
                placeholderTextColor={'#D3D3D3'}
                value={quantity}
                onChangeText={text => changeQuentityHandler(text)}
              />
              <Pressable
                style={tailwind(
                  `w-full h-[64px] flex flex-col justify-center border-b ${
                    focus === '유통기한' ? 'border-primary' : 'border-[#F4F4F4]'
                  } `,
                )}
                onPress={async () => {
                  Keyboard.dismiss();
                  wait(1000);
                  setDatePickerVisibility(true);
                  setFocus('유통기한');
                }}>
                <Text
                  style={tailwind(
                    `${
                      expiryDate === '' ? 'text-[#D3D3D3]' : 'text-[#1C1C1E]'
                    } text-[20px] leading-[23px] font-[400]`,
                  )}>
                  {expiryDate === '' ? '유통기한' : expiryDate}
                </Text>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={text => {
                    setExpiryDate(formatDate(text));
                    setDatePickerVisibility(false);
                  }}
                  onCancel={() => {
                    setDatePickerVisibility(false);
                  }}
                />
              </Pressable>
              <View style={tailwind('mt-5')}>
                <View style={tailwind('flex flex-row items-center')}>
                  <Text
                    style={tailwind(
                      'text-[18px] leading-[21px] font-[600] mr-2',
                    )}>
                    자동 할인
                  </Text>
                  <Switch
                    ios_backgroundColor="#DEE2E8"
                    trackColor={{true: '#FF521C', false: '#DEE2E8'}}
                    onValueChange={() => {
                      setIsAutoDiscount(prev => !prev);
                    }}
                    value={isAutoDiscount}
                  />
                </View>
                <View
                  style={tailwind(
                    'px-4 py-2 border border-gray-300 mt-2 mb-4',
                  )}>
                  <Text
                    style={tailwind(
                      'text-[15px] leading-[18px] text-[#7B7B7C] font-[600]',
                    )}>
                    {`시간이 지남에 따라 자동으로 추가 할인이 들어가는 기능입니다.`}
                  </Text>
                  <Text
                    style={tailwind(
                      'mt-1 text-[15px] leading-[18px] text-[#7B7B7C] font-[600]',
                    )}>
                    {`유통기한 24시간 남았을 때 : 5% 추가 할인`}
                  </Text>
                  <Text
                    style={tailwind(
                      'mt-1 text-[15px] leading-[18px] text-[#7B7B7C] font-[600]',
                    )}>
                    {`유통기한 12시간 남았을 때 : 10% 추가 할인`}
                  </Text>
                  <Text
                    style={tailwind(
                      'mt-1 text-[15px] leading-[18px] text-[#7B7B7C] font-[600]',
                    )}>
                    {`(사전 고지를 통해 시간과 할인율은 변동될 수 있습니다)`}
                  </Text>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
        {route.params.isUpdate ? (
          <View style={tailwind('flex-1 h-[70px] w-full bg-background')}></View>
        ) : (
          <Tabbar type={TabbarType.SALLERADD} />
        )}
      </SafeAreaView>
      {isPhotoModal && (
        <Pressable
          onPress={() => {
            setIsPhotoModal(false);
            setVisible(false);
          }}
          style={tailwind(
            'absolute z-50 inset-0 flex flex-col items-center justify-center bg-black opacity-80 h-full w-full',
          )}>
          <FadeInOut style={tailwind('')} visible={visible} scale={true}>
            <View style={tailwind('flex flex-row items-center ')}>
              <Pressable
                onPress={() => {
                  setIsPhotoModal(false);
                  setVisible(false);
                  takePhotoHandler();
                }}
                style={tailwind(
                  'flex flex-col  items-center justify-center w-[70px]',
                )}>
                <PhotoCamera style={tailwind('mb-1')} />
                <Text style={tailwind('text-white')}>카메라</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsPhotoModal(false);
                  setVisible(false);
                  changeFileHandler();
                }}
                style={tailwind(
                  'flex flex-col  items-center justify-center w-[70px]',
                )}>
                <PhotoLibrary style={tailwind('mb-1')} />
                <Text style={tailwind('text-white')}>앨범</Text>
              </Pressable>
            </View>
          </FadeInOut>
        </Pressable>
      )}
    </>
  );
}
// 'font-[400] text-[16px] w-[140px] py-2 border-b-2 border-gray-500'
// const pickerSelectStyles = StyleSheet.create({
//   inputIOS: {
//     backgroundColor: 'yellow',
//   },
//   inputAndroid: {
//     fontSize: 17,
//     fontWeight: '400',
//     paddingBottom: 8,
//     paddingTop: 4,
//     width: 140,
//     borderBottomWidth: 2,
//     borderBottomColor: 'gray',
//   },
// });
