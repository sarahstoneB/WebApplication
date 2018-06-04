import Vue from 'vue';
import VueResource from 'vue-resource';
import VueCookie from 'vue-cookie';

Vue.use(VueResource);
Vue.use(VueCookie);

const API_COOKIE = `Bearer ${Vue.cookie.get('token')}`;
const locale = JSON.parse(Vue.localStorage.get('userProfile')).language;

const customActions = {
  changePassword: {
    method: 'POST',
    headers: {
      Authorization: API_COOKIE,
      'Content-Type': 'application/json',
      'Accept-Language': `${locale.toUpperCase()}`
    },
    url: 'api/security/password{?locale}'
  },

  getPasswordRules: {
    method: 'GET',
    headers: {
      Authorization: API_COOKIE,
      'Content-Type': 'application/json',
      'Accept-Language': `${locale.toUpperCase()}`
    },
    url: 'api/security/password{?locale}'
  }
};

export default Vue.resource('empty', {}, customActions);
