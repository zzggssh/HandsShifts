import React from 'react';
import {RootStoreProvider} from '../stores/RootStore';

export default function StoreProvider({children}: {children: React.ReactNode}) {
  return <RootStoreProvider>{children}</RootStoreProvider>;
}

