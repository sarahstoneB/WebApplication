import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import VueCookie from 'vue-cookie';
import VuexI18n from 'vuex-i18n';
import VueLocalStorage from 'vue-localstorage';
import Bendalloy from 'bendalloy';

import 'bendalloy/dist/bendalloy.css';
import Login from './components/Login.vue';

import LOCALE_EN from './assets/locales/locale-en.json';
import LOCALE_ES from './assets/locales/locale-es.json';
import LOCALE_FR from './assets/locales/locale-fr.json';
import LOCALE_DE from './assets/locales/locale-de.json';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueCookie);
Vue.use(VueLocalStorage);
Vue.use(Bendalloy);

Vue.config.debug = DEBUG_MODE;
Vue.config.devtools = DEBUG_MODE;
Vue.config.productionTip = DEBUG_MODE;

const store = new Vuex.Store();
Vue.use(VuexI18n.plugin, store);

Vue.i18n.add('en', LOCALE_EN);
Vue.i18n.add('es', LOCALE_ES);
Vue.i18n.add('fr', LOCALE_FR);
Vue.i18n.add('de', LOCALE_DE);

const userProfile = JSON.parse(Vue.localStorage.get('userProfile'));
Vue.i18n.set(userProfile ? userProfile.language : 'en');

// Vue is a constructor and needs to be called with 'new'
/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  render: h => h(Login),
  localStorage: {
    userProfile: {
      type: Object,
      default: {
        language: 'en'
      }
    }
  }
});
