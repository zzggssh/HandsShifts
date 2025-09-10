import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function ShiftDetailsScreen() {
  return (
    <View style={styles.container}>
      <Text>Детали смены</Text>
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

