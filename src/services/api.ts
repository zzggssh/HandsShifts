import type {ShiftsResponse} from '../types/shift';
import {fallbackResponse} from './fallback';
import {CONFIG} from '../config';
import {logger} from '../utils/logger';

const API_BASE = CONFIG.BASE_URL;

export async function getShiftsByCoords(lat: number, lng: number, signal?: AbortSignal): Promise<ShiftsResponse> {
  const url = `${API_BASE}/api/shifts?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`;
  logger.log('GET', url);
  try {
    const res = await fetch(url, {signal});
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      logger.log('HTTP', res.status, text?.slice(0, 200));
      if (CONFIG.USE_FALLBACK) {
        logger.log('Using fallback data');
        return fallbackResponse;
      }
      throw new Error(`http_${res.status}`);
    }
    const json = (await res.json()) as ShiftsResponse;
    return json;
  } catch (e: any) {
    logger.log('NETWORK_ERROR', e?.message);
    if (CONFIG.USE_FALLBACK) {
      logger.log('Using fallback data');
      return fallbackResponse;
    }
    throw e;
  }
}

