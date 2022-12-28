import {View, Alert} from 'react-native';
import React, {useCallback, useState} from 'react';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {RootStackParamList, RouterList} from '../../Router';
import {useTailwind} from 'tailwind-rn/dist';
import {SafeAreaView} from 'react-native-safe-area-context';
import IMP from 'iamport-react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import Loading from '../components/Loading';
import {useAppDispatch} from '../store';
import loadingSlice from '../slices/loadingSlice';
import paymentAPI from '../api/paymentAPI';
import orderAPI from '../api/orderAPI';
import basketAPI from '../api/basketAPI';
import goodsAPI from '../api/goodsAPI';

export default function Payment() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const tailwind = useTailwind();
  const dispatch = useAppDispatch();
  const [pg] = useState('uplus.tlgdacomxpay');
  const [method] = useState('card');
  const [merchantUid] = useState(`${new Date().getTime()}`);
  const [name] = useState('덕템');
  const [escrow] = useState(false);
  const user = useSelector((state: RootState) => state.user.me);
  const selectedList = useSelector(
    (state: RootState) => state.basket.selectedList,
  );
  const route = useRoute<RouteProp<RootStackParamList, 'Payment'>>();

  const successedHandler = useCallback(
    async (merchant_uid: string, imp_uid: string) => {
      try {
        dispatch(loadingSlice.actions.setLoading(true));
        for await (const item of selectedList) {
          await goodsAPI.updateQuantity({
            quantity: item.goods.quantity - item.quantity,
            goodsId: item.goods.id,
          });
        }
        const payment = await paymentAPI.create({
          amount: Number(route.params.amount),
          method: 'card',
          merchant_uid,
          imp_uid,
        });
        console.log(payment.data);
        if (payment.data.method !== '') {
          for await (const item of selectedList) {
            const order = await orderAPI.create({
              goodsId: item.goods.id,
              orderNumber: `${merchant_uid}-${item.goods.id}`,
              price: item.goods.salePrice * item.quantity,
              paymentId: Number(payment.data.id),
              quantity: item.quantity,
              status: '픽업 대기중',
              storeId: item.goods.store.id,
              targetId: item.goods.store.userId,
              goodsName: item.goods.name,
            });
            console.log(order.data);
          }
          let basketIdList: number[] = [];
          selectedList.map(v => {
            basketIdList.push(v.id);
          });
          await basketAPI.deleteAll({basketIdList});
          Alert.alert('결제 완료');
          navigation.reset({routes: [{name: RouterList.MyInfo}]});
        }
      } catch (e) {
        console.log(e);
      } finally {
        dispatch(loadingSlice.actions.setLoading(false));
      }
    },
    [dispatch, selectedList, navigation, route],
  );

  const failedHandler = useCallback(async () => {
    try {
      dispatch(loadingSlice.actions.setLoading(true));
      // const response = await basketAPI.findAll();
      // const basketListData: IBasket[] = response.data;
      for await (const item of selectedList) {
        console.log(`old:${item.goods.quantity} recent:${item.quantity}`);
        await goodsAPI.updateQuantity({
          quantity: item.goods.quantity + item.quantity,
          goodsId: item.goods.id,
        });
      }
      Alert.alert('결제에 실패했습니다.');
      navigation.reset({routes: [{name: RouterList.Basket}]});
    } catch (e) {
      console.log(e);
      Alert.alert('결제에 실패했습니다.');
      navigation.reset({routes: [{name: RouterList.Basket}]});
    } finally {
      // dispatch(loadingSlice.actions.setLoading(false));
    }
  }, [navigation, dispatch, selectedList]);

  return (
    <SafeAreaView style={tailwind(`bg-background`)}>
      <View style={tailwind('bg-light h-full')}>
        <View style={tailwind('w-full h-full')}>
          <IMP.Payment
            userCode="imp18245526"
            loading={<Loading />}
            data={{
              pg,
              pay_method: method,
              merchant_uid: `${merchantUid}-${user.id}`,
              name,
              amount: route.params.amount,
              app_scheme: 'com.turryup',
              buyer_name: user.phoneNumber,
              buyer_tel: user.phoneNumber,
              buyer_email: '',
              niceMobileV2: true,
              escrow,
            }}
            callback={response => {
              if (response.imp_success === 'false') {
                console.log('실패', response);
                failedHandler();
              } else if (response.imp_success === 'true') {
                console.log('성공', response);
                successedHandler(response.merchant_uid, response.imp_uid);
              } else {
                console.log('알수없는 실패', response);
                failedHandler();
              }
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
