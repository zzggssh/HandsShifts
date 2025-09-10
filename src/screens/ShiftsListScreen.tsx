import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useStores} from '../stores/RootStore';
import {getCurrentCoords, openSettings} from '../services/location';
import {getThemeColors} from '../theme';

function ShiftsListScreen() {
  const {shiftStore} = useStores();
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    const load = async () => {
      try {
        setGeoError(null);
        shiftStore.status = 'loading';
        const {lat, lng} = await getCurrentCoords();
        if (aborted) return;
        shiftStore.setCoords(lat, lng);
        shiftStore.status = 'done';
      } catch (e: any) {
        shiftStore.status = 'error';
        setGeoError(e?.message || 'geo_error');
      }
    };
    load();
    return () => {
      aborted = true;
    };
  }, [shiftStore]);

  const colors = useMemo(() => getThemeColors('light'), []);

  if (shiftStore.status === 'loading') {
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
        <TouchableOpacity onPress={() => { shiftStore.status = 'idle'; }}>
          <Text style={{color: colors.accent}}>Повторить</Text>
        </TouchableOpacity>
        <View style={{height: 8}} />
        <TouchableOpacity onPress={openSettings}>
          <Text style={{color: colors.accent}}>Открыть настройки</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={shiftStore.sorted}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <View style={styles.item}><Text>{item.companyName}</Text></View>
      )}
      ListEmptyComponent={
        <View style={styles.center}><Text>Смен пока нет</Text></View>
      }
      contentContainerStyle={shiftStore.sorted.length === 0 ? styles.containerEmpty : undefined}
    />
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  containerEmpty: {flexGrow: 1, justifyContent: 'center', alignItems: 'center'},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  item: {padding: 16, borderBottomWidth: StyleSheet.hairlineWidth},
});

export default observer(ShiftsListScreen);

