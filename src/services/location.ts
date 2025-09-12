import {Platform} from 'react-native';
import {CONFIG} from '../config';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import {
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
  check,
} from 'react-native-permissions';

export async function ensureLocationPermission(): Promise<'granted' | 'denied' | 'blocked'> {
  const perm = Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    default: undefined,
  });
  if (!perm) return 'denied';
  const current = await check(perm);
  if (current === RESULTS.GRANTED) return 'granted';
  const result = await request(perm);
  if (result === RESULTS.GRANTED) return 'granted';
  if (result === RESULTS.BLOCKED) return 'blocked';
  return 'denied';
}

export async function getCurrentCoords(options?: {timeoutMs?: number}): Promise<{lat: number; lng: number}> {
  const timeoutMs = options?.timeoutMs ?? 15000;
  const perm = await ensureLocationPermission();
  if (perm !== 'granted') throw new Error('location_not_granted');
  if (Platform.OS === 'ios' && __DEV__ && CONFIG.USE_FALLBACK) {
    try { Geolocation.requestAuthorization('whenInUse'); } catch {}
  }
  const position: GeoPosition = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('location_timeout')), timeoutMs);
    Geolocation.getCurrentPosition(
      pos => {
        clearTimeout(timeout);
        resolve(pos);
      },
      err => {
        clearTimeout(timeout);
        reject(err);
      },
      {enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 0, forceRequestLocation: true},
    );
  });
  return {lat: position.coords.latitude, lng: position.coords.longitude};
}

export {openSettings};

