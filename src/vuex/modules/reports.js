import Vue from 'vue';
import _ from 'lodash';

import RepositoryService from '../../services/repositories';

const state = {
  reportRepositories: [],
  reportDocuments: [],
  reportsPageLimit: 20,
  reportsCurrentPage: 1,
  reportsSearchTerms: null,
  activeReportsRepository: null
};

const getters = {
  reportRepositories: state => state.reportRepositories,
  reportDocuments: state => state.reportDocuments,
  reportsPageLimit: state => state.reportsPageLimit,
  reportsCurrentPage: state => state.reportsCurrentPage,
  reportsSearchTerms: state => state.reportsSearchTerms,
  activeReportsRepository: state => state.activeReportsRepository
};

function filterDocument(document) {
  return {
    documentId: document.documentId,
    repositoryId: document.repositoryId,
    category: document.category,
    ...document.attributes
  };
}

const actions = {
  getReportRepositories({ commit }) {
    return new Promise((resolve, reject) => {
      RepositoryService.getRepositories().then((response) => {
        const reportRepositories = _.filter(response.body.repositories, r => r.repositoryName === 'Merz - DS - Queue' || r.repositoryName === 'Merz - Disposition - Reporting');
        commit('LOAD_REPORT_REPOSITORIES', reportRepositories);
        delete response.body.repositories;
        resolve(response.body);
      }, (response) => {
        reject(response);
      });
    });
  },

  getReportDocuments({ commit }, payload) {
    return new Promise((resolve, reject) => {
      RepositoryService.getDocuments(payload).then((response) => {
        commit('LOAD_REPORT_DOCUMENTS', _.map(response.body.documents, (d) => {
          return filterDocument(d);
        }));
        delete response.body.documents;
        resolve(response.body);
      }, (response) => {
        reject(response);
      });
    });
  },

  setActiveReportsRepository({ commit }, newRepo) {
    commit('SET_ACTIVE_REPORTS_REPOSITORY', newRepo);
  },

  setReportsPageLimit({ commit }, payload) {
    commit('SET_REPORTS_PAGE_LIMIT', payload);
  },

  setReportsCurrentPage({ commit }, payload) {
    commit('SET_REPORTS_CURRENT_PAGE', payload);
  },

  resetReportsCurrentPage({ commit }) {
    commit('RESET_REPORTS_CURRENT_PAGE');
  },

  setReportsSearchTerms({ commit }, payload) {
    commit('SET_REPORTS_SEARCH_TERMS', payload);
  },
};

const mutations = {
  LOAD_REPORT_REPOSITORIES(state, repositories) {
    state.reportRepositories = repositories;
  },

  LOAD_REPORT_DOCUMENTS(state, documents) {
    state.reportDocuments = documents;
  },

  SET_REPORTS_PAGE_LIMIT(state, limit) {
    state.reportsPageLimit = limit;
  },

  SET_REPORTS_CURRENT_PAGE(state, page) {
    state.reportsCurrentPage = page;
  },

  RESET_REPORTS_CURRENT_PAGE(state) {
    state.reportsCurrentPage = 1;
  },

  SET_REPORTS_SEARCH_TERMS(state, payload) {
    state.reportsSearchTerms = payload.searchTerms;
  },

  SET_ACTIVE_REPORTS_REPOSITORY(state, newRepo) {
    state.activeReportsRepository = newRepo;
  },
};

export default {
  state,
  getters,
  actions,
  mutations
};
