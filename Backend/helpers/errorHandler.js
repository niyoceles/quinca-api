/**
 * Global error handling middleware.
 * Catches unhandled errors from controllers and returns
 * a consistent JSON response instead of crashing.
 */

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Log the error stack in development only
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error]', err.stack || err);
  }

  return res.status(statusCode).json({
    status: 'error',
    error: message,
  });
};

export default errorHandler;
