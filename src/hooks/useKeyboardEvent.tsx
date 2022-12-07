import {useEffect, useState} from 'react';
import {Keyboard, Platform} from 'react-native';

export default function useKeyboardEvent() {
  const [isKeyboardActivate, setIsKeyboardActivate] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  useEffect(() => {
    const keyboardWillShow = (e: Event<KeyboardEvent>) => {
      setIsKeyboardActivate(true);
      if (Platform.OS === 'ios') {
        setKeyboardHeight(e.endCoordinates.height);
      }
    };
    const keyboardWillHide = () => {
      setIsKeyboardActivate(false);
      if (Platform.OS === 'ios') {
        setKeyboardHeight(0);
      }
    };

    if (Platform.OS === 'android') {
      Keyboard.addListener('keyboardDidShow', keyboardWillShow);
      Keyboard.addListener('keyboardDidHide', keyboardWillHide);
    } else if (Platform.OS === 'ios') {
      Keyboard.addListener('keyboardWillShow', keyboardWillShow);
      Keyboard.addListener('keyboardWillHide', keyboardWillHide);
    }

    return () => {
      if (Platform.OS === 'android') {
        Keyboard.addListener('keyboardDidShow', keyboardWillShow).remove();
        Keyboard.addListener('keyboardDidHide', keyboardWillHide).remove();
      } else if (Platform.OS === 'ios') {
        Keyboard.addListener('keyboardWillShow', keyboardWillShow).remove();
        Keyboard.addListener('keyboardWillHide', keyboardWillHide).remove();
      }
    };
  }, []);

  return {isKeyboardActivate, keyboardHeight};
}
