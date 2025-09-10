import React, {createContext, useContext} from 'react';
import {ShiftStore} from './ShiftStore';

export class RootStore {
  shiftStore: ShiftStore;
  constructor() {
    this.shiftStore = new ShiftStore(this);
  }
}

const RootStoreContext = createContext<RootStore | null>(null);

export const RootStoreProvider = ({children}: {children: React.ReactNode}) => {
  const store = React.useMemo(() => new RootStore(), []);
  return <RootStoreContext.Provider value={store}>{children}</RootStoreContext.Provider>;
};

export const useStores = () => {
  const ctx = useContext(RootStoreContext);
  if (!ctx) throw new Error('RootStoreProvider is missing');
  return ctx;
};

