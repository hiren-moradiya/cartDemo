import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {IMAGE} from '../../../assets';

interface HeaderProps {
  BackIconAvailable?: boolean;
  CartIconAvailable?: boolean;
  title?: string;
  onPressBack?: () => void;
  onPressCart?: () => void;
}

export const Header = (props: HeaderProps) => {
  const {
    title,
    BackIconAvailable = true,
    CartIconAvailable,
    onPressBack,
    onPressCart,
  } = props;
  return (
    <View style={styles.container}>
      {BackIconAvailable ? (
        <Pressable style={styles.iconWrapper} onPress={onPressBack}>
          <Image source={IMAGE.back} resizeMode="contain" style={styles.icon} />
        </Pressable>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      {CartIconAvailable ? (
        <Pressable style={styles.iconWrapper} onPress={onPressCart}>
          <Image source={IMAGE.cart} resizeMode="contain" style={styles.icon} />
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#1785f9',
  },
  title: {
    marginLeft: 16,
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  icon: {
    height: 30,
    width: 30,
  },
  iconWrapper: {
    height: 40,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
