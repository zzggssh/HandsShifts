import React from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import type {RootStackParamList} from '../app/Navigation';
import {useStores} from '../stores/RootStore';
import {formatPriceRub} from '../utils/format';

export default function ShiftDetailsScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'ShiftDetails'>>();
  const {shiftStore} = useStores();
  const shift = shiftStore.shifts.find(s => s.id === route.params.id);
  if (!shift) return <View style={styles.center}><Text>Не найдено</Text></View>;
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Image source={shift.logo ? {uri: shift.logo} : undefined} style={styles.logo} />
      <Text style={styles.title}>{shift.companyName}</Text>
      <Text style={styles.addr}>{shift.address}</Text>
      <Text style={styles.meta}>{shift.dateStartByCity} • {shift.timeStartByCity}–{shift.timeEndByCity}</Text>
      <Text style={styles.price}>{formatPriceRub(shift.priceWorker)}</Text>
      <Text style={styles.meta}>Рейтинг: {shift.customerRating ?? 'Нет рейтинга'}</Text>
      <Text style={styles.meta}>Отзывы: {shift.customerFeedbacksCount}</Text>
      <Text style={styles.meta}>Набор: {shift.currentWorkers} / {shift.planWorkers}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {padding: 16},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  logo: {width: 80, height: 80, borderRadius: 12, backgroundColor: '#E5E7EB', marginBottom: 12},
  title: {fontSize: 20, fontWeight: '700'},
  addr: {marginTop: 6, color: '#6B7280'},
  meta: {marginTop: 8, color: '#6B7280'},
  price: {marginTop: 12, fontSize: 18, fontWeight: '700', color: '#2563EB'},
});

