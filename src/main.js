import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import VuexI18n from 'vuex-i18n';
import VueLocalStorage from 'vue-localstorage';
import Bendalloy from 'bendalloy';

import 'bendalloy/dist/bendalloy.css';
import './assets/less/style.less';
import App from './App.vue';
import Dashboard from './components/Dashboard.vue';
import DataView from './components/DataView.vue';
import ReferenceView from './components/ReferenceView.vue';
<<<<<<< HEAD
=======
import Reports from './components/Reports.vue';
>>>>>>> CICD/CI_CD
import LineageView from './components/LineageView.vue';
import PendingMerges from './components/PendingMerges.vue';
import MatchMerge from './components/MatchMerge.vue';
import CardView from './components/CardView.vue';
import ErrorRemediation from './components/ErrorRemediation.vue';
import Relationship from './components/Relationship.vue';
import TreeGraph from './components/TreeGraph.vue';
import MyAccount from './components/MyAccount.vue';
import UtilityService from './services/utilities';

import LOCALE_EN from './assets/locales/locale-en.json';
import LOCALE_ES from './assets/locales/locale-es.json';
import LOCALE_FR from './assets/locales/locale-fr.json';
import LOCALE_DE from './assets/locales/locale-de.json';

import DefaultFeatures from '../utils/defaultFeatures.json';

Vue.use(Vuex);
Vue.use(VueResource);
Vue.use(VueRouter);
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
const locale = userProfile ? userProfile.language : 'en';
Vue.i18n.set(locale);

function getFeatures() {
  let features;
  try {
    features = JSON.parse(window.sessionStorage.getItem('features'));
    if (features.defaultView === undefined) {
      features = DefaultFeatures;
    }
  } catch (e) {
    features = DefaultFeatures;
  }
  return features;
}

function getDefaultView() {
  const features = getFeatures();
  if (Boolean(features[features.defaultView].enabled)) {
    switch (features.defaultView) {
      case 'DATA_VIEW':
        return '/dataview';
      case 'REFERENCE_VIEW':
        return '/referenceview';
<<<<<<< HEAD
=======
      case 'REPORTS':
        return '/reports';
>>>>>>> CICD/CI_CD
      case 'DASHBOARD':
        return '/dashboard';
      case 'MATCH_AND_MERGE':
        return '/pendingmerges';
      case 'ERROR_REMEDIATION':
        return '/errorremediation';
    }
  } else {
    return '/dataview';
  }
}

UtilityService.getApplicationConfiguration({
  // Can pass other app Configurations configs here
}).then((configs) => {
  const router = new VueRouter({
    routes: [
      {
        name: 'DASHBOARD',
        path: '/dashboard',
        component: Dashboard
      }, {
        name: 'DATA_VIEW',
        path: '/dataview',
        component: DataView
      }, {
        name: 'REFERENCE_VIEW',
        path: '/referenceview',
        component: ReferenceView
      }, {
        name: 'MATCH_AND_MERGE',
        path: '/pendingmerges',
        component: PendingMerges
      }, {
        name: 'Card View',
        path: '/cardview/:repoId/:docId',
        component: CardView
      }, {
        name: 'Match Merge',
        path: '/matchmerge/:repoId/:docId',
        component: MatchMerge
      }, {
        name: 'ERROR_REMEDIATION',
        path: '/errorremediation',
        component: ErrorRemediation
      }, {
        name: 'REPORTS',
        path: '/reports',
        component: Reports
      }, {
        name: 'Error Card View',
        path: '/errorcardview/:repoId/:docId',
        component: CardView
      }, {
        name: 'Lineage View',
        path: '/lineageview/:repoId/:docId',
        component: LineageView
      }, {
        name: 'Tree View',
        path: '/view360/:recordId',
        component: TreeGraph
      }, {
        name: 'MY_ACCOUNT',
        path: '/myaccount',
        component: MyAccount
      }, {
        name: 'Relationships',
        path: '/relationships/:repoId/:docId',
        component: Relationship
      }, {
        path: '*',
        redirect: getFeatures() ? getDefaultView() : '/dataview'
      }
    ]
  });

  router.beforeEach((to, from, next) => {
    if (document.cookie.length === 0) {
      window.location = '/login';
    }
    next();
  });

    // Vue is a constructor and needs to be called with 'new'
    /* eslint-disable no-new */
  new Vue({
    data: {
        // Defining here, allows these env variables to be passed
        // around to all components: ` this.$root.??? `
      features: getFeatures(),
      appDeployEnvName: configs.body.envInstanceName,
      appCustomer: configs.body.appCustomer,
<<<<<<< HEAD
      defDataview: configs.body.appModules[0].defView,
      edit: configs.body.edit,
      locale: locale
=======
      locale
>>>>>>> CICD/CI_CD
    },
    router,
    el: '#app',
    render: h => h(App)
  });
});
