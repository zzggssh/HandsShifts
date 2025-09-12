import React, {useContext} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View, ActionSheetIOS, Platform} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useStores} from '../stores/RootStore';
import DateChips from './DateChips';
import {ThemeContext} from '../app/ThemeProvider';

export default observer(function FiltersBar() {
  const {shiftStore} = useStores();
  const theme = useContext(ThemeContext);
  const colors = theme?.colors;

  const toggle = (value: boolean) => (value ? false : true);

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Chip active={shiftStore.isNearestByDate} onPress={() => shiftStore.setNearestByDate(toggle(shiftStore.isNearestByDate))} label="Ближайшие по дате" colors={colors} />
        <Chip active={shiftStore.isNearestByDistance} onPress={() => shiftStore.setNearestByDistance(toggle(shiftStore.isNearestByDistance))} label="Ближайшие по расстоянию" colors={colors} />
        <Chip active={shiftStore.filterDay} onPress={() => shiftStore.setFilterDay(toggle(shiftStore.filterDay))} label="Дневные" colors={colors} />
        <Chip active={shiftStore.filterNight} onPress={() => shiftStore.setFilterNight(toggle(shiftStore.filterNight))} label="Ночные" colors={colors} />
        <Chip
          active={shiftStore.myMode !== 'off'}
          onPress={() => {
            if (Platform.OS === 'ios') {
              ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: ['Отмена', 'Выключено', 'Будущие', 'Прошедшие'],
                  cancelButtonIndex: 0,
                },
                index => {
                  if (index === 1) shiftStore.setMyMode('off');
                  if (index === 2) shiftStore.setMyMode('future');
                  if (index === 3) shiftStore.setMyMode('past');
                },
              );
            } else {
              shiftStore.setMyMode(shiftStore.myMode === 'off' ? 'future' : shiftStore.myMode === 'future' ? 'past' : 'off');
            }
          }}
          label="Мои смены"
          colors={colors}
        />
        <Chip active={shiftStore.showDates} onPress={() => shiftStore.toggleShowDates()} label="Календарь" colors={colors} />
        <Chip active={false} onPress={() => shiftStore.clearFilters()} label="Сбросить" colors={colors} />
      </ScrollView>
      {shiftStore.showDates ? <DateChips /> : null}
    </View>
  );
});

function Chip({label, active, onPress, colors}: {label: string; active: boolean; onPress: () => void; colors?: any}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, {backgroundColor: active ? colors?.chipActiveBg : colors?.chipBg}]}>
      <Text style={[styles.chipText, {color: active ? colors?.chipActiveText : colors?.chipText}, active && styles.bold]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {paddingHorizontal: 8, paddingVertical: 8, alignItems: 'center'},
  chip: {paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8},
  chipText: {},
  bold: {fontWeight: '600'},
});

