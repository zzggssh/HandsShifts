import React, {useContext, useMemo} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useStores} from '../stores/RootStore';
import {toDateKeyRu} from '../utils/format';
import {ThemeContext} from '../app/ThemeProvider';

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
  const theme = useContext(ThemeContext);
  const colors = theme?.colors;
  const days = useMemo(() => getNextDays(30), []);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {days.map(d => {
        const active = shiftStore.selectedDates.includes(d.key);
        return (
          <TouchableOpacity key={d.key} onPress={() => shiftStore.toggleDate(d.key)} style={[styles.chip, {backgroundColor: active ? colors?.chipActiveBg : colors?.chipBg}]}>
            <Text style={[styles.text, {color: active ? colors?.chipActiveText : colors?.chipText}, active && styles.bold]}>{d.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  row: {paddingHorizontal: 8, paddingBottom: 8},
  chip: {paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginRight: 8},
  text: {},
  bold: {fontWeight: '600'},
});

