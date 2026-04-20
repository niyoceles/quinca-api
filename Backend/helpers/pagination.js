/**
 * Shared pagination utility
 * Extracts page/limit from query params with safe defaults
 * and builds standardized metadata from findAndCountAll results.
 */

/**
 * Parse pagination params from request query string.
 * @param {object} query - req.query object
 * @returns {object} { page, limit, offset }
 */
export const parsePagination = (query = {}) => {
  const limit = query.limit ? parseInt(query.limit, 10) : 10;
  const page = query.page ? parseInt(query.page, 10) : 1;
  const offset = (page - 1) * limit;
  return {
    limit,
    offset,
    page,
  };
};

/**
 * Build pagination metadata object.
 * @param {number} count - Total number of items
 * @param {number} limit - Items per page
 * @param {number} page - Current page number
 * @returns {object} Pagination metadata
 */
export const buildPaginationMeta = (count, limit, page) => {
  const totalPages = Math.ceil(count / limit);
  return {
    totalItems: count,
    totalPages,
    currentPage: page,
  };
};
