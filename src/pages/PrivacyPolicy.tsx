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
import {ScrollView} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';

export default function PrivacyPolicy() {
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
          <Text style={tailwind(' text-[21px] font-[600]')}>
            개인정보처리방침
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
        <ScrollView style={tailwind('bg-background')}>
          <View style={tailwind('h-full bg-background px-4 py-5')}>
            <Text
              style={tailwind(
                'text-[16px] mb-2',
              )}>{`“주식회사 마더랩스”(이하 “회사” 또는 “덕템” 이라 함)는 개인정보보호법, 정보통신망 이용 촉진 및 정보보호에 관한 법률, 통신비밀보호법 정보통신서비스제공자가 준수하여야 할 관련 법령상의 규정을 준수하며, 관련 법령에 의거한 개인정보처리방침을 정하여 이용자의 권익 보호에 최선을 다하고 있습니다. 본 개인정보처리방침은 회사가 제공하는 서비스 이용에 적용되고 다음과 같은 내용을 담고 있습니다.

**개인정보 수집 및 이용 현황**

덕템은 원활한 서비스 제공을 위해 다음과 같은 이용자의 개인정보를 처리하고 있습니다.

- 수집 및 이용 현황`}</Text>
            <View
              style={{width: Dimensions.get('window').width - 32, height: 300}}>
              <FastImage
                style={tailwind('w-full h-full')}
                resizeMode="stretch"
                source={require('../assets/image/privacy-1.png')}
              />
            </View>
            <View
              style={{width: Dimensions.get('window').width - 32, height: 300}}>
              <FastImage
                style={tailwind('w-full h-full')}
                resizeMode="stretch"
                source={require('../assets/image/privacy-2.png')}
              />
            </View>
            <Text
              style={tailwind(
                'text-[16px] mb-2 mt-12',
              )}>{`덕템에서 수집 및 이용되는 개인정보는 다음의 경로로 수집됩니다.

- 개인정보 수집 방법
    - 회원가입 및 서비스 이용 과정에서 이용자가 개인정보 수집에 대해 동의하고 직접 정보를 입력하는 경우
    - 제휴 서비스 및 단체로부터 개인정보를 제공받은 경우
    - 고객센터를 통한 상담 과정에서 앱, 메일, 전화, 팩스 등을 통해 개인정보를 수집하는 경우
    - 서비스 이용과정에서 이용자로부터 수집하는 경우

덕템은 원칙적으로 정해진 보유 및 이용 기간에 따라 개인정보를 처리하고 있습니다. 그러나 다음의 정보에 대해서는 보존 사유에 의해 명시한 기간 동안 보존할 예정입니다.

- 회사 내부 방침에 의한 사유`}</Text>
            <View
              style={{width: Dimensions.get('window').width - 32, height: 200}}>
              <FastImage
                style={tailwind('w-full h-full')}
                resizeMode="stretch"
                source={require('../assets/image/privacy-3.png')}
              />
            </View>
            <Text
              style={tailwind(
                'text-[16px] mb-2 mt-4',
              )}>{`- 관련 법령에 의한 사유`}</Text>
            <View
              style={{width: Dimensions.get('window').width - 32, height: 200}}>
              <FastImage
                style={tailwind('w-full h-full')}
                resizeMode="stretch"
                source={require('../assets/image/privacy-4.png')}
              />
            </View>
            <Text style={tailwind('text-[16px] mb-2 mt-12')}>{`**제휴서비스**

덕템은 제휴서비스 제공의 목적으로 제휴사를 통해 개인정보를 추가 수집하는 경우 이용자의 동의를 얻어 이를 수집합니다.

**개인정보 처리업무의 위탁에 관한 사항**

서비스를 원활하게 제공해 드리기 위해 필요한 때에 개인정보 처리의 일부를 위탁하고 있습니다. 덕템의 개인정보 처리 업무를 수탁 받은 업체가 이용자의 개인정보처리에 대해 관련 법령을 준수하도록 관리 감독을 하고 있습니다. 수탁 업체의 현황은 아래에서 확인하실 수 있습니다.

**개인정보의 국외 이전에 관한 사항**

덕템은 데이터 분석과 데이터 분산 저장을 위하여 이용자의 개인정보를 해외 서비스에 위탁하고 있습니다.

■ 수집하는 개인정보 항목

회사는 회원 가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.

1. 앱 또는 웹 회원가입 및 관리 (필수) 휴대폰 번호, 쿠키(자동수집)
2. 서비스의 제공 및 신규서비스 개발 (필수) 나이, 방문일시, IP주소, 쿠키 등 서비스이용기록 및 기기정보
3. 고충처리 (필수) 주문자 연락처,주문자이름, 입금자이름, 주문번호
4. 이용자가 상품을 구매한 경우 (필수) 성명, 휴대전화번호, 주소, 상품구매정보(카드 결제 정보, 계좌 정보(무통장 입금시)), 수취인정보(성명, 전화번호, 휴대전화번호, 수취인 주소)
5. 본인 인증시 (필수) 이름, 생년월일, 성별, CI, DI, 휴대폰 번호(휴대폰 인증 시)
6. 계좌 간편결제서비스 이용시 (필수) 은행명, 계좌번호, 간편 결제 비밀번호
7. 카카오 싱크를 통한 가입시 (필수) 이메일, 휴대폰 번호, 프로필 정보(닉네임/프로필 사진) (선택) 성별, 출생연도, 생일, 배송지 정보
8. 체형정보 이용시 (선택) 키, 몸무게, 상의/하의 사이즈, 신발 사이즈
9. 환불 접수 시 계약(환불)의 이행 (필수) 계좌주, 은행, 계좌번호
10. sms, 앱 푸시 등을 통한 광고성 정보 전송 (선택) 휴대폰 번호

■ 개인정보의 수집 및 이용목적

회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.

- 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산 콘텐츠 제공, 구매 및 요금 결제, 물품배송 또는 청구지 등 발송
- 회원 관리
- 회원제 서비스 이용에 따른 본인확인, 개인 식별, 연령확인, 만 14세 미만 아동 개인정보 수집 시 법정 대리인 동의여부 확인, 고지사항 전달
- 마케팅 및 광고에 활용
- 배송 및 반
- 물품 배송 및 반품에 활용
- 접속 빈도 파악 또는 회원의 서비스 이용에 대한 통계

■ 개인정보의 보유 및 이용기간

① 회사는 법령에 따른 개인정보 보유·이용기간 또는 이용자로부터 개인정보 수집시 동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다. 회사는 이용자가 입력한 정보 중 당사의 서비스 제공 과정에서 부정확한 것으로 확인된 정보(연락처, 배송지)에 관하여, 제3자의 권리와 이익의 침해를 방지하고 정보의 최신성 유지를 위하여 해당 정보를 즉시 파기할 수 있습니다.

1. 회원가입 및 관리 : 회원탈퇴시까지. 다만, 다음 사유에 해당하는 경우에는 해당 사유 종료시까지

가. 관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료시까지

나. 서비스 이용에 따른 채권·채무관계가 잔존하는 경우 정산시까지

다. 정산할 리워드 금액이 남아 있는 경우, 탈퇴 신청일 기준 익월 1일에 미지급 금액 일괄 정산 후 파기

1. 관련 법령에 따라 보유하는 경우

[관련 법령](https://www.notion.so/f998f8a714394e148a0a76b6b31fd021)

③ 회사는 개인정보보호법 제21조, 제39조의6에 따라 장기간(1년 이상) 서비스 미이용자의 개인정보 보호를 위하여 다른 이용자의 개인정보와 분리하여 별도로 보관합니다.

■ 개인정보의 파기절차 및 방법

회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다. 파기절차 및 방법은 다음과 같습니다.

- 파기절차

회원님이 회원 가입 등을 위해 입력하신 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기되어집니다.

별도 DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 보유되어지는 이외의 다른 목적으로 이용되지 않습니다.

- 파기방법
- 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.

■ 개인정보 제3자 제공

회사는 이용자의 개인정보를 명시한 범위 내에서만 처리하며, 이용자의 동의 또는 특별한 규정이 있는 경우 제3자에게 개인정보를 제공합니다.

- 이용자들이 구매한 상품의 배송 및 환불을 위한 경우
- 이용자들이 사전에 동의한 경우
- 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

[개인정보 제3자 제공](https://www.notion.so/5af03997d7cf45e2b035cf7f4e38dd4a)

■ 수집한 개인정보의 위탁

주식회사 마더랩스는 서비스 제공을 위하여 일부를 다음과 같이 외부 업체에 위탁하고 있습니다.

[개인정보 외부 위탁 업체](https://www.notion.so/b2df6c595c194b6fa9827c15a9ff9f2e)

[개인정보 국외 이전에 관한 사항](https://www.notion.so/0b3218532c1f44be92d2a86075345eed)

■ 이용자 및 법정대리인의 권리와 그 행사방법

이용자 및 법정 대리인은 언제든지 등록되어 있는 자신 혹은 당해 만 14세 미만 아동의 개인정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수도 있습니 다.

이용자 혹은 만 14세 미만 아동의 개인정보 조회, 수정을 위해서는 ‘개인정보변경’(또는 ‘회원 정보수정’ 등)을 가입해지(동의철회)를 위해서는 “회원탈퇴”를 클릭 하여 본인 확인 절차를 거치신 후 직접 열람, 정정 또는 탈퇴가 가능합니다. 혹은 개인정보관리책임자에게 서면, 전화 또는 이메일로 연락하시면 지체없이 조치하겠습니다.

귀하가 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까 지 당해 개인정보를 이용 또는 제공하지 않습니다. 또한 잘못된 개인정보를 제3자 에게 이미 제공한 경우에는 정정 처리결과를 제3자에게 지체없이 통지하여 정정이 이루어지도록 하겠습니다.

회사는 이용자 혹은 법정 대리인의 요청에 의해 해지 또는 삭제된 개인정보는 “회사가 수집하는 개인정보의 보유 및 이용기간”에 명시된 바에 따라 처리하고 그 외의 용도로 열람 또는 이용할 수 없도록 처리하고 있습니다.

■ 개인정보 자동수집 장치의 설치, 운영 및 그 거부에 관한 사항

회사는 귀하의 정보를 수시로 저장하고 찾아내는 ‘쿠키(cookie)’ 등을 운용합니다. 쿠키란 엄마는패피의 웹사이트를 운영하는데 이용되는 서버가 귀하의 브라우저에 보내는 아주 작은 텍스트 파일로서 귀하의 컴퓨터 하드디스크에 저장됩니다. 회사는 다음과 같은 목적을 위해 쿠키를 사용합니다.

▶ 쿠키 등 사용 목적

- 회원과 비회원의 접속 빈도나 방문 시간 등을 분석, 이용자의 취향과 관심분야를 파악 및 자취 추적, 각종 이벤트 참여 정도 및 방문 회수 파악 등을 통한 타겟 마케팅 및 개인 맞춤 서비스 제공

귀하는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서, 귀하는 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.

▶ 쿠키 설정 거부 방법

예: 쿠키 설정을 거부하는 방법으로는 회원님이 사용하시는 웹 브라우저의 옵션을 선택함으로써 모든 쿠키를 허용하거나 쿠키를 저장할 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다.

설정방법 예(인터넷 익스플로어의 경우)

: 웹 브라우저 상단의 도구 > 인터넷 옵션 > 개인정보

단, 귀하께서 쿠키 설치를 거부했을 경우 서비스 제공에 어려움이 있을 수 있습니다.

■ 개인정보에 관한 민원서비스

회사는 고객의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 관련 부서 및 개인정보관리책임자를 지정하고 있습니다.

- 이름 : 채보건

- 연락처 : tech@motherlabs.kr

귀하께서는 회사의 서비스를 이용하며 발생하는 모든 개인정보보호 관련 민원을 개인정보관리책임자 혹은 담당부서로 신고하실 수 있습니다. 회사는 이용자들의 신고사항에 대해 신속하게 충분한 답변을 드릴 것입니다.

기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.

1. 대검찰청 사이버수사과 ([cybercid.spo.go.kr](http://cybercid.spo.go.kr/))
2. 경찰청 사이버테러대응센터 ([www.ctrc.go.kr/02-392-0330](http://www.ctrc.go.kr/02-392-0330))`}</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}