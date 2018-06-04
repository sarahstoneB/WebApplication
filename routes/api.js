const querystring = require('querystring');
const config = require('../config');

// Routes for grabbing MDM-API end-points, but you get the idea
module.exports = [

  // api paths
  {
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    path: '/api/{param*}',
    handler: {
      proxy: {
        passThrough: true,
        mapUri(request, callback) {
          const apiPath = request.paramsArray[0] ? `/${request.paramsArray[0]}` : '';
          let apiFullRoute = `${config.baseUrl}/json${apiPath}`;
          const queryString = querystring.stringify(request.query);
          if (queryString) {
            apiFullRoute += `?${queryString}`;
          }

          console.log(`API Proxy: ${request.method} ${apiFullRoute}`);
          callback(null, apiFullRoute);
        }
      }
    }
  },

  // profile column call routing - ToDo: make an alternative
  {
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    path: '/pf/{param*}',
    handler: {
      proxy: {
        passThrough: true,
        mapUri(request, callback) {
          const apiPath = request.paramsArray[0] ? `/${request.paramsArray[0]}` : '';
          let apiFullRoute = `${config.baseUrl}${apiPath}`;
          const queryString = querystring.stringify(request.query);
          if (queryString) {
            apiFullRoute += `?${queryString}`;
          }

          console.log(`API Proxy: ${request.method} ${apiFullRoute}`);
          callback(null, apiFullRoute);
        }
      }
    }
  },

  // New Utility Proxy - Helper routes in the middleware API
  {
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    path: '/utils/{param*}',
    handler: {
      proxy: {
        passThrough: true,
        mapUri(request, callback) {
          const apiPath = request.paramsArray[0] ? `/${request.paramsArray[0]}` : '';
          let apiFullRoute = `${config.baseUrl}/json${apiPath}`;
          const queryString = querystring.stringify(request.query);
          if (queryString) {
            apiFullRoute += `?${queryString}`;
          }

          console.log(`UTILS Proxy: ${request.method} ${apiFullRoute}`);
          callback(null, apiFullRoute);
        }
      }
    }
  },

  // api paths
  {
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    path: '/legacyapi/{param*}',
    handler: {
      proxy: {
        passThrough: true,
        mapUri(request, callback) {
          const apiPath = request.paramsArray[0] ? `/${request.paramsArray[0]}` : '';
          let apiFullRoute = `${config.baseUrl}${apiPath}`;
          const queryString = querystring.stringify(request.query);
          if (queryString) {
            apiFullRoute += `?${queryString}`;
          }

          console.log(`Legacy Proxy: ${request.method} ${apiFullRoute}`);
          callback(null, apiFullRoute);
        }
      }
    }
  },

  // retrieves MDM api documentation
  {
    method: 'GET',
    path: '/docs',
    handler: {
      proxy: {
        passThrough: true,
        uri: `${config.baseUrl}/doc`
      }
    }
  },

  // return countries
  {
    method: 'GET',
    path: '/api/locale/countries',
    handler(request, reply) {
      reply.file('./server/utils/countries.json');
    }
  },

  // return languages
  {
    method: 'GET',
    path: '/api/locale/languages',
    handler(request, reply) {
      reply.file('./server/utils/isolangs.json');
    }
  },

  // temporary json for profilecolumn
  {
    method: 'GET',
    path: '/profilecolumn',
    handler(request, reply) {
      reply.file('./server/profilecolumn/color.json');
    }
  },

  {
    /* Process Application Specific Configurations for the purpose of enabling/disabling specific features of DS-UI.
      # US / EU / SIT Instances Environment Configurations
      # Dataview | UAT=1522579, SIT=1544731
      # Match & Merge | UAT=1522832, SIT=1544732
      # Error Remediation | UAT=, SIT=1544694
      Default is always SIT
    */
    method: ['GET'],
    path: '/api/getApplicationConfiguration',
    config: {
      handler: (request, reply) => {
        const _appConfiguration = {
          envInstanceName: process.env.ENV_INSTANCE || 'sit', // eu, us, sit
<<<<<<< HEAD
          edit: process.env.EDIT,
          appModules: [
            {
              name: 'DASHBOARD',
              enabled: process.env.DASHBOARD_APP || true,
              defView: undefined
            },
            {
              name: 'DATA_VIEW',
              enabled: process.env.DATAVIEW_APP || true,
              defRepoID: process.env.DEF_DATAVIEW_ID || 1544731,
              defView: process.env.DEF_DATAVIEW || 'cardview'
            },
            {
              name: 'REFERENCE_VIEW',
              enabled: process.env.REF_VIEW_APP || true,
              defRepoID: null
            },
            {
              name: 'DATA_PROFILER',
              enabled: process.env.DATA_PROFILER || false,
              external: true,
              defView: undefined
            },
            {
              name: 'MATCH_AND_MERGE',
              enabled: process.env.MATCH_MERGE_APP || false,
              defRepoID: process.env.DEF_MATCHMERGE_ID || 1544732,
              defView: undefined
            },
            {
              name: 'ERROR_REMEDIATION',
              enabled: process.env.ERROR_REMEDIATION_APP || false,
              defRepoID: process.env.DEF_ERRORREM_ID || 1544694,
              defView: undefined
            },
            {
              name: 'MY_ACCOUNT',
              enabled: true
            }
          ],
=======
>>>>>>> CICD/CI_CD
          appCustomer: {
            name: process.env.CUSTOMER || 'Alloy',
            logo: process.env.LOGO || 'http://localhost:8091/alloy_logo_small.png'
          }
        };

        reply(_appConfiguration);
      }
    }
  }
];
