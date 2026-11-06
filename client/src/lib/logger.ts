type LogContext = Record<string, unknown>;

const isDevelopment = import.meta.env.DEV; // Vite boolean to check if app is running in development mode
/**
 * Centralized application logger.
 *
 * Provides standardized logging across the frontend.
 *
 * DEBUG logs are only displayed in development. You may need to set the level in browser debugger.
 */
export const logger = {
  /**
   *  Logs app info.
   *
   * @param message - Description of the event. Add file name and method name using [fileName::methodName]
   * @param context - Optional additional data in the form of object.
   */
  debug(message: string, context?: LogContext) {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context ?? "");
    }
  },

  info(message: string, context?: LogContext) {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, context ?? "");
    }
  },

  warn(message: string, context?: LogContext) {
    console.warn(`[WARN] ${message}`, context ?? "");
  },

  error(message: string, error?: unknown, context?: LogContext) {
    console.error(`[ERROR] ${message}`, {
      error,
      ...context,
    });
  },
};
