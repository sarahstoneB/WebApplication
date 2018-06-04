import Vue from 'vue';
import _ from 'lodash';

import RepositoryService from '../../services/repositories';

const state = {
  referenceRepositories: [],
  referenceDocuments: [],
  activeReferenceDocument: {},
  activeReferenceDocumentForm: null,
  referenceChanges: {
    action: '',
    reason: '',
    attributes: {}
  },
  stagedReferenceChanges: {},
  newReferenceDocument: {},
<<<<<<< HEAD
  referenceDocumentJson: {}
=======
  referenceDocumentJson: {},
  referenceSearchTerms: null,
  activeReferenceRepository: null
>>>>>>> CICD/CI_CD
};

const getters = {
  referenceRepositories: state => state.referenceRepositories,
  referenceDocuments: state => state.referenceDocuments,
  activeReferenceDocument: state => state.activeReferenceDocument,
  stagedReferenceChanges: state => state.stagedReferenceChanges,
  activeReferenceDocumentForm: state => state.activeReferenceDocumentForm,
  referenceChanges: state => state.referenceChanges,
  newReferenceDocument: state => state.newReferenceDocument,
<<<<<<< HEAD
  referenceDocumentJson: state => state.referenceDocumentJson
=======
  referenceDocumentJson: state => state.referenceDocumentJson,
  referenceSearchTerms: state => state.referenceSearchTerms,
  activeReferenceRepository: state => state.activeReferenceRepository
>>>>>>> CICD/CI_CD
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
  getReferenceRepositories({ commit }) {
    return new Promise((resolve, reject) => {
      RepositoryService.getRepositories().then((response) => {
        const referenceRepo = _.filter(response.body.repositories, r => r.repositoryType === 'reference');
        commit('LOAD_REFERENCE_REPOSITORIES', referenceRepo);
        delete response.body.repositories;
        resolve(response.body);
      }, (response) => {
        reject(response);
      });
    });
  },

  getReferenceDocuments({ commit }, payload) {
    return new Promise((resolve, reject) => {
      RepositoryService.getDocuments(payload).then((response) => {
        commit('LOAD_REFERENCE_DOCUMENTS', _.map(response.body.documents, (d) => {
          return filterDocument(d);
        }));
        delete response.body.documents;
        resolve(response.body);
      }, (response) => {
        reject(response);
      });
    });
  },

  setActiveReferenceDocument({ commit }, payload) {
    commit('SET_ACTIVE_REFERENCE_DOCUMENT', payload);
<<<<<<< HEAD
=======
  },

  setReferenceSearchTerms({ commit }, payload) {
    commit('SET_REFERENCE_SEARCH_TERMS', payload);
  },

  setActiveReferenceRepository({ commit }, newRepo) {
    commit('SET_ACTIVE_REFERENCE_REPOSITORY', newRepo);
>>>>>>> CICD/CI_CD
  }
};

const mutations = {
  LOAD_REFERENCE_REPOSITORIES(state, repositories) {
    state.referenceRepositories = repositories;
  },

  LOAD_REFERENCE_DOCUMENTS(state, documents) {
    state.referenceDocuments = documents;
  },

  SET_ACTIVE_REFERENCE_DOCUMENT(state, payload) {
    state.activeReferenceDocument = payload;
<<<<<<< HEAD
=======
  },

  SET_REFERENCE_SEARCH_TERMS(state, payload) {
    state.referenceSearchTerms = payload.searchTerms;
  },

  SET_ACTIVE_REFERENCE_REPOSITORY(state, newRepo) {
    state.activeReferenceRepository = newRepo;
>>>>>>> CICD/CI_CD
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
