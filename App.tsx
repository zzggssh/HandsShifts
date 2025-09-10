import React from 'react';
import {ThemeProvider} from './src/app/ThemeProvider';
import Navigation from './src/app/Navigation';

export default function App() {
  return (
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );
}
