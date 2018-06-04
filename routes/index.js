
const api = require('./api');
const authenticate = require('./authenticate');

module.exports = [{
  method: 'GET',
  path: '/',
  config: {
    auth: 'jwt',
    handler(request, reply) {
      return reply.file('./public/index.html');
    }
  }
}, {
  method: 'GET',
  path: '/login',
  handler(req, reply) {
    return reply.file('./public/login.html');
  }
}, {
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: './dist',
      listing: false
    }
  }
}].concat(api, authenticate);
