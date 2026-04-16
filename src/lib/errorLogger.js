/**
 * Error logging utility for production error tracking
 * Logs errors to console with structured format
 * Can be extended to send to external services (Sentry, LogRocket, etc.)
 */

const isDevelopment = import.meta.env.DEV;

export const logError = (error, context = {}) => {
  const errorData = {
    timestamp: new Date().toISOString(),
    message: error.message || 'Unknown error',
    stack: error.stack,
    context,
    environment: isDevelopment ? 'development' : 'production',
    url: window.location.href,
    userAgent: navigator.userAgent
  };

  // Log to console with structured format
  console.error('[ERROR]', errorData);

  // In production, you could send to error tracking service
  if (!isDevelopment) {
    // Example: Send to Sentry
    // Sentry.captureException(error, { extra: context });
    
    // Example: Send to custom endpoint
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorData)
    // });
  }
};

export const logWarning = (message, context = {}) => {
  const warningData = {
    timestamp: new Date().toISOString(),
    message,
    context,
    environment: isDevelopment ? 'development' : 'production'
  };

  console.warn('[WARNING]', warningData);
};

export const logInfo = (message, context = {}) => {
  const infoData = {
    timestamp: new Date().toISOString(),
    message,
    context,
    environment: isDevelopment ? 'development' : 'production'
  };

  console.log('[INFO]', infoData);
};

export const logPerformance = (metric, value, context = {}) => {
  const perfData = {
    timestamp: new Date().toISOString(),
    metric,
    value,
    context,
    environment: isDevelopment ? 'development' : 'production'
  };

  console.log('[PERFORMANCE]', perfData);
};
