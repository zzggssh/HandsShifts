import React, {useEffect, useMemo, useState} from 'react';
import {Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, SafeAreaView} from 'react-native';

type City = { name: string; lat: number; lng: number };

const PRESET: City[] = [
  {name: 'Москва', lat: 55.7558, lng: 37.6176},
  {name: 'Санкт‑Петербург', lat: 59.9343, lng: 30.3351},
  {name: 'Новосибирск', lat: 55.0084, lng: 82.9357},
  {name: 'Екатеринбург', lat: 56.8389, lng: 60.6057},
  {name: 'Казань', lat: 55.7903, lng: 49.1125},
  {name: 'Нижний Новгород', lat: 56.2965, lng: 43.9361},
  {name: 'Челябинск', lat: 55.1644, lng: 61.4368},
  {name: 'Самара', lat: 53.1959, lng: 50.1008},
  {name: 'Омск', lat: 54.9885, lng: 73.3242},
  {name: 'Ростов‑на‑Дону', lat: 47.2357, lng: 39.7015},
  {name: 'Уфа', lat: 54.7388, lng: 55.9721},
  {name: 'Красноярск', lat: 56.0153, lng: 92.8932},
  {name: 'Пермь', lat: 58.0105, lng: 56.2502},
  {name: 'Волгоград', lat: 48.7071, lng: 44.5166},
  {name: 'Воронеж', lat: 51.672, lng: 39.1843},
  {name: 'Саратов', lat: 51.5336, lng: 46.0343},
  {name: 'Краснодар', lat: 45.0355, lng: 38.9753},
  {name: 'Тюмень', lat: 57.153, lng: 65.5343},
  {name: 'Тольятти', lat: 53.5206, lng: 49.389},
  {name: 'Ижевск', lat: 56.8526, lng: 53.2047},
];

async function searchNominatim(query: string): Promise<City[]> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=0&limit=10`;
    const res = await fetch(url, {headers: {'User-Agent': 'HandsShifts/1.0'}});
    const json = await res.json();
    return (json || []).map((it: any) => ({name: it.display_name, lat: Number(it.lat), lng: Number(it.lon)}));
  } catch {
    return [];
  }
}

export default function CityPickerModal({visible, onClose, onSelect}: {visible: boolean; onClose: () => void; onSelect: (lat: number, lng: number) => void;}) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const list = useMemo(() => (q.trim().length === 0 ? PRESET : results), [q, results]);

  useEffect(() => {
    let active = true;
    if (q.trim().length === 0) { setResults([]); return; }
    const t = setTimeout(async () => {
      const r = await searchNominatim(q.trim());
      if (active) setResults(r);
    }, 350);
    return () => { active = false; clearTimeout(t); };
  }, [q]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Выбрать город</Text>
        <TextInput value={q} onChangeText={setQ} placeholder="Поиск города" style={styles.input} />
        <FlatList
          data={list}
          keyExtractor={(item, idx) => item.name + idx}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="always"
          renderItem={({item}) => (
            <TouchableOpacity style={styles.item} onPress={() => { onSelect(item.lat, item.lng); onClose(); }}>
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity onPress={onClose} style={styles.close}><Text style={styles.closeText}>Закрыть</Text></TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#FFFFFF'},
  title: {fontSize: 18, fontWeight: '700', marginBottom: 12},
  input: {borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12},
  item: {paddingVertical: 12, paddingHorizontal: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB'},
  itemText: {fontSize: 16},
  close: {marginTop: 12, alignItems: 'center'},
  closeText: {color: '#2563EB', fontWeight: '600'},
});
