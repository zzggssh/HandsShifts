import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function ShiftsListScreen() {
  return (
    <View style={styles.container}>
      <Text>Список смен</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

