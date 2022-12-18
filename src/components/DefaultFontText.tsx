import {StyleSheet, Text, TextProps} from 'react-native';
import React from 'react';

export function DefaultFontText(props: TextProps) {
  return (
    <Text style={[styles.defaultFontText, props.style]}>{props.children}</Text>
  );
}

const styles = StyleSheet.create({
  defaultFontText: {
    fontFamily: 'Pretendard Variable',
  },
});
