/**
 * Standardized successful API response.
 * @param {Object} res - Express response object
 * @param {Object|Array} data - The data to return
 * @param {string} message - Success message
 * @param {number} [statusCode=200] - HTTP status code
 * @param {Object} [meta] - Pagination or other metadata
 * @param {Object} [extraData={}] - Additional data for backward compatibility
 * @returns {Object} Express response
 */
export const sendSuccess = (res, data, message, statusCode = 200, meta = null, extraData = {}) => {
  const response = {
    status: 'success',
    message,
    data,
    ...extraData,
  };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
};

/**
 * Standardized error API response.
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} [statusCode=500] - HTTP status code
 * @param {any} [errorDetails] - Optional details/stack/validation errors
 */
export const sendError = (res, message, statusCode = 500, errorDetails = null) => {
  const response = {
    status: 'error',
    message,
  };
  if (errorDetails) response.details = errorDetails;
  return res.status(statusCode).json(response);
};
