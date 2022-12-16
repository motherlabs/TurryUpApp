import {View, Text, Pressable} from 'react-native';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {useTailwind} from 'tailwind-rn/dist';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatTime} from '../utils/dateFormat';

interface Props {
  dayOff?: string[];
  setDayOff?: Dispatch<SetStateAction<string[]>>;
  monStart: string;
  monEnd: string;
  setMonStart: Dispatch<SetStateAction<string>>;
  setMonEnd: Dispatch<SetStateAction<string>>;
  tueStart: string;
  tueEnd: string;
  setTueStart: Dispatch<SetStateAction<string>>;
  setTueEnd: Dispatch<SetStateAction<string>>;
  wedStart: string;
  wedEnd: string;
  setWedStart: Dispatch<SetStateAction<string>>;
  setWedEnd: Dispatch<SetStateAction<string>>;
  thuStart: string;
  thuEnd: string;
  setThuStart: Dispatch<SetStateAction<string>>;
  setThuEnd: Dispatch<SetStateAction<string>>;
  friStart: string;
  friEnd: string;
  setFriStart: Dispatch<SetStateAction<string>>;
  setFriEnd: Dispatch<SetStateAction<string>>;
  satStart: string;
  satEnd: string;
  setSatStart: Dispatch<SetStateAction<string>>;
  setSatEnd: Dispatch<SetStateAction<string>>;
  sunStart: string;
  sunEnd: string;
  setSunStart: Dispatch<SetStateAction<string>>;
  setSunEnd: Dispatch<SetStateAction<string>>;
}

export default function BusinessHours({
  dayOff = [],
  setDayOff = () => '',
  monStart,
  monEnd,
  setMonStart,
  setMonEnd,
  tueStart,
  tueEnd,
  setTueStart,
  setTueEnd,
  wedStart,
  wedEnd,
  setWedStart,
  setWedEnd,
  thuStart,
  thuEnd,
  setThuStart,
  setThuEnd,
  friStart,
  friEnd,
  setFriStart,
  setFriEnd,
  satStart,
  satEnd,
  setSatStart,
  setSatEnd,
  sunStart,
  sunEnd,
  setSunStart,
  setSunEnd,
}: Props) {
  const tailwind = useTailwind();
  const [isMonStart, setIsMonStart] = useState(false);
  const [isMonEnd, setIsMonEnd] = useState(false);
  const [isTueStart, setIsTueStart] = useState(false);
  const [isTueEnd, setIsTueEnd] = useState(false);
  const [isWedStart, setIsWedStart] = useState(false);
  const [isWedEnd, setIsWedEnd] = useState(false);
  const [isThuStart, setIsThuStart] = useState(false);
  const [isThuEnd, setIsThuEnd] = useState(false);
  const [isFriStart, setIsFriStart] = useState(false);
  const [isFriEnd, setIsFriEnd] = useState(false);
  const [isSatStart, setIsSatStart] = useState(false);
  const [isSatEnd, setIsSatEnd] = useState(false);
  const [isSunStart, setIsSunStart] = useState(false);
  const [isSunEnd, setIsSunEnd] = useState(false);

  return (
    <View style={tailwind('pt-3 pb-10')}>
      <View style={tailwind('h-[30px] flex flex-col  justify-center')}>
        <Text style={tailwind('text-[20px] leading-[23px]')}>영업시간</Text>
      </View>
      <View
        style={tailwind('flex flex-row justify-between items-center h-[30px]')}>
        <Text
          style={tailwind(
            'text-[#909090] text-[18px] leading-[21px] font-[500]',
          )}>
          월
        </Text>

        <View style={tailwind('flex flex-row items-center')}>
          <Pressable
            onPress={() => {
              if (dayOff.some(item => item.includes('1'))) {
                const filtered = dayOff.filter(item => item !== '1');
                setDayOff(filtered);
              } else {
              }
            }}
            style={tailwind(
              `${
                dayOff.some(item => item.includes('1'))
                  ? 'bg-gray-300'
                  : 'bg-primary_og'
              } h-[20px] flex flex-col items-center justify-center px-2 rounded-lg`,
            )}>
            <Text style={tailwind('text-white text-[17px] leading-[20px]')}>
              영업가능
            </Text>
          </Pressable>
          <View style={tailwind('w-[8px]')} />
          <Pressable
            onPress={() => {
              if (dayOff.some(item => item.includes('1'))) {
              } else {
                setDayOff(prev => [...prev, '1']);
              }
            }}
            style={tailwind(
              `${
                dayOff.some(item => item.includes('1'))
                  ? 'bg-primary_og'
                  : 'bg-gray-300'
              } h-[20px] flex flex-col items-center justify-center px-2 rounded-lg`,
            )}>
            <Text style={tailwind('text-white text-[17px] leading-[20px]')}>
              영업불가
            </Text>
          </Pressable>
        </View>
        <View style={tailwind('flex flex-col items-end w-[120px]')}>
          {!dayOff.some(item => item.includes('1')) && (
            <View style={tailwind('flex flex-row items-center')}>
              <Pressable
                onPress={() => {
                  setIsMonStart(true);
                }}>
                <Text style={tailwind('text-[17px] leading-[20px]')}>{`${
                  monStart.length > 0 ? monStart : '00:00'
                }-`}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsMonEnd(true);
                }}>
                <Text style={tailwind('text-[17px] leading-[20px]')}>{`${
                  monEnd.length > 0 ? monEnd : '00:00'
                }`}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <View
        style={tailwind('flex flex-row justify-between items-center h-[30px]')}>
        <Text
          style={tailwind(
            'text-[#909090] text-[18px] leading-[21px] font-[500]',
          )}>
          화
        </Text>

        <View style={tailwind('flex flex-row items-center')}>
          <Pressable
            onPress={() => {
              if (dayOff.some(item => item.includes('2'))) {
                const filtered = dayOff.filter(item => item !== '2');
                setDayOff(filtered);
              } else {
              }
            }}
            style={tailwind(
              `${
                dayOff.some(item => item.includes('2'))
                  ? 'bg-gray-300'
                  : 'bg-primary_og'
              } h-[20px] flex flex-col items-center justify-center px-2 rounded-lg`,
            )}>
            <Text style={tailwind('text-white text-[17px] leading-[20px]')}>
              영업가능
            </Text>
          </Pressable>
          <View style={tailwind('w-[8px]')} />
          <Pressable
            onPress={() => {
              if (dayOff.some(item => item.includes('2'))) {
              } else {
                setDayOff(prev => [...prev, '2']);
              }
            }}
            style={tailwind(
              `${
                dayOff.some(item => item.includes('2'))
                  ? 'bg-primary_og'
                  : 'bg-gray-300'
              } h-[20px] flex flex-col items-center justify-center px-2 rounded-lg`,
            )}>
            <Text style={tailwind('text-white text-[17px] leading-[20px]')}>
              영업불가
            </Text>
          </Pressable>
        </View>
        <View style={tailwind('flex flex-col items-end  w-[120px] ')}>
          {!dayOff.some(item => item.includes('2')) && (
            <View style={tailwind('flex flex-row items-center')}>
              <Pressable
                onPress={() => {
                  setIsTueStart(true);
                }}>
                <Text style={tailwind('text-[17px] leading-[20px]')}>{`${
                  tueStart.length > 0 ? tueStart : '00:00'
                }-`}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsTueEnd(true);
                }}>
                <Text style={tailwind('text-[17px] leading-[20px]')}>{`${
                  tueEnd.length > 0 ? tueEnd : '00:00'
                }`}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <View
        style={tailwind('flex flex-row justify-between items-center h-[30px]')}>
        <Text
          style={tailwind(
            'text-[#909090] text-[18px] leading-[21px] font-[500]',
          )}>
          수
        </Text>

        <View style={tailwind('flex flex-row items-center')}>
          <Pressable
            onPress={() => {
              if (dayOff.some(item => item.includes('3'))) {
                const filtered = dayOff.filter(item => item !== '3');
                setDayOff(filtered);
              } else {
              }
            }}
            style={tailwind(
              `${
                dayOff.some(item => item.includes('3'))
                  ? 'bg-gray-300'
                  : 'bg-primary_og'
              } h-[20px] flex flex-col items-center justify-center px-2 rounded-lg`,
            )}>
            <Text style={tailwind('text-white text-[17px] leading-[20px]')}>
              영업가능
            </Text>
          </Pressable>
          <View style={tailwind('w-[8px]')} />
          <Pressable
            onPress={() => {
              if (dayOff.some(item => item.includes('3'))) {
              } else {
                setDayOff(prev => [...prev, '3']);
              }
            }}
            style={tailwind(
              `${
                dayOff.some(item => item.includes('3'))
                  ? 'bg-primary_og'
                  : 'bg-gray-300'
              } h-[20px] flex flex-col items-center justify-center px-2 rounded-lg`,
            )}>
            <Text style={tailwind('text-white text-[17px] leading-[20px]')}>
              영업불가
            </Text>
          </Pressable>
        </View>
        <View style={tailwind('flex flex-col items-end  w-[120px] ')}>
          {!dayOff.some(item => item.includes('3')) && (
            <View style={tailwind('flex flex-row items-center')}>
              <Pressable
                onPress={() => {
                  setIsWedStart(true);
                }}>
                <Text style={tailwind('text-[17px] leading-[20px]')}>{`${
                  wedStart.length > 0 ? wedStart : '00:00'
                }-`}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsWedEnd(true);
                }}>
                <Text style={tailwind('text-[17px] leading-[20px]')}>{`${
                  wedEnd.length > 0 ? wedEnd : '00:00'
                }`}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <View
        style={tailwind('flex flex-row justify-between items-center h-[30px]')}>
        <Text
          style={tailwind(
            'text-[#909090] text-[18px] leading-[21px] font-[500]',
          )}>
          목
        </Text>

        <View style={tailwind('flex flex-row items-center')}>
          <Pressable
            onPress={() => {
              if (dayOff.some(item => item.includes('4'))) {
                const filtered = dayOff.filter(item => item !== '4');
                setDayOff(filtered);
              } else {
              }
            }}
            style={tailwind(
              `${
                dayOff.some(item => item.includes('4'))
                  ? 'bg-gray-300'
                  : 'bg-primary_og'
              } h-[20px] flex flex-col items-center justify-center px-2 rounded-lg`,
            )}>
            <Text style={tailwind('text-white text-[17px] leading-[20px]')}>
              영업가능
            </Text>
          </Pressable>
          <View style={tailwind('w-[8px]')} />
          <Pressable
            onPress={() => {
              if (dayOff.some(item => item.includes('4'))) {
              } else {
                setDayOff(prev => [...prev, '4']);
              }
            }}
            style={tailwind(
              `${
                dayOff.some(item => item.includes('4'))
                  ? 'bg-primary_og'
                  : 'bg-gray-300'
              } h-[20px] flex flex-col items-center justify-center px-2 rounded-lg`,
            )}>
            <Text style={tailwind('text-white text-[17px] leading-[20px]')}>
              영업불가
            </Text>
          </Pressable>
        </View>
        <View style={tailwind('flex flex-col items-end  w-[120px] ')}>
          {!dayOff.some(item => item.includes('4')) && (
            <View style={tailwind('flex flex-row items-center')}>
              <Pressable
                onPress={() => {
                  setIsThuStart(true);
                }}>
                <Text style={tailwind('text-[17px] leading-[20px]')}>{`${
                  thuStart.length > 0 ? thuStart : '00:00'
                }-`}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsThuEnd(true);
                }}>
                <Text style={tailwind('text-[17px] leading-[20px]')}>{`${
                  thuEnd.length > 0 ? thuEnd : '00:00'
                }`}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
      <View
        style={tailwind('flex flex-row justify-between items-center h-[30px]')}>
        <Text
          style={tailwind(
            'text-[#909090] text-[18px] leading-[21px] font-[500]',
          )}>
          금
        </Text>

        <View style={tailwind('flex flex-row items-center')}>
          <Pressable
            onPress={() => {
              if (dayOff.some(item => item.includes('5'))) {
                const filtered = dayOff.filter(item => item !== '5');
                setDayOff(filtered);
              } else {
              }
            }}
            style={tailwind(
              `${
                dayOff.some(item => item.includes('5'))
                  ? 'bg-gray-300'
                  : 'bg-primary_og'
              } h-[20px] flex flex-col items-center justify-center px-2 rounded-lg`,
            )}>
            <Text style={tailwind('text-white text-[17px] leading-[20px]')}>
              영업가능
            </Text>
          </Pressable>
          <View style={tailwind('w-[8px]')} />
          <Pressable
            onPress={() => {
              if (dayOff.some(item => item.includes('5'))) {
              } else {
                setDayOff(prev => [...prev, '5']);
              }
            }}
            style={tailwind(
              `${
                dayOff.some(item => item.includes('5'))
                  ? 'bg-primary_og'
                  : 'bg-gray-300'
              } h-[20px] flex flex-col items-center justify-center px-2 rounded-lg`,
            )}>
            <Text style={tailwind('text-white text-[17px] leading-[20px]')}>
              영업불가
            </Text>
          </Pressable>
        </View>
        <View style={tailwind('flex flex-col items-end  w-[120px] ')}>
          {!dayOff.some(item => item.includes('5')) && (
            <View style={tailwind('flex flex-row items-center')}>
              <Pressable
                onPress={() => {
                  setIsFriStart(true);
                }}>
                <Text style={tailwind('text-[17px] leading-[20px]')}>{`${
                  friStart.length > 0 ? friStart : '00:00'
                }-`}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsFriEnd(true);
                }}>
                <Text style={tailwind('text-[17px] leading-[20px]')}>{`${
                  friEnd.length > 0 ? friEnd : '00:00'
                }`}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <View
        style={tailwind('flex flex-row justify-between items-center h-[30px]')}>
        <Text
          style={tailwind(
            'text-[#909090] text-[18px] leading-[21px] font-[500]',
          )}>
          토
        </Text>

        <View style={tailwind('flex flex-row items-center')}>
          <Pressable
            onPress={() => {
              if (dayOff.some(item => item.includes('6'))) {
                const filtered = dayOff.filter(item => item !== '6');
                setDayOff(filtered);
              } else {
              }
            }}
            style={tailwind(
              `${
                dayOff.some(item => item.includes('6'))
                  ? 'bg-gray-300'
                  : 'bg-primary_og'
              } h-[20px] flex flex-col items-center justify-center px-2 rounded-lg`,
            )}>
            <Text style={tailwind('text-white text-[17px] leading-[20px]')}>
              영업가능
            </Text>
          </Pressable>
          <View style={tailwind('w-[8px]')} />
          <Pressable
            onPress={() => {
              if (dayOff.some(item => item.includes('6'))) {
              } else {
                setDayOff(prev => [...prev, '6']);
              }
            }}
            style={tailwind(
              `${
                dayOff.some(item => item.includes('6'))
                  ? 'bg-primary_og'
                  : 'bg-gray-300'
              } h-[20px] flex flex-col items-center justify-center px-2 rounded-lg`,
            )}>
            <Text style={tailwind('text-white text-[17px] leading-[20px]')}>
              영업불가
            </Text>
          </Pressable>
        </View>
        <View style={tailwind('flex flex-col items-end  w-[120px] ')}>
          {!dayOff.some(item => item.includes('6')) && (
            <View style={tailwind('flex flex-row items-center')}>
              <Pressable
                onPress={() => {
                  setIsSatStart(true);
                }}>
                <Text style={tailwind('text-[17px] leading-[20px]')}>{`${
                  satStart.length > 0 ? satStart : '00:00'
                }-`}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsSatEnd(true);
                }}>
                <Text style={tailwind('text-[17px] leading-[20px]')}>{`${
                  satEnd.length > 0 ? satEnd : '00:00'
                }`}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <View
        style={tailwind('flex flex-row justify-between items-center h-[30px]')}>
        <Text
          style={tailwind(
            'text-[#909090] text-[18px] leading-[21px] font-[500]',
          )}>
          일
        </Text>

        <View style={tailwind('flex flex-row items-center')}>
          <Pressable
            onPress={() => {
              if (dayOff.some(item => item.includes('0'))) {
                const filtered = dayOff.filter(item => item !== '0');
                setDayOff(filtered);
              } else {
              }
            }}
            style={tailwind(
              `${
                dayOff.some(item => item.includes('0'))
                  ? 'bg-gray-300'
                  : 'bg-primary_og'
              } h-[20px] flex flex-col items-center justify-center px-2 rounded-lg`,
            )}>
            <Text style={tailwind('text-white text-[17px] leading-[20px]')}>
              영업가능
            </Text>
          </Pressable>
          <View style={tailwind('w-[8px]')} />
          <Pressable
            onPress={() => {
              if (dayOff.some(item => item.includes('0'))) {
              } else {
                setDayOff(prev => [...prev, '0']);
              }
            }}
            style={tailwind(
              `${
                dayOff.some(item => item.includes('0'))
                  ? 'bg-primary_og'
                  : 'bg-gray-300'
              } h-[20px] flex flex-col items-center justify-center px-2 rounded-lg`,
            )}>
            <Text style={tailwind('text-white text-[17px] leading-[20px]')}>
              영업불가
            </Text>
          </Pressable>
        </View>
        <View style={tailwind('flex flex-col items-end  w-[120px] ')}>
          {!dayOff.some(item => item.includes('0')) && (
            <View style={tailwind('flex flex-row items-center')}>
              <Pressable
                onPress={() => {
                  setIsSunStart(true);
                }}>
                <Text style={tailwind('text-[17px] leading-[20px]')}>{`${
                  sunStart.length > 0 ? sunStart : '00:00'
                }-`}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsSunEnd(true);
                }}>
                <Text style={tailwind('text-[17px] leading-[20px]')}>{`${
                  sunEnd.length > 0 ? sunEnd : '00:00'
                }`}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isMonStart}
        mode="time"
        onConfirm={text => {
          setMonStart(formatTime(text));
          setIsMonStart(false);
        }}
        onCancel={() => {
          setIsMonStart(false);
        }}
      />
      <DateTimePickerModal
        isVisible={isMonEnd}
        mode="time"
        onConfirm={text => {
          setMonEnd(formatTime(text));
          setIsMonEnd(false);
        }}
        onCancel={() => {
          setIsMonEnd(false);
        }}
      />
      <DateTimePickerModal
        isVisible={isTueStart}
        mode="time"
        onConfirm={text => {
          setTueStart(formatTime(text));
          setIsTueStart(false);
        }}
        onCancel={() => {
          setIsTueStart(false);
        }}
      />
      <DateTimePickerModal
        isVisible={isTueEnd}
        mode="time"
        onConfirm={text => {
          setTueEnd(formatTime(text));
          setIsTueEnd(false);
        }}
        onCancel={() => {
          setIsTueEnd(false);
        }}
      />
      <DateTimePickerModal
        isVisible={isWedStart}
        mode="time"
        onConfirm={text => {
          setWedStart(formatTime(text));
          setIsWedStart(false);
        }}
        onCancel={() => {
          setIsWedStart(false);
        }}
      />
      <DateTimePickerModal
        isVisible={isWedEnd}
        mode="time"
        onConfirm={text => {
          setWedEnd(formatTime(text));
          setIsWedEnd(false);
        }}
        onCancel={() => {
          setIsWedEnd(false);
        }}
      />
      <DateTimePickerModal
        isVisible={isThuStart}
        mode="time"
        onConfirm={text => {
          setThuStart(formatTime(text));
          setIsThuStart(false);
        }}
        onCancel={() => {
          setIsThuStart(false);
        }}
      />
      <DateTimePickerModal
        isVisible={isThuEnd}
        mode="time"
        onConfirm={text => {
          setThuEnd(formatTime(text));
          setIsThuEnd(false);
        }}
        onCancel={() => {
          setIsThuEnd(false);
        }}
      />
      <DateTimePickerModal
        isVisible={isFriStart}
        mode="time"
        onConfirm={text => {
          setFriStart(formatTime(text));
          setIsFriStart(false);
        }}
        onCancel={() => {
          setIsFriStart(false);
        }}
      />
      <DateTimePickerModal
        isVisible={isFriEnd}
        mode="time"
        onConfirm={text => {
          setFriEnd(formatTime(text));
          setIsFriEnd(false);
        }}
        onCancel={() => {
          setIsFriEnd(false);
        }}
      />
      <DateTimePickerModal
        isVisible={isSatStart}
        mode="time"
        onConfirm={text => {
          setSatStart(formatTime(text));
          setIsSatStart(false);
        }}
        onCancel={() => {
          setIsSatStart(false);
        }}
      />
      <DateTimePickerModal
        isVisible={isSatEnd}
        mode="time"
        onConfirm={text => {
          setSatEnd(formatTime(text));
          setIsSatEnd(false);
        }}
        onCancel={() => {
          setIsSatEnd(false);
        }}
      />
      <DateTimePickerModal
        isVisible={isSunStart}
        mode="time"
        onConfirm={text => {
          setSunStart(formatTime(text));
          setIsSunStart(false);
        }}
        onCancel={() => {
          setIsSunStart(false);
        }}
      />
      <DateTimePickerModal
        isVisible={isSunEnd}
        mode="time"
        onConfirm={text => {
          setSunEnd(formatTime(text));
          setIsSunEnd(false);
        }}
        onCancel={() => {
          setIsSunEnd(false);
        }}
      />
    </View>
  );
}
