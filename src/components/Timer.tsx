import {View, Text} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useTailwind} from 'tailwind-rn/dist';

interface Props {
  setIsTimeOut: React.Dispatch<React.SetStateAction<boolean>>;
  timer: number;
}

export default function Timer({setIsTimeOut, timer}: Props) {
  const [min, setMin] = useState(3);
  const [sec, setSec] = useState(0);
  const time = useRef(timer);
  const timerId = useRef<any>(null);
  const tailwind = useTailwind();

  useEffect(() => {
    timerId.current = setInterval(() => {
      setMin(Math.floor(time.current / 60));
      setSec(time.current % 60);
      time.current -= 1;
    }, 1000);

    return () => clearInterval(timerId.current);
  }, []);

  useEffect(() => {
    if (time.current <= 0) {
      console.log('time out');
      setSec(0);
      setIsTimeOut(true);
      clearInterval(timerId.current);
    }
  }, [sec, setIsTimeOut]);

  return (
    <View>
      <Text style={tailwind('text-[#7B7B7C] text-[14px]')}>{`${min}:${sec
        .toString()
        .padStart(2, '0')}`}</Text>
    </View>
  );
}
