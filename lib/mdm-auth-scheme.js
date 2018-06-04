const Wreck = require('wreck');
const Boom = require('boom');
const Cookie = require('cookie');
const config = require('../config');

const validate = (token) => {
  return new Promise((resolve, reject) => {
    Wreck.get(`${config.baseUrl}/security/validate`, { headers: { authorization: `Bearer ${token}` } }, (err, res, payload) => {
      if (err) {
        reject(err);
      } else if (payload.toString() === 'true') {
        resolve(Buffer.from(token.split('.')[1], 'base64').toString());
      } else {
        reject('Invalid credentials');
      }
    });
  });
};

exports.register = (server, options, next) => {
  server.auth.scheme('mdm-services', () => {
    return {
      authenticate(request, reply) {
        try {
          const authorization = request.headers.authorization ? request.headers.authorization.slice(7) : undefined;
          const cookie = request.headers.cookie ? Cookie.parse(request.headers.cookie).token : undefined;
          const token = authorization || cookie;

          if (token) {
            validate(token).then((credentials) => {
              reply.continue({ credentials, artifacts: token });
            }, () => {
              reply(Boom.unauthorized('Invalid credentials'));
            });
          } else {
            reply(Boom.unauthorized('Invalid credentials'));
          }
        } catch (err) {
          reply(Boom.internal(err));
        }
      }
    };
  });
  return next();
};

exports.register.attributes = {
  name: 'MDM Services'
};
