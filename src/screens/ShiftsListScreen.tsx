import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useStores} from '../stores/RootStore';
import {getCurrentCoords, openSettings} from '../services/location';
import {ThemeContext} from '../app/ThemeProvider';
import ShiftListItem from '../components/ShiftListItem';
import FiltersBar from '../components/FiltersBar';
import {getShiftsByCoords} from '../services/api';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../app/Navigation';

function ShiftsListScreen() {
  const {shiftStore} = useStores();
  const [geoError, setGeoError] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useContext(ThemeContext);

  const load = useCallback(async () => {
    try {
      setGeoError(null);
      shiftStore.status = 'loading';
      const {lat, lng} = await getCurrentCoords();
      shiftStore.setCoords(lat, lng);
      await shiftStore.fetchShifts((lat2, lng2) => getShiftsByCoords(lat2, lng2));
    } catch (e: any) {
      shiftStore.status = 'error';
      setGeoError(e?.message || 'geo_error');
    }
  }, [shiftStore]);

  useEffect(() => {
    load();
  }, [load]);

  const colors = theme?.colors;
  const isLoading = shiftStore.status === 'loading';

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (shiftStore.status === 'error') {
    return (
      <View style={styles.center}>
        <Text>Не удалось получить геолокацию</Text>
        <View style={{height: 12}} />
        <TouchableOpacity onPress={load}>
          <Text style={{color: colors?.accent}}>Повторить</Text>
        </TouchableOpacity>
        <View style={{height: 8}} />
        <TouchableOpacity onPress={() => openSettings()}>
          <Text style={{color: colors?.accent}}>Открыть настройки</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FiltersBar />
      <FlatList
        data={shiftStore.sorted}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => navigation.navigate('ShiftDetails', {id: item.id})}>
            <ShiftListItem item={item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<View style={styles.center}><Text>Смен пока нет</Text></View>}
        contentContainerStyle={shiftStore.sorted.length === 0 ? styles.containerEmpty : undefined}
        onRefresh={load}
        refreshing={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  containerEmpty: {flexGrow: 1, justifyContent: 'center', alignItems: 'center'},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  item: {padding: 16, borderBottomWidth: StyleSheet.hairlineWidth},
});

export default observer(ShiftsListScreen);

