export class AppError extends Error {
  constructor(message, code, context = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  FIRESTORE_ERROR: 'FIRESTORE_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

export const errorService = {
  handleError: (error, context = {}) => {
    console.error('Application Error:', {
      message: error.message,
      code: error.code,
      context,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    // Send to error reporting service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
      // errorReportingService.captureException(error, context);
    }

    return new AppError(
      error.message || 'An unexpected error occurred',
      error.code || ErrorCodes.UNKNOWN_ERROR,
      context
    );
  },

  isNetworkError: (error) => {
    return error.code === 'NETWORK_ERROR' || error.message.includes('network');
  },

  isAuthError: (error) => {
    return error.code === 'AUTH_ERROR' || error.message.includes('auth');
  },

  getFriendlyMessage: (error) => {
    const messages = {
      [ErrorCodes.NETWORK_ERROR]: 'Please check your internet connection and try again.',
      [ErrorCodes.AUTH_ERROR]: 'Please sign in again to continue.',
      [ErrorCodes.VALIDATION_ERROR]: 'Please check your input and try again.',
      [ErrorCodes.FIRESTORE_ERROR]: 'Data service is temporarily unavailable.',
      [ErrorCodes.PERMISSION_ERROR]: 'You don\'t have permission to perform this action.',
      [ErrorCodes.UNKNOWN_ERROR]: 'Something went wrong. Please try again.',
    };

    return messages[error.code] || messages[ErrorCodes.UNKNOWN_ERROR];
  },
};