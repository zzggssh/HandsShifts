import React, {useContext} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import type {RootStackParamList} from '../app/Navigation';
import {useStores} from '../stores/RootStore';
import {formatPriceRub} from '../utils/format';
import {ThemeContext} from '../app/ThemeProvider';

export default function ShiftDetailsScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'ShiftDetails'>>();
  const {shiftStore} = useStores();
  const theme = useContext(ThemeContext);
  const colors = theme?.colors;
  const shift = shiftStore.shifts.find(s => s.id === route.params.id);
  if (!shift) return <View style={styles.center}><Text style={{color: colors?.text}}>Не найдено</Text></View>;
  return (
    <ScrollView contentContainerStyle={[styles.content, {backgroundColor: colors?.background}]}> 
      <Image source={shift.logo ? {uri: shift.logo} : undefined} style={[styles.logo, {backgroundColor: colors?.divider}]} />
      <Text style={[styles.title, {color: colors?.text}]}>{shift.companyName}</Text>
      <Text style={[styles.addr, {color: colors?.secondaryText}]}>{shift.address}</Text>
      <Text style={[styles.meta, {color: colors?.secondaryText}]}>{shift.dateStartByCity} • {shift.timeStartByCity}–{shift.timeEndByCity}</Text>
      <Text style={[styles.price, {color: colors?.accent}]}>{formatPriceRub(shift.priceWorker)}</Text>
      <Text style={[styles.meta, {color: colors?.secondaryText}]}>Рейтинг: {shift.customerRating ?? 'Нет рейтинга'}</Text>
      <Text style={[styles.meta, {color: colors?.secondaryText}]}>Отзывы: {shift.customerFeedbacksCount}</Text>
      <Text style={[styles.meta, {color: colors?.secondaryText}]}>Набор: {shift.currentWorkers} / {shift.planWorkers}</Text>
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

