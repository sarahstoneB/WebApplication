import _ from 'lodash';
import convertToBoolean from 'yn';

import LOCALE_EN from '../../assets/locales/locale-en.json';
import LOCALE_ES from '../../assets/locales/locale-es.json';
import LOCALE_FR from '../../assets/locales/locale-fr.json';
import LOCALE_DE from '../../assets/locales/locale-de.json';

const languages = {
<<<<<<< HEAD
  en: LOCALE_EN,
  es: LOCALE_ES,
  fr: LOCALE_FR,
  de: LOCALE_DE
=======
  'en': LOCALE_EN,
  'es': LOCALE_ES,
  'fr': LOCALE_FR,
  'de': LOCALE_DE
>>>>>>> CICD/CI_CD
};

const selectedLanguage = languages[JSON.parse(window.localStorage.userProfile).language];

const state = {
  links: [{
    name: 'DASHBOARD',
    icon: 'ba-home',
    route: '/dashboard',
    selected: false
  },
  {
    name: 'DATA_VIEW',
    icon: 'ba-poll-box',
    route: '/dataview',
    selected: false
  },
  {
    name: 'REFERENCE_VIEW',
    icon: 'ba-tune',
    route: '/referenceview',
    selected: false
  },
  {
    name: 'DATA_PROFILER',
    customIcon: '<svg style="width:14px;height:18px" viewBox="0 0 24 24"><image id="Bitmap" x="2" y="-2" width="20" height="20" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABGdBTUEAA1teXP8meAAAA6NJREFUSA21lk1IVUEUx9+zrDT72JSWCPZhEBmi2CLaVItaRa4iqXBRIlEtMjIwaNeuVUkQRCSEUdiH0EYCF1EQLaK0xKggqDRMsbJvy9fvf51zmft8+p5WB37vnDlzzpw7d+bOvHgsA0kkEnHCSqAUyqAO+uACPIMn8Xi8F/1vhIILYT/chS8wkQzQcQO2QdZfVWeAndADU5XbJFSmK65XGBGS5uA4BQciHbHYJ9qd0A3vYSYUwlpY49qoQBR7hNd/3rUnVyoKV8CXNzQaYUWqbPzZsA7OwTfw5XCqnHE+Mpr8LOyrUDQucAIHsRugE0x+YeyYIHzMrQCLdvo0ekZyEr4i0OxOgJYlIvgKQJvRpB9jWSTIGnQsgBcWiW6FcUUVj/+MF1dlY/ia/kJ46cU1+/2hTYA+GZNejKVhZ5JB32ULRO9L6g6b9OnT+u1itfbagKFk4dDM9oSeWKwpzWEw6sX6tucOzFv8djinlqTa2YHSx74cyp1zGN3ibL3WjVADeebLVPPwCWJ1splsYZxw+fQt6hi0TfKYhFeKJKgC1Q6zQDFHYapyjwRNZh6sggJ4CzHN2Gar9lP9OFmBVlGJCqcVHjY7KUjn+Wvnm49eYv0qrAPfZMAMtL9+vz1/SpOi9XQ8RB+H4ETk7Y3g++AS5FPxQFRYT2USroE5MtEUWkjcMdCbaYBFYKIaJuEE5PQ3gM7e6Yj2SjBLlxwsEQ+US3ux86nokLODNe6xBrqMYA0yHdEulkibXYxtk9EyBhsLHRTuQtuTrMbWRS/xX9GYJ7Nf/8G3kjLbpXWx5oM2RBYNrfEd59CurHP2I7S/2Zw7rXpAxCBvLge914tu8+xwVv69uZuk9TzQcwJr4SfYZ+XnJttaz5dQS+539CGwY7IfuxWionWFDjDpwshXFLoKzkKwedAtYBLMiEY+6B4vcTmbsIfBpDFa0WsRUQF+sK62IjeQHswKX8SW6AKocf3hZ4hvM7wDX67TyPPKRU0698Kol/Ece7sfRVv3bSWUQzgYdi40wGdIJTdxhvH+mIFNZz3YdWYDtGPsgmLwZ5dDuxSU0wnpJG3xakZIfl0a9CN0wz24D7rsf8BUJG3xlYzWDF+nMGofsfpLpDWdTK6Ne9XJDrJ1mp2EBzAE/h4Yoa1iWoqDEPxzQc8FzWxC8c/X5JqRNiPoJNO1psF1v9rZ28t3O0A7IsRrI12CyOaMBP2vhopDypn/r5rhuK64/rX60vYH5D1s5B9Q+GkAAAAASUVORK5CYII="></image></svg>',
    route: 'dataprofiler:hello',
    external: true,
    selected: false
  },
  {
    name: 'MATCH_AND_MERGE',
    icon: 'ba-merge',
    route: '/pendingmerges',
    selected: false
  }, {
    name: 'ERROR_REMEDIATION',
    icon: 'ba-alert-octagon',
    route: '/errorremediation',
    selected: false
<<<<<<< HEAD
=======
  }, {
    name: 'REPORTS',
    customIcon: '<svg viewBox="0 0 24 24"><path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M7,20H9V14H7V20M11,20H13V12H11V20M15,20H17V16H15V20Z" /></svg >',
    route: '/reports',
    selected: false
>>>>>>> CICD/CI_CD
  }],
  sideNavOpen: false,
  activeColHeaders: {},
  detailedColHeaders: {}
};

const getters = {
  links: state => state.links,
  sideNavOpen: state => state.sideNavOpen,
  activeColHeaders: state => state.activeColHeaders,
  detailedColHeaders: state => state.detailedColHeaders
};

const actions = {
  openSideNav({
    commit
  }) {
    commit('OPEN_SIDE_NAV');
  },

  closeSideNav({
    commit
  }) {
    commit('CLOSE_SIDE_NAV');
  },

  filterLinks({ commit }, filter) {
    let links = state.links;
    const linksToFilterBy = Object.keys(filter);
    let result = false;
    links = _.filter(links, (l) => {
      const filteredLink = _.find(linksToFilterBy, f => f === l.name);
      if (filteredLink) {
        result = convertToBoolean(filter[filteredLink].enabled);
      }
      return result;
    });
    commit('SET_LINKS', links);
  },

  updateLinks({ commit }, link) {
    commit('UPDATE_LINKS', link);
  },

  setPermissions({ commit }, payload) {
    commit('SET_PERMISSIONS', payload);
  },

  setActiveColHeaders({ commit }, payload) {
    commit('SET_ACTIVE_COL_HEADERS', payload);
  },

  setDetailedColHeaders({ commit }, payload) {
    commit('SET_DETAILED_COL_HEADERS', payload);
  }
};

const mutations = {
  OPEN_SIDE_NAV(state) {
    state.sideNavOpen = true;
  },

  CLOSE_SIDE_NAV(state) {
    state.sideNavOpen = false;
  },

  SET_LINKS(state, links) {
    state.links = links;

    for (const key in state.links) {
      state.links[key].name = selectedLanguage[state.links[key].name];
    }
  },

  UPDATE_LINKS(state, link) {
    let links = state.links;
    links = _.forEach(links, (l) => {
      if (link.includes(l.route)) {
        l.selected = true;
      } else {
        l.selected = false;
      }
    });
  },

  SET_ACTIVE_COL_HEADERS(state, payload) {
    state.activeColHeaders = payload;
  },

  SET_DETAILED_COL_HEADERS(state, payload) {
    state.detailedColHeaders = payload;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
