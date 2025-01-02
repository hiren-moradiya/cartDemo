import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';

export const Loader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={'small'} color={'#1785f9'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});
