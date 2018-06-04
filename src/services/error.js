import Vue from 'vue';
import VueResource from 'vue-resource';
import VueCookie from 'vue-cookie';
import VueLocalStorage from 'vue-localstorage';

Vue.use(VueResource);
Vue.use(VueCookie);
Vue.use(VueLocalStorage);

const API_COOKIE = `Bearer ${Vue.cookie.get('token')}`;
const locale = JSON.parse(Vue.localStorage.get('userProfile')).language;

const customActions = {
  getPendingErrors: {
    method: 'GET',
    headers: {
      Authorization: API_COOKIE,
      'Content-Type': 'application/json',
      'Accept-Language': `${locale.toUpperCase()}`
<<<<<<< HEAD
=======
    },
    url: '/api/error{/repoId}{?pageSize,pageNumber,search,sort,createdBefore,countOnly,status}',
    before(request) {
      if (Vue.previousRequest) {
        Vue.previousRequest.abort();
      }
      Vue.previousRequest = request;
    }
  },

  getDashboardPendingErrors: {
    method: 'GET',
    headers: {
      Authorization: API_COOKIE,
      'Content-Type': 'application/json',
      'Accept-Language': `${locale.toUpperCase()}`
>>>>>>> CICD/CI_CD
    },
    url: '/api/error{/repoId}{?pageSize,pageNumber,search,sort,createdBefore,countOnly,status}',
    before(request) {
      if (Vue.previousRequest) {
        Vue.previousRequest.abort();
      }
      Vue.previousRequest = request;
    }
  },

  getClosedErrors: {
    method: 'GET',
    headers: {
      Authorization: API_COOKIE,
      'Content-Type': 'application/json'
    },
    url: '/api/error{/repoId}{?pageSize,pageNumber,modifiedBefore,countOnly,status}'
  },

  lockDocument: {
    method: 'PUT',
    headers: {
      Authorization: API_COOKIE,
      'Content-Type': 'application/json'
    },
    url: '/api/error{/repoId}{/docId}{?locale}'
  },

  getColumns: {
    method: 'GET',
    headers: {
      Authorization: API_COOKIE,
      'Content-Type': 'application/json'
    },
    url: '/api/repositories{/repoId}'
  },

  processError: {
    method: 'POST',
    headers: {
      Authorization: API_COOKIE,
      'Content-Type': 'application/json'
    },
    url: '/api/error{/repoId}{/docId}{?action}'
  },

  reject: {
    method: 'POST',
    headers: {
      Authorization: API_COOKIE,
      'Content-Type': 'application/json'
    },
    url: '/api/error{/repoId}{/docId}{?action}'
  }
};

export default Vue.resource('repositories{/id}', {}, customActions);
