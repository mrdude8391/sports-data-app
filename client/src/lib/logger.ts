type LogContext = Record<string, unknown>;

const isDevelopment = import.meta.env.DEV; // Vite boolean to check if app is running in development mode

export const logger = {
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
