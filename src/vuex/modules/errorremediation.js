import Vue from 'vue';
import _ from 'lodash';
import moment from 'moment';
import ErrorRemediationService from '../../services/error';

const state = {
  pendingErrors: [],
  dashboardPendingErrors: [],
  errorCurrentPage: 1,
  errorPageLimit: 20,
  errorInfo: true,
  errorSearchTerms: null
};

const getters = {
  pendingErrors: state => state.pendingErrors,
  dashboardPendingErrors: state => state.dashboardPendingErrors,
  closedErrors: state => state.closedErrors,
  errorCurrentPage: state => state.errorCurrentPage,
  errorPageLimit: state => state.errorPageLimit,
  errorInfo: state => state.errorInfo,
  errorSearchTerms: state => state.errorSearchTerms
};

function filterDocument(doc) {
  const eDate = moment(doc.attributes.ERRORDATE, 'YYYYMMDDHHmmssSSS');
  const sDate = moment(doc.attributes.SOURCELOADDATE, 'YYYYMMDDHHmmssSSS');
  const dateModified = moment(doc.dateModified, 'YYYYMMDDHHmmssSSS');
  const dateCreated = moment(doc.dateCreated, 'YYYYMMDDHHmmssSSS');
  delete doc.attributes.ERRORDATE;
  delete doc.attributes.SOURCELOADDATE;
  return {
    documentId: doc.documentId,
    repositoryId: doc.repositoryId,
<<<<<<< HEAD
    ERRORDATE: eDate.isValid() ? eDate.format('LLL') : doc.attributes.ERRORDATE,
    SOURCELOADDATE: sDate.isValid() ? sDate.format('LLL') : doc.attributes.SOURCELOADDATE,
=======
    userCreated: doc.userCreated,
    userModified: doc.userModified,
    dateModified: dateModified.isValid() ? dateModified.format('LLL') : dateModified,
    dateCreated: dateCreated.isValid() ? dateCreated.format('LLL') : dateCreated,
    ERRORDATE: eDate.isValid() ? eDate.format('LLL') : eDate,
    SOURCELOADDATE: sDate.isValid() ? sDate.format('LLL') : sDate,
>>>>>>> CICD/CI_CD
    ...doc.attributes
  };
}

const actions = {

  getPendingErrors({ commit }, payload) {
    return new Promise((resolve, reject) => {
      ErrorRemediationService.getPendingErrors(payload).then((response) => {
        commit('LOAD_PENDING_ERRORS', _.map(response.body.errors, (doc) => {
          return filterDocument(doc);
        }));
        delete response.body.errors;
        resolve(response.body);
      }, (response) => {
        reject(response);
      });
    });
  },

  getDashboardPendingErrors({ commit }, payload) {
    return new Promise((resolve, reject) => {
      ErrorRemediationService.getDashboardPendingErrors(payload).then((response) => {
        commit('LOAD_DASHBOARD_PENDING_ERRORS', _.map(response.body.errors, (doc) => {
          return filterDocument(doc);
        }));
        delete response.body.errors;
        resolve(response.body);
      }, (response) => {
        reject(response);
      });
    });
  },

  getClosedErrors({ commit }, payload) {
    return new Promise((resolve, reject) => {
      ErrorRemediationService.getClosedErrors(payload).then((response) => {
        commit('LOAD_CLOSED_ERRORS', _.map(response.body.errors, (doc) => {
          return filterDocument(doc);
        }));
        delete response.body.errors;
        resolve(response.body);
      }, (response) => {
        reject(response);
      });
    });
  },

  setErrorCurrentPage({ commit }, payload) {
    commit('SET_ERROR_CURRENT_PAGE', payload);
  },

  setErrorPageLimit({ commit }, payload) {
    commit('SET_ERROR_PAGE_LIMIT', payload);
  },

  setErrorMessages({ commit }, payload) {
    commit('SET_ERROR_INFO', payload);
  },

  setErrorSearchTerms({ commit }, payload) {
    commit('SET_ERROR_SEARCH_TERMS', payload);
  },

  resetErrorCurrentPage({ commit }) {
    commit('RESET_ERROR_CURRENT_PAGE');
  }
};

const mutations = {
  LOAD_PENDING_ERRORS(state, pendingErrors) {
    state.pendingErrors = pendingErrors;
  },

  LOAD_DASHBOARD_PENDING_ERRORS(state, errors) {
    state.dashboardPendingErrors = errors;
  },

  LOAD_CLOSED_ERRORS(state, closedErrors) {
    state.closedErrors = closedErrors;
  },

  SET_ERROR_CURRENT_PAGE(state, payload) {
    state.errorCurrentPage = payload;
  },

  SET_ERROR_PAGE_LIMIT(state, payload) {
    state.errorPageLimit = payload;
  },

  SET_ERROR_INFO(state, payload) {
    state.errorInfo = payload;
  },

  RESET_ERROR_CURRENT_PAGE(state) {
    state.errorCurrentPage = 1;
  },

  SET_ERROR_SEARCH_TERMS(state, payload) {
    state.errorSearchTerms = payload.searchTerms;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
