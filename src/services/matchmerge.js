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
  getPendingMerges: {
    method: 'GET',
    headers: {
      Authorization: API_COOKIE,
      'Content-Type': 'application/json',
      'Accept-Language': `${locale.toUpperCase()}`
<<<<<<< HEAD
=======
    },
    url: '/api/matchandmerge{/repoId}{?pageSize,pageNumber,search,sort,createdBefore,countOnly,status}',
    before(request) {
      if (Vue.previousRequest) {
        Vue.previousRequest.abort();
      }
      Vue.previousRequest = request;
    }
  },

  getDashboardPendingMerges: {
    method: 'GET',
    headers: {
      Authorization: API_COOKIE,
      'Content-Type': 'application/json',
      'Accept-Language': `${locale.toUpperCase()}`
>>>>>>> CICD/CI_CD
    },
    url: '/api/matchandmerge{/repoId}{?pageSize,pageNumber,search,sort,createdBefore,countOnly,status}',
    before(request) {
      if (Vue.previousRequest) {
        Vue.previousRequest.abort();
      }
      Vue.previousRequest = request;
    }
  },

  getFilteredMerges: {
    method: 'GET',
    headers: {
      Authorization: API_COOKIE,
      'Content-Type': 'application/json'
    },
    url: '/api/repositories{/repoId}/documents{?pageSize,pageNumber,search,sort}',
    before(request) {
      if (Vue.previousRequest) {
        Vue.previousRequest.abort();
      }
      Vue.previousRequest = request;
    }
  },

  getClosedMerges: {
    method: 'GET',
    headers: {
      'Authorization': API_COOKIE,
      'Content-Type': 'application/json'
    },
    url: '/api/matchandmerge{/repoId}{?pageSize,pageNumber,modifiedBefore,countOnly,status}'
  },

  getPendingMergeDocument: {
    method: 'PUT',
    headers: {
      Authorization: API_COOKIE,
      'Content-Type': 'application/json'
    },
    url: '/api/matchandmerge{/repoId}{/docId}{?locale}'
  },

  resolvePendingDocument: {
    method: 'POST',
    headers: {
      Authorization: API_COOKIE
    },
    url: '/api/matchandmerge{/repoId}{/docId}{?action}'
  },

  deletePendingDocument: {
    method: 'DELETE',
    headers: {
      Authorization: API_COOKIE
    },
    url: '/api/matchandmerge{/repoId}{/docId}'
  }
};

export default Vue.resource('repositories{/id}', {}, customActions);
