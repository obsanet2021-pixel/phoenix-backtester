export const API_ENDPOINTS = {
  BACKEND: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
  UDF: {
    CONFIG: '/config',
    SYMBOLS: '/symbols',
    HISTORY: '/history',
    SEARCH: '/search'
  }
};

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500
};
