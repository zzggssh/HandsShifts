import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useStores} from '../stores/RootStore';
import {toDateKeyRu} from '../utils/format';

function getNextDays(count: number) {
  const today = new Date();
  const arr: {key: string; label: string}[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const label = `${dd}.${mm}.${yyyy}`;
    arr.push({key: `${yyyy}-${mm}-${dd}`, label});
  }
  return arr;
}

export default observer(function DateChips() {
  const {shiftStore} = useStores();
  const days = useMemo(() => getNextDays(30), []);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {days.map(d => {
        const active = shiftStore.selectedDates.includes(d.key);
        return (
          <TouchableOpacity key={d.key} onPress={() => shiftStore.toggleDate(d.key)} style={[styles.chip, active && styles.chipActive]}>
            <Text style={[styles.text, active && styles.textActive]}>{d.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  row: {paddingHorizontal: 8, paddingBottom: 8},
  chip: {paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#F3F4F6', marginRight: 8},
  chipActive: {backgroundColor: '#2563EB'},
  text: {color: '#111827'},
  textActive: {color: '#FFFFFF', fontWeight: '600'},
});

