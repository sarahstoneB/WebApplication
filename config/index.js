const convertToBoolean = require('yn');

module.exports = {
  serverPort: process.env.PORT || 8080,
  baseUrl: process.env.WEB_MDM_API_URL || 'http://localhost:8090/api',
  cookieSecure: convertToBoolean(process.env.COOKIE_SECURE) || false,
  cookieHttpOnly: convertToBoolean(process.env.COOKIE_HTTPONLY) || false
};
