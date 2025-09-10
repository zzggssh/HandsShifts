import React, {memo, useMemo} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import type {Shift} from '../types/shift';
import {badgeForDate, formatPriceRub} from '../utils/format';

type Props = {
  item: Shift;
};

function ShiftListItem({item}: Props) {
  const badge = useMemo(() => badgeForDate(item.dateStartByCity, item.timeStartByCity, item.timeEndByCity), [item]);
  return (
    <View style={styles.container}>
      <Image source={item.logo ? {uri: item.logo} : undefined} style={styles.logo} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={1}>{item.companyName}</Text>
          {!!badge && <Text style={styles.badge}>{badge}</Text>}
          <Text style={styles.price}>{formatPriceRub(item.priceWorker)}</Text>
        </View>
        <Text style={styles.subtitle} numberOfLines={2}>{item.address}</Text>
        <View style={styles.row}>
          <Text style={styles.meta}>{item.dateStartByCity} • {item.timeStartByCity}–{item.timeEndByCity}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12},
  logo: {width: 44, height: 44, borderRadius: 8, backgroundColor: '#E5E7EB'},
  content: {flex: 1, marginLeft: 12},
  row: {flexDirection: 'row', alignItems: 'center'},
  title: {flex: 1, fontSize: 16, fontWeight: '600'},
  badge: {marginLeft: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: '#F3F4F6', overflow: 'hidden', fontSize: 12},
  price: {marginLeft: 8, fontWeight: '600', color: '#2563EB'},
  subtitle: {marginTop: 2, color: '#6B7280'},
  meta: {marginTop: 6, color: '#6B7280'},
});

export default memo(ShiftListItem);

