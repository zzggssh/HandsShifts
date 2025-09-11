import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useStores} from '../stores/RootStore';
import DateChips from './DateChips';

export default observer(function FiltersBar() {
  const {shiftStore} = useStores();

  const toggle = (value: boolean) => (value ? false : true);

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Chip active={shiftStore.isNearestByDate} onPress={() => shiftStore.setNearestByDate(toggle(shiftStore.isNearestByDate))} label="Ближайшие по дате" />
        <Chip active={shiftStore.isNearestByDistance} onPress={() => shiftStore.setNearestByDistance(toggle(shiftStore.isNearestByDistance))} label="Ближайшие по расстоянию" />
        <Chip active={shiftStore.filterDay} onPress={() => shiftStore.setFilterDay(toggle(shiftStore.filterDay))} label="Дневные" />
        <Chip active={shiftStore.filterNight} onPress={() => shiftStore.setFilterNight(toggle(shiftStore.filterNight))} label="Ночные" />
        <Chip active={shiftStore.myMode !== 'off'} onPress={() => shiftStore.setMyMode(shiftStore.myMode === 'off' ? 'future' : shiftStore.myMode === 'future' ? 'past' : 'off')} label="Мои смены" />
        <Chip active={false} onPress={() => shiftStore.clearFilters()} label="Сбросить" />
      </ScrollView>
      <DateChips />
    </View>
  );
});

function Chip({label, active, onPress}: {label: string; active: boolean; onPress: () => void}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {paddingHorizontal: 8, paddingVertical: 8, alignItems: 'center'},
  chip: {paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6', marginRight: 8},
  chipActive: {backgroundColor: '#2563EB'},
  chipText: {color: '#111827'},
  chipTextActive: {color: '#FFFFFF', fontWeight: '600'},
});

