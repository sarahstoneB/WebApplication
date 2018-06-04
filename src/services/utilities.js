import Vue from 'vue';
import VueResource from 'vue-resource';
import VueCookie from 'vue-cookie';
import _ from 'lodash';

Vue.use(VueResource);
Vue.use(VueCookie);

const API_COOKIE = `Bearer ${Vue.cookie.get('token')}`;

const customActions = {
  getApplicationConfiguration: {
    method: 'GET',
    headers: {
      Authorization: API_COOKIE,
      'Content-Type': 'application/json'
    },
    url: 'api/getApplicationConfiguration'
  }
};

export default Vue.resource('empty', {}, customActions);
