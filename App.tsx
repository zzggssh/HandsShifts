import React from 'react';
import {ThemeProvider} from './src/app/ThemeProvider';
import StoreProvider from './src/app/StoreProvider';
import Navigation from './src/app/Navigation';

export default function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <Navigation />
      </StoreProvider>
    </ThemeProvider>
  );
}
