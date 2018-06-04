import Vue from 'vue';
import VueResource from 'vue-resource';
import VueCookie from 'vue-cookie';
import VueLocalStorage from 'vue-localstorage';
import _ from 'lodash';

Vue.use(VueResource);
Vue.use(VueCookie);
Vue.use(VueLocalStorage);

const API_COOKIE = `Bearer ${Vue.cookie.get('token')}`;
const locale = JSON.parse(Vue.localStorage.get('userProfile')).language;

const customActions = {
  getRepositories: {
    method: 'GET',
    headers: {
      Authorization: API_COOKIE
    },
    url: '/api/repositories{?type}'
  },

  getColHeaders: {
    method: 'GET',
    headers: {
      Authorization: API_COOKIE,
      'Accept-Language': `${locale.toUpperCase()}`
    },
    url: '/api/repositories{/repoId}{?formName, locale}'
  },

  getViewForms: {
    method: 'GET',
    headers: {
      Authorization: API_COOKIE,
      'Accept-Language': `${locale.toUpperCase()}`
    },
    url: '/api/repositories{/repoId}{?viewForms, locale}'
  },

  getDetailedColHeaders: {
    method: 'GET',
    headers: {
      Authorization: API_COOKIE,
      'Accept-Language': `${locale.toUpperCase()}`
    },
    url: '/legacyapi/repository/id{/repoId}/gridlayout{?locale}'
  },

  createNewForm: {
    method: 'POST',
    headers: {
      Authorization: API_COOKIE,
      'Content-Type': 'application/json',
      'Accept-Language': `${locale.toUpperCase()}`
    },
    url: '/legacyapi/repository/id{/repoId}/gridlayout'
  },

  getDocuments: {
    method: 'GET',
    headers: {
      Authorization: API_COOKIE,
      'Accept-Language': `${locale.toUpperCase()}`
    },
    url: '/api/repositories{/repoId}/documents{?pageSize,pageNumber,search,sort,locale}',
    before(request) {
      if (Vue.previousRequest) {
        Vue.previousRequest.abort();
      }
      Vue.previousRequest = request;
    }
  },

  getDocument: {
    method: 'GET',
    headers: {
      Authorization: API_COOKIE
    },
    url: '/api/repositories{/repoId}/documents{/documentId}{?nested,transaction,locale}'
  },

  getFrequency: {
    method: 'POST',
    headers: {
      Authorization: API_COOKIE,
      'Content-Type': 'application/json'
    },
    url: '/pf/repositories/id{/repoId}/profile/frequencies{?attributeName,outliers,size}'
  },

  getHistogram: {
    method: 'POST',
    headers: {
      Authorization: API_COOKIE,
      'Content-Type': 'application/json'
    },
    url: '/pf/repositories/id{/repoId}/profile/histogram{?attributeName,interval,minDocCount}'
  },

  getDateHistogram: {
    method: 'POST',
    headers: {
      Authorization: API_COOKIE,
      'Content-Type': 'application/json'
    },
    url: '/pf/repositories/id{/repoId}/profile/dateHistogram{?attributeName,interval,minDocCount,timezoneOffset,dateOffset,dateFormat}'
  },

  getStatistics: {
    method: 'POST',
    headers: {
      Authorization: API_COOKIE,
      'Content-Type': 'application/json'
    },
    url: '/pf/repositories/id{/repoId}/profile/statistics{?attributeName,detailed,sigma}'
  },

  lockDocument: {
    method: 'PUT',
    headers: {
      Authorization: API_COOKIE
    },
    url: '/api/repositories{/repoId}/documents{/docId}{?nested,locale}'
  },

  updateDocument: {
    method: 'POST',
    headers: {
      Authorization: API_COOKIE
    },
    url: '/api/repositories{/repoId}/documents{/docId}{?action}'
  },

  exportDocuments: {
    method: 'POST',
    headers: {
      Authorization: API_COOKIE
    },
    url: '/api/repository/export'
  }
};

export default Vue.resource('repositories{/id}', {}, customActions);
