import React, {useContext} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import type {RootStackParamList} from '../app/Navigation';
import {useStores} from '../stores/RootStore';
import {formatPriceRub} from '../utils/format';
import {ThemeContext} from '../app/ThemeProvider';
import {observer} from 'mobx-react-lite';

function ShiftDetailsScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'ShiftDetails'>>();
  const {shiftStore} = useStores();
  const theme = useContext(ThemeContext);
  const colors = theme?.colors;
  const shift = shiftStore.shifts.find(s => s.id === route.params.id);
  if (!shift) return <View style={styles.center}><Text style={{color: colors?.text}}>Не найдено</Text></View>;
  const isFav = shiftStore.favorites.has(shift.id);
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

      <View style={{height: 16}} />
      <TouchableOpacity
        onPress={() => shiftStore.toggleFavorite(shift.id)}
        style={[
          styles.cta,
          {
            backgroundColor: isFav ? colors?.divider : colors?.accent,
            borderColor: isFav ? colors?.divider : colors?.accent,
          },
        ]}
        activeOpacity={0.8}
      >
        <Text style={[styles.ctaText, {color: isFav ? colors?.secondaryText : '#FFFFFF'}]}>
          {isFav ? 'Записан' : 'Записаться'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default observer(ShiftDetailsScreen);

const styles = StyleSheet.create({
  content: {padding: 16},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  logo: {width: 80, height: 80, borderRadius: 12, backgroundColor: '#E5E7EB', marginBottom: 12},
  title: {fontSize: 20, fontWeight: '700'},
  addr: {marginTop: 6, color: '#6B7280'},
  meta: {marginTop: 8, color: '#6B7280'},
  price: {marginTop: 12, fontSize: 18, fontWeight: '700', color: '#2563EB'},
  cta: {marginTop: 16, paddingVertical: 12, borderRadius: 12, alignItems: 'center'},
  ctaText: {fontSize: 16, fontWeight: '600'},
});

