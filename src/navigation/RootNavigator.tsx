import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from '../utils';
import {Cart, ProductList} from '../screen';

export const RootNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={ROUTES.PRODUCT_LIST}>
      <Stack.Screen name={ROUTES.PRODUCT_LIST} component={ProductList} />
      <Stack.Screen name={ROUTES.CART} component={Cart} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});
