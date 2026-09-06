import { logger, consoleTransport } from 'react-native-logs';

/**
 * App-wide structured logger. Levels: debug < info < warn < error.
 * In development everything is logged (colored, timestamped) to the console;
 * in production only warnings and errors are kept, so failures stay visible
 * without noise. Use `log.extend('scope')` for per-area loggers (API, Auth…).
 */
const baseLogger = logger.createLogger({
  severity: __DEV__ ? 'debug' : 'warn',
  transport: consoleTransport,
  transportOptions: {
    colors: {
      debug: 'grey',
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
  },
  dateFormat: 'time',
  printLevel: true,
  printDate: true,
});

export const log = baseLogger;
export const apiLog = baseLogger.extend('API');
export const authLog = baseLogger.extend('Auth');
