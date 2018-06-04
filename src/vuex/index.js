import Vue from 'vue';
import Vuex from 'vuex';
import DataView from './modules/dataview';
import ReferenceView from './modules/referenceview';
import MatchMerge from './modules/matchmerge';
import ErrorRemediation from './modules/errorremediation';
import Reports from './modules/reports';
import Util from './modules/util';

Vue.use(Vuex);

const debug = DEBUG_MODE;

export default new Vuex.Store({
  strict: debug,
  modules: {
    DataView,
    ReferenceView,
    MatchMerge,
    ErrorRemediation,
    Reports,
    Util
  }
});
