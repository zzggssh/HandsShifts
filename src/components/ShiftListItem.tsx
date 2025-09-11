import React, {memo, useContext, useMemo} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {Shift} from '../types/shift';
import {badgeForDate, formatPriceRub} from '../utils/format';
import {useStores} from '../stores/RootStore';
import {ThemeContext} from '../app/ThemeProvider';

type Props = {
  item: Shift;
};

function ShiftListItem({item}: Props) {
  const {shiftStore} = useStores();
  const theme = useContext(ThemeContext);
  const colors = theme?.colors;
  const badge = useMemo(() => badgeForDate(item.dateStartByCity, item.timeStartByCity, item.timeEndByCity), [item]);
  return (
    <View style={[styles.container, {backgroundColor: colors?.card}]}>
      <Image source={item.logo ? {uri: item.logo} : undefined} style={[styles.logo, {backgroundColor: colors?.divider}]} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={[styles.title, {color: colors?.text}]} numberOfLines={1}>{item.companyName}</Text>
          {!!badge && <Text style={[styles.badge, {color: colors?.text, backgroundColor: colors?.divider}]}>{badge}</Text>}
          <Text style={[styles.price, {color: colors?.accent}]}>{formatPriceRub(item.priceWorker)}</Text>
        </View>
        <Text style={[styles.subtitle, {color: colors?.secondaryText}]} numberOfLines={2}>{item.address}</Text>
        <View style={styles.row}>
          <Text style={[styles.meta, {color: colors?.secondaryText}]}>{item.dateStartByCity} • {item.timeStartByCity}–{item.timeEndByCity}</Text>
          <TouchableOpacity onPress={() => shiftStore.toggleFavorite(item.id)}>
            <Text style={styles.fav}>{shiftStore.favorites.has(item.id) ? '★' : '☆'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12},
  logo: {width: 44, height: 44, borderRadius: 8},
  content: {flex: 1, marginLeft: 12},
  row: {flexDirection: 'row', alignItems: 'center'},
  title: {flex: 1, fontSize: 16, fontWeight: '600'},
  badge: {marginLeft: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, overflow: 'hidden', fontSize: 12},
  price: {marginLeft: 8, fontWeight: '600'},
  subtitle: {marginTop: 2},
  meta: {marginTop: 6},
  fav: {marginLeft: 8, fontSize: 18, color: '#F59E0B'},
});

export default memo(ShiftListItem);

