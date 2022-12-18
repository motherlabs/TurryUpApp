import {useEffect, useState} from 'react';
import {Keyboard, KeyboardEvent} from 'react-native';

export default function useKeyboardEvent() {
  const [isKeyboardActivate, setIsKeyboardActivate] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  useEffect(() => {
    const keyboardWillShow = (e: KeyboardEvent) => {
      setIsKeyboardActivate(true);
      setKeyboardHeight(e.endCoordinates.height);
    };
    const keyboardWillHide = () => {
      setIsKeyboardActivate(false);
      setKeyboardHeight(0);
    };

    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      keyboardWillShow,
    );
    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      keyboardWillHide,
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return {isKeyboardActivate, keyboardHeight};
}
