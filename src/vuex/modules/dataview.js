import Vue from 'vue';
import _ from 'lodash';
import moment from 'moment';
import utils from '../../../utils';
import RepositoryService from '../../services/repositories';
import ErrorRemediationService from '../../services/error';

const documentTypeList = {
  CONTACTS: 'Contact',
  ADDRESSES: 'Address',
  SPECIALTIES: 'Specialty',
  ALTERNATEIDENTIFIERS: 'Alternate Identifier',
  LICENSES: 'Licensure',
  PARTY_ADDRESS: 'EUC_PARTY_ADDR'
};

const state = {
  masterRepositories: [],
  allRepositories: [],
  documents: [],
  activeRepository: null,
  activeDocument: {},
  activeDocumentErrors: null,
  activeDocumentForm: null,
  errorMessage: [],
  remediationChanges: {
    action: '',
    reason: '',
    attributes: {}
  },
  stagedChanges: {},
  newDocument: {},
  documentJson: {},
  edit: false,
  activeStateView: undefined,
  dataCurrentPage: 1,
  dataPageLimit: 20,
  dataSearchTerms: null,
  breadCrumbs: []
};

const getters = {
  masterRepositories: state => state.masterRepositories,
  allRepositories: state => state.allRepositories,
  documents: state => state.documents,
  activeRepository: state => state.activeRepository,
  activeDocument: state => state.activeDocument,
  stagedChanges: state => state.stagedChanges,
  activeDocumentErrors: state => state.activeDocumentErrors,
  errorMessage: state => state.errorMessage,
  activeDocumentForm: state => state.activeDocumentForm,
  remediationChanges: state => state.remediationChanges,
  newDocument: state => state.newDocument,
  documentJson: state => state.documentJson,
  edit: state => state.edit,
  activeStateView: state => state.activeStateView,
  dataCurrentPage: state => state.dataCurrentPage,
  dataPageLimit: state => state.dataPageLimit,
  dataSearchTerms: state => state.dataSearchTerms,
  breadCrumbs: state => state.breadCrumbs
};

function filterDocument(document) {
  const dateCreated = moment(document.dateCreated, 'YYYYMMDDHHmmssSSS');
  const dateModified = moment(document.dateModified, 'YYYYMMDDHHmmssSSS');
  return {
    documentId: document.documentId,
    repositoryId: document.repositoryId,
    dateCreated: dateCreated.isValid() ? dateCreated.format('LLL') : document.dateCreated,
    dateModified: dateModified.isValid() ? dateModified.format('LLL') : document.dateModified,
    userCreated: document.userCreated,
    userModified: document.userModified,
    ...document.attributes
  };
}

const actions = {
  getAllRepositories({ commit }) {
    return new Promise((resolve, reject) => {
      RepositoryService.getRepositories().then((response) => {
        const masterRepo = _.filter(response.body.repositories, r => r.repositoryType === 'master');
        commit('LOAD_MASTER_REPOSITORIES', masterRepo);
        commit('LOAD_REPOSITORIES', response.body.repositories);
        delete response.body.repositories;
        resolve(response.body);
      }, (response) => {
        reject(response);
      });
    });
  },

  addBreadCrumb({ commit }, payload) {
    commit('ADD_BREADCRUMB', payload);
  },

  removeBreadCrumbs({ commit }, index) {
    commit('REMOVE_BREADCRUMBS', index);
  },

  setActiveRepository({ commit }, newRepo) {
    commit('SET_ACTIVE_REPOSITORY', newRepo);
  },

  setActiveStateView({ commit }, view) {
    commit('SET_ACTIVE_VIEW', view);
  },

  getDocuments({ commit }, payload) {
    return new Promise((resolve, reject) => {
      RepositoryService.getDocuments(payload).then((response) => {
        commit('LOAD_DOCUMENTS', _.map(response.body.documents, (d) => {
          return filterDocument(d);
        }));
        delete response.body.documents;
        resolve(response.body);
      }, (response) => {
        reject(response);
      });
    });
  },

  setActiveDocument({ commit }, payload) {
    commit('SET_ACTIVE_DOCUMENT', payload.doc);
  },

  resetActiveDocument({ commit }, payload) {
    commit('RESET_ACTIVE_DOCUMENT', payload);
  },

  setEditStatus({ commit }, payload) {
    commit('SET_EDIT_STATUS', payload);
  },

  setErrorMessage({ commit }, payload) {
    commit('SET_ERROR_MESSAGE', payload);
  },

  resetErrorMessage({ commit }) {
    commit('RESET_ERROR_MESSAGE');
  },

  mergeStagedChanges({ commit }, payload) {
    commit('SET_ACTIVE_DOCUMENT');
  },

  resetStagedChanges({ state, commit }) {
    commit('SET_STAGED_CHANGES_DOCUMENT', state.activeDocument);
  },

  setActiveDocumentValue({ commit }, payload) {
    commit('SET_ACTIVE_DOCUMENT_VALUE', payload);
  },

  stageDocumentValueChange({ commit }, payload) {
    commit('SET_STAGED_CHANGE_VALUE', payload);
    commit('ADD_MERGE_TO_REMEDIATION_CHANGES', payload);
  },

  resetNewDocument({ commit }) {
    commit('RESET_NEW_DOCUMENT');
  },

  setActiveDocumentErrors({ commit }, payload) {
    commit('SET_ACTIVE_DOCUMENT_ERRORS', payload);
  },

  resetActiveDocumentErrors({ commit }) {
    commit('RESET_ACTIVE_DOCUMENT_ERRORS');
    commit('RESET_NEW_DOCUMENT');
  },

  setNewDocumentValue({ commit }, payload) {
    commit('SET_NEW_DOCUMENT_VALUE', payload);
  },

  addNewDocumentToActiveDocument({ state, commit }, payload) {
    // The order of commits here is crucial. Staged changes to be set only after active document is updated.
    commit('ADD_NEW_DOCUMENT_TO_ACTIVE_DOCUMENT', payload);
    commit('ADD_NEW_DOCUMENT_TO_CHANGES', payload.documentType);
    commit('SET_STAGED_CHANGES_DOCUMENT', state.activeDocument);
    commit('RESET_NEW_DOCUMENT');
  },

  removeItemFromActiveDocument({ commit }, payload) {
    commit('ADD_REMOVE_DOCUMENT_TO_CHANGES', payload);
    commit('REMOVE_DOCUMENT_FROM_ACTIVE_DOCUMENT', payload);
    commit('SET_STAGED_CHANGES_DOCUMENT', this.state.DataView.activeDocument);
  },

  setDataCurrentPage({ commit }, payload) {
    commit('SET_DATA_CURRENT_PAGE', payload);
  },

  setDataPageLimit({ commit }, payload) {
    commit('SET_DATA_PAGE_LIMIT', payload);
  },

  setDataSearchTerms({ commit }, payload) {
    commit('SET_DATA_SEARCH_TERMS', payload);
  },

  resetDataCurrentPage({ commit }) {
    commit('RESET_DATA_CURRENT_PAGE');
  }
};

const mutations = {
  ADD_BREADCRUMB(state, payload) {
    state.breadCrumbs.push(payload);
<<<<<<< HEAD
  },

  REMOVE_BREADCRUMBS(state, index) {
    state.breadCrumbs.splice(index);
  },

  LOAD_MASTER_REPOSITORIES(state, repositories) {
    state.masterRepositories = repositories;
=======
>>>>>>> CICD/CI_CD
  },

  REMOVE_BREADCRUMBS(state, index) {
    state.breadCrumbs.splice(index);
  },

  LOAD_MASTER_REPOSITORIES(state, repositories) {
    state.masterRepositories = repositories;
  },

  LOAD_REPOSITORIES(state, repositories) {
    state.allRepositories = repositories;
  },

  SET_ACTIVE_REPOSITORY(state, newRepo) {
    state.activeRepository = newRepo;
  },

  SET_ACTIVE_VIEW(state, view) {
    state.activeStateView = view;
  },

  LOAD_DOCUMENTS(state, documents) {
    state.documents = documents;
  },

  SET_ACTIVE_DOCUMENT(state, doc) {
    if (typeof doc === 'undefined') {
      // This is to avoid two way binding between stagedChanges and activeDocument.
      state.activeDocument = utils.deepMapKeys(state.stagedChanges, (v, k) => k);
      return;
    }

    if (doc.attributes || doc.ATTRUBUTES) {
      state.documentJson = utils.deepMapKeys(doc, (v, k) => k.toUpperCase());
    }
    if (doc.attributes || doc.sourceDocument) {
      if (doc.category === 'Error' || doc.category === 'EUC_PARTY_ERR') {
        state.activeDocument = utils.deepMapKeys(doc.sourceDocument.attributes, (v, k) => k.toUpperCase());
        state.stagedChanges = utils.deepMapKeys(doc.sourceDocument.attributes, (v, k) => k.toUpperCase());
        const error = doc.attributes.ERROR;
        const errorKey = '{';
        if (error && error.indexOf(errorKey) !== -1) {
          state.activeDocumentErrors = utils.deepMapKeys(JSON.parse(doc.attributes.ERROR), (v, k) => k.toUpperCase());
        }
        state.activeDocumentForm = doc.viewForm;
      } else {
        state.activeDocument = utils.deepMapKeys(doc.attributes, (v, k) => k.toUpperCase());
        state.stagedChanges = utils.deepMapKeys(doc.attributes, (v, k) => k.toUpperCase());
        state.activeDocumentForm = doc.form;
      }
    } else {
      state.activeDocument = utils.deepMapKeys(doc, (v, k) => k);
      state.activeDocumentErrors = null;
    }
  },

  RESET_ACTIVE_DOCUMENT(state, payload) {
    state.activeDocument = payload;
  },

  SET_EDIT_STATUS(state, payload) {
    state.edit = payload.edit;
  },

  SET_ERROR_MESSAGE(state, error) {
    if(!state.errorMessage.includes(error)) {
      state.errorMessage.push(error);
    }
  },

  RESET_ERROR_MESSAGE(state) {
      state.errorMessage = [];
  },

  SET_STAGED_CHANGES_DOCUMENT(state, doc) {
    state.stagedChanges = utils.deepMapKeys(doc, (v, k) => k);
  },

  SET_NEW_DOCUMENT_VALUE(state, payload) {
    if (payload.isNested) {
      Vue.set(_.find(state.newDocument[payload.documentType], d => d.DOCUMENTID === payload.documentId).ATTRIBUTES, payload.name, payload.value);
    } else {
      Vue.set(state.newDocument, payload.name, payload.value);
    }
  },

  SET_STAGED_CHANGE_VALUE(state, payload) {
    if (payload.isNested) {
      Vue.set(_.find(state.stagedChanges[payload.documentType], d => d.DOCUMENTID === payload.documentId).ATTRIBUTES, payload.name, payload.value);
    } else {
      Vue.set(state.stagedChanges, payload.name, payload.value);
    }
  },

  ADD_MERGE_TO_REMEDIATION_CHANGES(state, payload) {
    if (!payload.isNested) {
      state.remediationChanges.attributes[payload.name] = payload.value;
    } else {
      if (!state.remediationChanges.attributes[payload.documentType]) {
        state.remediationChanges.attributes[payload.documentType] = [];
      }

      const index = _.findIndex(state.remediationChanges.attributes[payload.documentType], a => a.documentId === payload.documentId);

      if (~index) {
        state.remediationChanges.attributes[payload.documentType][index].attributes[payload.name] = payload.value;
      } else {
        state.remediationChanges.attributes[payload.documentType].push({
          documentId: payload.documentId,
          remediation: 'merge',
          attributes: {
            [payload.name]: payload.value
          }
        });
      }
    }
  },

  RESET_NEW_DOCUMENT(state) {
    state.newDocument = {};
  },

  RESET_ACTIVE_DOCUMENT_ERRORS(state) {
    state.activeDocumentErrors = null;
    state.remediationChanges = {
      action: '',
      reason: '',
      attributes: {}
    };
  },

  SET_ACTIVE_DOCUMENT_ERRORS(state, payload) {
    state.activeDocumentErrors = payload;
  },

  ADD_NEW_DOCUMENT_TO_CHANGES(state, documentType) {
    if (!state.remediationChanges.attributes) {
      state.remediationChanges.attributes = {};
    }

    if (!state.remediationChanges.attributes[documentType]) {
      state.remediationChanges.attributes[documentType] = [];
    }

    let ontology = null;
    ontology = documentTypeList[documentType]

    const attributeId = (ontology.toUpperCase()) + 'ID';

    const newDocId = Date.now().toString();
    let constAttributes = {
      SOURCESYSTEM: state.activeDocument.SOURCESYSTEM,
      SOURCEPARTYID: ontology === 'EUC_PARTY_ADDR'? state.activeDocument.SRC_PARTY_ID: state.activeDocument.SOURCEPARTYID,
      SOURCEURL: 'from UI',
      SOURCELOADDATE: 'from UI',
      ONTOLOGYCATEGORY: ontology,
      [attributeId]: newDocId
    };

    const newAttributes = state.newDocument;

    const attributes = _.merge(constAttributes, newAttributes);

    state.remediationChanges.attributes[documentType].push({
      remediation: 'insert',
      attributes: attributes
    });
  },

  ADD_REMOVE_DOCUMENT_TO_CHANGES(state, payload) {
    if (!state.remediationChanges.attributes) {
      state.remediationChanges.attributes = {};
    }

    if (!state.remediationChanges.attributes[payload.documentType]) {
      state.remediationChanges.attributes[payload.documentType] = [];
    }

    state.remediationChanges.attributes[payload.documentType].push({
      remediation: 'delete',
      documentId: payload.documentId
    });
  },

  ADD_NEW_DOCUMENT_TO_ACTIVE_DOCUMENT(state, payload) {
    if (!state.activeDocument[payload.documentType]) {
      Vue.set(state.activeDocument, payload.documentType, []);
    }
    let attrRepositoryId;
    let repositoryId;
    let category;

    if(payload.documentType === 'PARTY_ADDRESS') {
      attrRepositoryId = 1542406;
      category = documentTypeList[payload.documentType];
    } else {
      repositoryId = _.find(state.allRepositories, (r) => {
        return r.repositoryName === 'Merz - Master - '+ documentTypeList[payload.documentType];
      });
      attrRepositoryId = repositoryId.repositoryId;
      category = documentTypeList[payload.documentType]
    }

    state.activeDocument[payload.documentType].push({
      ATTRIBUTES: state.newDocument,
      REPOSITORYID: attrRepositoryId,
      CATEGORY: category,
      DOCUMENTID: payload.randomDocId,
      DOCUMENTTYPE: payload.documentType,
      CREATEDBYUSER: true
    });
  },

  REMOVE_DOCUMENT_FROM_ACTIVE_DOCUMENT(state, payload) {
    if (state.activeDocument[payload.documentType]) {
      state.activeDocument[payload.documentType].splice(_.findIndex(state.activeDocument[payload.documentType], d => d.DOCUMENTID === payload.documentId), 1);
    }
  },

  SET_DATA_CURRENT_PAGE(state, payload) {
    state.dataCurrentPage = payload;
  },

  RESET_DATA_CURRENT_PAGE(state) {
    state.dataCurrentPage = 1;
  },

  SET_DATA_PAGE_LIMIT(state, payload) {
    state.dataPageLimit = payload;
  },

  SET_DATA_SEARCH_TERMS(state, payload) {
    state.dataSearchTerms = payload.searchTerms;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};