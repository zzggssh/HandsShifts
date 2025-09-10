import type {ShiftsResponse} from '../types/shift';

const API_BASE = 'https://mobile.handswork.pro';

export async function getShiftsByCoords(lat: number, lng: number, signal?: AbortSignal): Promise<ShiftsResponse> {
  const url = `${API_BASE}/api/shifts?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`;
  const res = await fetch(url, {signal});
  if (!res.ok) {
    throw new Error(`http_${res.status}`);
  }
  const json = (await res.json()) as ShiftsResponse;
  return json;
}

