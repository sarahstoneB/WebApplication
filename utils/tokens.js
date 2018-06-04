'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config');

function createToken(user) {
  // Sign the JWT
  return jwt.sign(user, config.auth.jwtTokenSecret, {
    algorithm: 'HS256',
    expiresIn: "15m"
  });
}

module.exports = createToken;
