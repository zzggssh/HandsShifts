import {makeAutoObservable, runInAction} from 'mobx';
import type {RootStore} from './RootStore';
import type {Shift} from '../types/shift';

type Status = 'idle' | 'loading' | 'done' | 'error';
type MyMode = 'off' | 'future' | 'past';

export class ShiftStore {
  root: RootStore;
  shifts: Shift[] = [];
  status: Status = 'idle';
  error: string | null = null;
  coords: {lat: number; lng: number} | null = null;

  isNearestByDate = true;
  isNearestByDistance = true;
  filterDay = false;
  filterNight = false;
  selectedDates: string[] = [];
  myMode: MyMode = 'off';
  favorites = new Set<string>();
  showDates = false;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this, {}, {autoBind: true});
  }

  async fetchShifts(fetcher: (lat: number, lng: number) => Promise<{data: Shift[]; status: number}>) {
    if (!this.coords) return;
    this.status = 'loading';
    try {
      const res = await fetcher(this.coords.lat, this.coords.lng);
      runInAction(() => {
        this.shifts = res.data;
        this.status = 'done';
        this.error = null;
      });
    } catch (e: any) {
      runInAction(() => {
        this.status = 'error';
        this.error = e?.message || 'fetch_error';
      });
    }
  }

  setCoords(lat: number, lng: number) {
    this.coords = {lat, lng};
  }

  setNearestByDate(value: boolean) {
    this.isNearestByDate = value;
  }

  setNearestByDistance(value: boolean) {
    this.isNearestByDistance = value;
  }

  setFilterDay(value: boolean) {
    this.filterDay = value;
  }

  setFilterNight(value: boolean) {
    this.filterNight = value;
  }

  toggleDate(key: string) {
    if (this.selectedDates.includes(key)) {
      if (this.selectedDates.length > 1) {
        this.selectedDates = [key];
      } else {
        this.selectedDates = [];
      }
    } else {
      this.selectedDates = [...this.selectedDates, key];
    }
  }

  clearFilters() {
    this.isNearestByDate = true;
    this.isNearestByDistance = true;
    this.filterDay = false;
    this.filterNight = false;
    this.selectedDates = [];
    this.myMode = 'off';
    this.showDates = false;
  }

  setMyMode(mode: MyMode) {
    this.myMode = mode;
  }

  toggleFavorite(id: string) {
    if (this.favorites.has(id)) this.favorites.delete(id);
    else this.favorites.add(id);
  }

  toggleShowDates() {
    this.showDates = !this.showDates;
  }

  get isNight() {
    return (shift: Shift) => shift.timeEndByCity < shift.timeStartByCity;
  }

  get dateKey() {
    return (shift: Shift) => shift.dateStartByCity.split('.').reverse().join('-');
  }

  get distanceKm() {
    return (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const toRad = (v: number) => (v * Math.PI) / 180;
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
  }

  get filtered() {
    let list = this.shifts.slice();

    if (this.myMode !== 'off') {
      list = list.filter(s => this.favorites.has(s.id));
      const nowKey = new Date();
      list = list.filter(s => {
        const [d, m, y] = s.dateStartByCity.split('.').map(Number);
        const shiftDate = new Date(y, m - 1, d);
        return this.myMode === 'future' ? shiftDate >= nowKey : shiftDate < nowKey;
      });
      return list;
    }

    if (this.filterDay || this.filterNight) {
      list = list.filter(s => {
        const night = this.isNight(s);
        if (this.filterDay && this.filterNight) return true;
        if (this.filterNight) return night;
        return !night;
      });
    }

    if (this.selectedDates.length > 0) {
      const set = new Set(this.selectedDates);
      list = list.filter(s => set.has(this.dateKey(s)));
    }

    return list;
  }

  get sorted() {
    const list = this.filtered.slice();
    list.sort((a, b) => {
      if (this.isNearestByDate) {
        const ak = this.dateKey(a);
        const bk = this.dateKey(b);
        if (ak !== bk) return ak < bk ? -1 : 1;
      }
      if (this.isNearestByDistance && this.coords) {
        const da = this.distanceKm(
          this.coords.lat,
          this.coords.lng,
          a.coordinates.latitude,
          a.coordinates.longitude,
        );
        const db = this.distanceKm(
          this.coords.lat,
          this.coords.lng,
          b.coordinates.latitude,
          b.coordinates.longitude,
        );
        if (da !== db) return da - db;
      }
      return 0;
    });
    return list;
  }

  async setShifts(shifts: Shift[]) {
    runInAction(() => {
      this.shifts = shifts;
      this.status = 'done';
      this.error = null;
    });
  }
}

