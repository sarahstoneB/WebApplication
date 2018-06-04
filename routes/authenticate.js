// Authentication routes

const _ = require('lodash');
const Joi = require('joi');
const wreck = require('wreck');
const Boom = require('boom');
const createToken = require('../utils/tokens');
const config = require('../config');
const jwt = require('jsonwebtoken');

const authenticateSchema = Joi.object({
  encoded: Joi.string().required()
});

// Using this to get the error object back in response if any....
function getErrors(boomObject, payload) {
  boomObject.output.payload.errors = payload.errors ? payload.errors : {};
  return boomObject;
}

module.exports = [
  // note: /login route can be found in views.js
  {
    method: 'GET',
    path: '/logout',
    handler: (req, reply) => {
      return reply.redirect('/login').unstate('token').unstate('user');
    }
  },

  {
    method: 'POST',
    path: '/passwordrules',

    handler: (req, reply) => {
      const encoded = req.payload.encoded;
      const locale = req.payload.locale;

      const options = {
        headers: {
          Authorization: `Basic ${encoded}`
        },
        payload: 'string',
        timeout: 5000
      };
      wreck.get(`${config.baseUrl}/json/security/password?locale=${locale}`, options, (err, res, payload) => {
        const response = JSON.parse(payload);
        reply(response);
      });
    }
  },

  {
    method: 'POST',
    path: '/changepassword',

    handler: (req, reply) => {
      const encoded = req.payload.encoded;

      const options = {
        headers: {
          Authorization: `Basic ${encoded}`
        },
        payload: {
          current: req.payload.payload.current,
          new: req.payload.payload.new
        },
        timeout: 5000
      };

      wreck.post(`${config.baseUrl}/json/security/password`, options, (err, res, payload) => {
        const response = JSON.parse(payload);

        if (res.statusCode === 409) {
          return reply(getErrors(Boom.conflict('Error while changing password'), response));
        } else if (res.statusCode === 200) {
          return reply(response);
        }
      });
    }
  },

  // authentication
  {
    method: 'POST',
    path: '/authenticate',
    handler: (req, reply) => {
      const encoded = req.payload.encoded;

      const options = {
        headers: {
          Authorization: `Basic ${encoded}`
        },
        payload: 'string',
        timeout: 5000,
        json: true
      };

      wreck.post(`${config.baseUrl}/json/security/login?config=true`, options, (err, res, payload) => {

        // Error Checks
        if (err) {
          return reply('Server error! ALERT THE INTERNET!').code(500);
        }

        // Login failed... So handle error cases!
        switch (res.statusCode) {
          case 401:
            return reply(getErrors(Boom.unauthorized('Invalid credentials'), payload));

          case 409:
            return reply(getErrors(Boom.conflict('Conflict'), payload));

          case 403:
            return reply(getErrors(Boom.forbidden('User is not allowed to login'), payload));
        }

        // Login Success!
        if (res.statusCode === 200) {
          // Check for authorization token in header from service
          if (!res.headers.authorization) {
            return reply(Boom.serverUnavailable('Unable to retrieve authorization header'));
          }

          // Remove the word Bearer from return or else cookie will fail
          const serviceCookie = res.headers.authorization.slice(7);
          const userObject = payload.user;

          // Return the response and store the cookie
          return reply(payload).code(201).header('Authorization', res.headers.authorization)
          .state('token', serviceCookie)
          .state('user', userObject);
        }

        // If all else fails
        return reply(Boom.serverUnavailable('unavailable'));
      });
    },
    config: {
      validate: {
        payload: authenticateSchema
      }
    }
  }
];
