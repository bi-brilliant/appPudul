import {Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';

const CustomButton = ({onPress, text, type = 'PRIMARY', bgColor, fgColor}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        [styles.container, styles[`container_${type}`]],
        bgColor ? {backgroundColor: bgColor} : {},
      ]}>
      <Text
        style={[
          styles.text,
          styles[`text_${type}`],
          fgColor ? {color: fgColor} : {},
        ]}>
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    paddingVertical: 8,
    marginTop: 15,
    alignItems: 'center',
    borderRadius: 35,
  },

  container_PRIMARY: {
    backgroundColor: '#343a59',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },

  container_SECONDARY: {
    backgroundColor: '#ffdc04',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },

  container_TERTIARY: {
    alignItems: 'flex-start',
    padding: 10,
    paddingVertical: 0,
  },

  text_PRIMARY: {
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },

  text: {
    color: '#45494c',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },

  text_SECONDARY: {
    color: '#45494c',
    fontFamily: 'Roboto-Bold',
  },

  text_TERTIARY: {
    fontWeight: 'bold',
    color: '#343a59',
    fontFamily: 'Roboto-Medium',
  },
});

export default CustomButton;
