/* eslint-disable no-console */
export const logger = {
  log: (...args: any[]) => { if (__DEV__) console.log(...args); },
  warn: (...args: any[]) => { if (__DEV__) console.warn(...args); },
  error: (...args: any[]) => { if (__DEV__) console.error(...args); },
};


