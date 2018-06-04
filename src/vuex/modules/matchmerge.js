import Vue from 'vue';
import _ from 'lodash';
import moment from 'moment';
import MatchMergeService from '../../services/matchmerge';
import utils from '../../../utils';

const state = {
  updatedSourceId: null,
  updatedMatchedId: null,
  activeMaster: {},
  pendingMerges: [],
  dashboardPendingMerges: [],
  closedMerges: [],
  sourceDocument: {},
  matchedDocuments: [],
  masterDocument: {},
  mergeMessage: '',
  mergeForm: {},
  allowCreate: null,
  allowReject: null,
  changes: {
    attributes: []
  },
  mergeCurrentPage: 1,
  mergePageLimit: 20,
  mergeSearchTerms: null,
  currentState: '',
  matchScores: {}
};

const getters = {
  updatedSourceId: state => state.updatedSourceId,
  updatedMatchedId: state => state.updatedMatchedId,
  activeMaster: state => state.activeMaster,
  pendingMerges: state => state.pendingMerges,
  dashboardPendingMerges: state => state.dashboardPendingMerges,
  closedMerges: state => state.closedMerges,
  sourceDocument: state => state.sourceDocument,
  matchedDocuments: state => state.matchedDocuments,
  masterDocument: state => state.masterDocument,
  mergeMessage: state => state.mergeMessage,
  mergeForm: state => state.mergeForm,
  allowCreate: state => state.allowCreate,
  allowReject: state => state.allowReject,
  changes: state => state.changes,
  mergeCurrentPage: state => state.mergeCurrentPage,
  mergePageLimit: state => state.mergePageLimit,
  mergeSearchTerms: state => state.mergeSearchTerms,
  currentState: state => state.currentState,
  matchScores: state => state.matchScores
};

function filterDocument(pendingMerge) {
  const mDate = moment(pendingMerge.attributes.MATCHDATE, 'YYYYMMDDHHmmssSSS');
  const cDate = moment(pendingMerge.dateCreated, 'YYYYMMDDHHmmssSSS');
  const modDate = moment(pendingMerge.dateModified, 'YYYYMMDDHHmmssSSS');
  const matchData = JSON.parse(pendingMerge.attributes.MATCHDATA);
  const matchScore = _.map(_.values(matchData.MatchScores), score => `${Math.round(score * 100) / 100}%`).join(', ');
  delete pendingMerge.attributes.MATCHDATE;
  return {
    documentId: pendingMerge.documentId,
    repositoryId: pendingMerge.repositoryId,
    userCreated: pendingMerge.userCreated,
    userModified: pendingMerge.userModified,
    dateCreated: cDate.isValid() ? cDate.format('LLL') : pendingMerge.dateCreated,
    dateModified: modDate.isValid() ? modDate.format('LLL') : pendingMerge.dateModified,
    MATCHSCORE: matchScore,
    MATCHDATE: mDate.isValid() ? mDate.format('LLL') : pendingMerge.attributes.MATCHDATE,
    ...pendingMerge.attributes
  };
}

const actions = {
  getPendingMerges({ commit }, payload) {
    return new Promise((resolve, reject) => {
      MatchMergeService.getPendingMerges(payload).then((response) => {
        commit('LOAD_PENDING_MERGES', _.map(response.body.pendingMerges, (pendingMerge) => {
          return filterDocument(pendingMerge);
        }));
        delete response.body.pendingMerges;
        resolve(response.body);
      }, (response) => {
        reject(response);
      });
    });
  },

  getDashboardPendingMerges({ commit }, payload) {
    return new Promise((resolve, reject) => {
      MatchMergeService.getDashboardPendingMerges(payload).then((response) => {
        commit('LOAD_DASHBOARD_PENDING_MERGES', _.map(response.body.pendingMerges, (pendingMerge) => {
          return filterDocument(pendingMerge);
        }));
        delete response.body.pendingMerges;
        resolve(response.body);
      }, (response) => {
        reject(response);
      });
    });
  },

  getClosedMerges({ commit }, payload) {
    return new Promise((resolve, reject) => {
      MatchMergeService.getClosedMerges(payload)
        .then((response) => {
          commit('LOAD_CLOSED_MERGES', _.map(response.body.pendingMerges, (pendingMerge) => {
            return filterDocument(pendingMerge);
          }));
          delete response.body.pendingMerges;
          resolve(response.body);
        }, (response) => {
          reject(response);
        });
    });
  },

  getFilteredMerges({ commit }, payload) {
    return new Promise((resolve, reject) => {
      MatchMergeService.getFilteredMerges(payload).then((response) => {
        commit('LOAD_PENDING_MERGES', _.map(response.body.documents, (pendingMerge) => {
          return filterDocument(pendingMerge);
        }));
        delete response.body.pendingMerges;
        resolve(response.body);
      }, (response) => {
        reject(response);
      });
    });
  },

  updateSourceId({ commit }, id) {
    commit('SET_UPDATED_SOURCE_ID', id);
  },

  updateMatchedId({ commit }, id) {
    commit('SET_UPDATED_MATCHED_ID', id);
  },

  setPreMergeInformation({ commit }, payload) {
    commit('LOAD_SOURCE_DOCUMENT', _.assign(payload.mergeDoc.sourceDocument, { label: payload.sourceLabel }));
    commit('LOAD_MATCHED_DOCUMENTS', payload.mergeDoc.matchedDocuments);
    commit('LOAD_MATCH_SCORE', payload.matchScores);
    commit('SET_MERGE_FORM', payload.mergeDoc.mergeForm);
    commit('SET_ALLOW_CREATE', payload.mergeDoc.allowCreate);
    commit('SET_ALLOW_REJECT', payload.mergeDoc.allowReject);
    commit('SET_MERGE_DOCUMENT', payload.mergeDoc);
  },

  setMergeMessage({ commit }, payload) {
    commit('SET_MERGE_MESSAGE', payload.message);
  },

  setActiveMasterDocument({ commit }, payload) {
    commit('SET_ACTIVE_MASTER_DOCUMENT', payload);
  },

  setDocumentAttribute({ commit }, attribute) {
    commit('ADD_ATTRIBUTE_TO_CHANGES', attribute);
  },

  undoSetDocumentAttribute({ commit }, attribute) {
    commit('REMOVE_ATTRIBUTE_FROM_CHANGES', attribute);
  },

  addNestedDocuments({ state, commit }, payload) {
    commit('ADD_NESTED_DOCUMENT_TO_CHANGES', payload);
  },

  setMergeCurrentPage({ commit }, payload) {
    commit('SET_MERGE_CURRENT_PAGE', payload);
  },

  setMergePageLimit({ commit }, payload) {
    commit('SET_MERGE_PAGE_LIMIT', payload);
  },

  setMergeSearchTerms({ commit }, payload) {
    commit('SET_MERGE_SEARCH_TERMS', payload);
  },

  setCurrentState({ commit }, payload) {
    commit('SET_CURRENT_STATE', payload);
  },

  resetMergeCurrentPage({ commit }) {
    commit('RESET_MERGE_CURRENT_PAGE');
  },

  resetChanges({ commit }) {
    commit('CLEAR_CHANGES');
  }
};

const mutations = {
  SET_UPDATED_SOURCE_ID(state, id) {
    state.updatedSourceId = id;
  },

  SET_UPDATED_MATCHED_ID(state, id) {
    state.updatedMatchedId = id;
  },

  LOAD_PENDING_MERGES(state, pendingMerges) {
    state.pendingMerges = pendingMerges;
  },

  LOAD_DASHBOARD_PENDING_MERGES(state, merges) {
    state.dashboardPendingMerges = merges;
  },

  LOAD_CLOSED_MERGES(state, closedMerges) {
    state.closedMerges = closedMerges;
  },

  LOAD_SOURCE_DOCUMENT(state, sourceDocument) {
    state.sourceDocument = utils.deepMapKeys(sourceDocument, (v, k) => k.toUpperCase());
  },

  LOAD_MATCHED_DOCUMENTS(state, matchedDocuments) {
    state.matchedDocuments = _.map(matchedDocuments, d => utils.deepMapKeys(d, (v, k) => k.toUpperCase()));
  },

  LOAD_MATCH_SCORE(state, matchScores) {
    state.matchScores = matchScores;
  },

  SET_MASTER_DOCUMENT(state, masterDocument) {
    if (Array.isArray(masterDocument)) {
      state.masterDocument = utils.deepMapKeys(masterDocument[0], (v, k) => k.toUpperCase());
    } else {
      state.masterDocument = utils.deepMapKeys(masterDocument, (v, k) => k.toUpperCase());
    }
  },

  SET_ACTIVE_MASTER_DOCUMENT(state, activeMaster) {
    state.activeMaster = activeMaster;
  },

  SET_MERGE_FORM(state, mergeForm) {
    state.mergeForm = mergeForm;
  },

  SET_MERGE_MESSAGE(state, mergeMessage) {
    state.mergeMessage = mergeMessage;
  },

  ADD_ATTRIBUTE_TO_CHANGES(state, attribute) {
    state.changes.attributes.push(attribute);
  },

  REMOVE_ATTRIBUTE_FROM_CHANGES(state, attribute) {
    state.changes.attributes.splice(state.changes.attributes.indexOf(attribute), 1);
  },

  ADD_NESTED_DOCUMENT_TO_CHANGES(state, payload) {
    if (typeof state.changes.nested === 'undefined') {
      state.changes.nested = [];
    }

    state.changes.nested.push({
      name: payload.name,
      insertDocumentIds: payload.documentIds
    });
  },

  SET_ALLOW_CREATE(state, allowCreate) {
    state.allowCreate = allowCreate;
  },

  SET_ALLOW_REJECT(state, allowReject) {
    state.allowReject = allowReject;
  },

  CLEAR_CHANGES(state) {
    state.changes = {
      attributes: []
    };
  },

  SET_MERGE_DOCUMENT(state, doc) {
    state.documentJson = utils.deepMapKeys(doc, (v, k) => k.toUpperCase());
  },

  SET_MERGE_CURRENT_PAGE(state, payload) {
    state.mergeCurrentPage = payload;
  },

  SET_MERGE_PAGE_LIMIT(state, payload) {
    state.mergePageLimit = payload;
  },

  RESET_MERGE_CURRENT_PAGE(state) {
    state.mergeCurrentPage = 1;
  },

  SET_MERGE_SEARCH_TERMS(state, payload) {
    state.mergeSearchTerms = payload.searchTerms;
  },

  SET_CURRENT_STATE(state, payload) {
    state.currentState = payload;
  }

};

export default {
  state,
  getters,
  actions,
  mutations
};
