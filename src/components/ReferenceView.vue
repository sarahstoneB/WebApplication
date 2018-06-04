<template>
  <div>
    <ba-toolbar ref="refviewToolbar" :class="[{editMode, 'reference-toolBar' : !editMode}]" :showSideNavIcons="true" @open="minimizeTable" @close="maximizeTable" :side-nav-start-open="sideNavOpen" :links="links" sticky>
      <span id="referenceView" slot="page-name">{{ 'REFERENCE_VIEW' | translate }}</span>
      <div :class="['search-input',{'search-input-minimized' : !maximized}]">
<<<<<<< HEAD
        <ba-input id="referenceViewSearch" class="search" v-model="searchTerms" :disabled="editMode || activeRepository === null" :placeholder="editMode ? $t('DISABLED_EDIT_MODE') : $t('SEARCH')"></ba-input>
=======
        <ba-input id="referenceViewSearch" class="search" v-model="searchTerms" :disabled="editMode || activeReferenceRepository === null" :placeholder="editMode ? $t('DISABLED_EDIT_MODE') : $t('SEARCH')"></ba-input>
>>>>>>> CICD/CI_CD
      </div>
      <div class="spacer">
        <div class="filter">
          <span>
            <span class="description" v-ba-tooltip="$t('FILTERS')" @click="openModal('filterModal')" v-if="filterCount > 0">
              <div class="filter-count">!</div>
              <svg style="width:18px;height:18px" viewBox="0 0 24 24">
                <path fill="#D53B31" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
              </svg>
            </span>
            <div style="display: table" v-ba-tooltip="editMode ? $t('DISABLED_EDIT_MODE') : $t('FILTERS')">
              <svg :style="editMode ? 'pointer-events: none' : ''"  @click="openModal('filterModal')" class="filter-icon" style="padding:5px;height:22px;max-width: 2em;" viewBox="0 0 24 24">
                <path :fill="editMode ? '#BACBCB' : '#FFFFFF'" d="M3,2H21V2H21V4H20.92L14,10.92V22.91L10,18.91V10.91L3.09,4H3V2Z" />
              </svg>
            </div>
          </span>
        </div>
      </div>
      <div>
        <div class="repo-label">
          <span>{{ repoTypes[0].name }}</span>
        </div>
      </div>
      <div class="repo-screen-name">
        <div v-if="repoOptions.length > 2" class="repos">
          <ba-select :disabled="editMode" v-model="selectedRecord" :options="repoOptions" @change="updateRepo" search></ba-select>
        </div>
        <div v-else class="repo-label repo-name">
          <span>{{ repoOptions[1] ? repoOptions[1].name : 'Loading Repo Name...' }}</span>
        </div>
      </div>
      <div>
        <div class="icon-toolbar">
          <span v-ba-tooltip="$t('CREATE')" v-if="features.actions.create">
            <i class="ba-icon ba-plus-circle"></i>
          </span>
          <span v-ba-tooltip="editMode ? $t('DISABLED_EDIT_MODE') : $t('COLUMN_CONFIGURATIONS')">
            <svg :style="editMode ? 'pointer-events: none' : ''" class="settings-icon" @click="customizeColumns" style="padding:5px;height:22px;max-width: 2em;" viewBox="0 0 24 24">
              <path :fill="editMode ? '#BACBCB' : '#FFFFFF'" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
            </svg>
          </span>
        </div>
      </div>
    </ba-toolbar>
    <div :class="['spinner-wrapper', { maximized }]" v-if="showSpinner">
      <ba-spinner v-if="showSpinner" :indeterminate="true" :progress="40" :size="50" class="spinner"></ba-spinner>
    </div>
    <div :class="['partitions', { maximized },{'on-edit-mode': !editMode}]">
      <div class="edit-toolbar" v-if="editMode">
        <div class="title">{{ 'EDIT_MODE' | translate }}</div>
        <div class="spacerx2"></div>
        <div class="toolbar-items">
          <div class="exit-icon" v-ba-tooltip="$t('CANCEL')" @click="removeRowEdit(true)">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="#000000" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </div>
          <div class="undo-icon" v-ba-tooltip="$t('UNDO')" @click="undoChanges">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                <path fill="#000000" d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z" />
            </svg>
          </div>
          <div class="delete-icon" v-ba-tooltip="$t('DELETE')" v-if="features.actions.delete">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="#000000" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
            </svg>
          </div>
          <div class="save-icon" v-ba-tooltip="$t('SAVE')" @click="saveChanges" v-if="features.actions.save">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="#000000" d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" />
            </svg>
          </div>
          <div class="vertical-dots-icon" v-ba-tooltip="$t('MORE')" v-if="false">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="#000000" d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
            </svg>
          </div>
        </div>
      </div>
      <div :class="['empty-records', { maximized }]">
<<<<<<< HEAD
        <h4 class="empty-wrapper" v-if="!loading && (activeRepository !== null)">{{ 'NO_RECORDS_FOUND' | translate }}</h4>
        <h4 class="empty-wrapper" v-if="activeRepository === null && referenceRepositories.length > 0">{{ 'REPO_SELECT' | translate }}</h4>
      </div>
      <ba-data-table :class="['data-table', { 'actions-disabled': editMode }]" v-show="!showSpinner && activeRepository !== null"
=======
        <h4 class="empty-wrapper" v-if="!loading && (activeReferenceRepository !== null)">{{ 'NO_RECORDS_FOUND' | translate }}</h4>
        <h4 class="empty-wrapper" v-if="activeReferenceRepository === null && referenceRepositories.length > 0">{{ 'REPO_SELECT' | translate }}</h4>
      </div>
      <ba-data-table :class="['data-table', { 'actions-disabled': editMode }]" v-show="!showSpinner && activeReferenceRepository !== null"
>>>>>>> CICD/CI_CD
                      id="editableDataTable"
                     ref="dataTable"
                     :loading="loading"
                     :table-data="referenceDocuments"
                     :table-data-length="dataLength"
                     :custom-headers="customHeaders"
                     :paginationChoices="paginationChoices"
                     :menuWidth="97"
                     :menuHeight="135"
                     :paginated="!editMode"
                     @pageChange="changePage"
                     @limitChange="setPageLimit"
                     @rowDblClicked="setSelectedRow"
                     @rowClicked="setSelectedRow"
                     @sorted="sort"
                     @columnSort="handleNewColumnConfig"
                     clickable
                     use-api
                     fixed-pagination
                     sticky-header>
        <template scope="field">
          <div id="field" class="table-data" @paste="handleClipboardEvents" @focus="focus" @blur="removeFocus" @keydown="handleKeyEvents" @click="initRowEdit">{{ field.value }}</div>
        </template>
        <span id="rowPerPage" slot="row-per-page">{{ 'ROWS_PER_PAGE' | translate }}</span>
      </ba-data-table>
    </div>
    <ba-toast ref="errorToast" position="top">
      <i class="ba-icon ba-alert-circle" slot="icon"></i>
      <div v-if="generalErrors.length === 1" slot="body">{{ generalErrors[0] }}</div>
        <div v-else slot="body">{{ "FOLLOWING_ERRORS" | translate }} {{ action }} {{ "ON_DOCUMENT" | translate }} {{ documentId }}.
          <ol slot="body">
            <li v-for="error in generalErrors">
              {{ error }}
            </li>
          </ol>
        </div>
    </ba-toast>
    <ba-toast ref="successToast" position="top">
      <i class="ba-icon ba-check" slot="icon"></i>
      <span slot="body">{{ activeReferenceDocument.documentId }}  {{ 'HAS_BEEN' | translate }}  {{ 'UPDATED'  | translate  }}</span>
    </ba-toast>
    <column-configurator @tableHeaders="tableHeaders" ref="columnConfig" :user="user" :activeRepo="activeRepo"></column-configurator>

    <!-- Confirmation Popups -->
    <ba-modal ref="confirmNavigatePopup" size="sm" :header="false" footer>
      <span slot="body">
        <div class="modal-heading">{{ 'HAVE_UNSAVED_CHANGES' | translate }}</div>
        <div class="modal-content">{{ 'CLOSE_WITHOUT_SAVING' | translate }}</div>
      </span>
      <div slot="buttons">
        <ba-button @click="closeModal('confirmNavigatePopup')" class="ba-default flat">{{ 'CANCEL' | translate }}</ba-button>
        <ba-button @click="discardAndNavigate" class="ba-primary">{{ 'DISCARD' | translate }}</ba-button>
      </div>
    </ba-modal>

<<<<<<< HEAD
    <ba-modal ref="popup" size="sm" :header="false" footer>
=======
    <ba-modal ref="refreshPopup" size="sm" :header="false" footer>
>>>>>>> CICD/CI_CD
      <span slot="body">
        <div class="modal-heading">{{ 'DOCUMENT_CHANGED' | translate }}</div>
        <div class="modal-content">{{ 'LIKE_TO_REFRESH' | translate }}</div>
      </span>
      <div slot="buttons">
<<<<<<< HEAD
        <ba-button @click="closeModal('popup')" class="ba-default flat">{{ 'CANCEL' | translate }}</ba-button>
=======
        <ba-button @click="closeModal('refreshPopup')" class="ba-default flat">{{ 'CANCEL' | translate }}</ba-button>
>>>>>>> CICD/CI_CD
        <ba-button @click="refreshRepo" class="ba-primary">{{ 'REFRESH' | translate }}</ba-button>
      </div>
    </ba-modal>

    <!-- Filter Modal -->
    <ba-modal ref="filterModal" class="filter-modal" size="lg" footer>
      <span slot="header">{{ 'ADVANCED_SEARCH' | translate }}</span>
      <span slot="body">
        <advanced-filter ref="filter" useSession :sessionKey="'dataview'" :filterData="filterObject" @enter="applyFilter()" @filterEnabled="enableFilter()" @filterDisabled="disableFilter()" @filterRemoved="applyFilter"></advanced-filter>
      </span>
      <div slot="buttons">
        <ba-button class="ba-default flat" @click="closeModal('filterModal')">{{ 'CANCEL' | translate }}</ba-button>
        <ba-button @click="applyFilter" :disabled="validData" :class="['ba-primary', { 'access-filter' : validData }]">Apply Filter</ba-button>
      </div>
    </ba-modal>
  </div>
</template>

<script>
import _ from 'lodash';
import convertToBoolean from 'yn';
import { mapGetters, mapActions } from 'vuex';

import dataTable from './mixins/dataTable';
import loader from './mixins/loader';
import sideNav from './mixins/sideNav';
import repoHeaders from './mixins/repoHeaders';
import filter from './mixins/filter';
import RepositoryService from '../services/repositories';

import ProfileColumn from './ProfileColumn';
import AdvancedFilter from './AdvancedFilter';
import ColumnConfigurator from './ColumnConfigurator';

export default {
  mixins: [dataTable, sideNav, repoHeaders, filter, loader],

  components: {
    ProfileColumn,
    AdvancedFilter,
    ColumnConfigurator
  },

  data() {
    return {
      isNumeric: false,
      repoType: 'referenceRepositories',
      customTableHeaders: [],
      selectedColumnName: null,
      selectedRow: {},
      editedRowData: {},
      showSpinner: false,
      selectedRecord: '',
      editMode: false,
      activeRow: [],
      action: '',
      generalErrors: [],
      searchTerms: null,
      maxTextLength: 250,
      user: JSON.parse(atob(this.$cookie.get('user'))),
      features: this.$root.features ? this.$root.features[this.$route.name] : {},
      defaultRepositoryID: null,
      routeToMove: null
    };
  },

  beforeRouteLeave (to, from, next) {
    if (this.editMode) {
      next(false);
      this.routeToMove = to;
      this.openModal('confirmNavigatePopup');
    } else {
      next();
    }
  },

  mounted() {
<<<<<<< HEAD
    this.searchTerms = this.dataSearchTerms;
    this.setActiveRepository(this.defaultRepositoryID);
=======
    this.setActiveReferenceRepository(this.defaultRepositoryID);
    this.showSpinner = true;
    if (this.activeReferenceRepository == null) {
      this.searchTerms = null
      this.setReferenceSearchTerms(this.searchTerms);
    } else {
      this.searchTerms = this.referenceSearchTerms;
    }
>>>>>>> CICD/CI_CD
  },

  computed: {
    activeRepo: {
      get() {
        this.showSpinner = true;
<<<<<<< HEAD
        if (this.activeRepository === null) {
          this.showSpinner = false;
        }
        this.customTableHeaders = [];
        return this.activeRepository;
=======
        if (this.activeReferenceRepository === null) {
          this.showSpinner = false;
        }
        this.customTableHeaders = [];
        return this.activeReferenceRepository;
>>>>>>> CICD/CI_CD
      }
    },

    repoTypes() {
      return [{
        name: this.$t('REFERENCE'),
        value: 'referenceRepositories'
      }];
    },

    loading() {
      let loading;
<<<<<<< HEAD
      if (this.activeRepository === null) {
=======
      if (this.activeReferenceRepository === null) {
>>>>>>> CICD/CI_CD
        loading = false;
      } else {
        loading = (this.referenceDocuments.length !== 0);
      }
      return loading;
    },

    repoOptions() {
<<<<<<< HEAD
      if (this.activeRepository === null) {
=======
      if (this.activeReferenceRepository === null) {
>>>>>>> CICD/CI_CD
        this.showSpinner = false;
      }
      return [{
        name: this.$t('CHOOSE_A_REPOSITORY'),
        value: ''
      }].concat(
        _.map(this[this.repoType], (r) => {
          return {
            name: `${r.repositoryDisplayName ? r.repositoryDisplayName : r.repositoryName} - [${r.repositoryId}]`,
            value: r.repositoryId
          };
        })
      );
    },

    ...mapGetters([
      'referenceRepositories',
      'activeColHeaders',
      'detailedColHeaders',
      'referenceDocuments',
<<<<<<< HEAD
      'activeRepository',
      'links',
      'dataSearchTerms',
=======
      'activeReferenceRepository',
      'links',
      'referenceSearchTerms',
>>>>>>> CICD/CI_CD
      'activeReferenceDocument'
    ])
  },

  created() {
    this.updateLinks(this.$router.currentRoute.path);
<<<<<<< HEAD
    this.setActiveRepo((this.activeRepository) ? this.activeRepository : this.defaultRepositoryID);
=======
    this.setActiveRepo((this.activeReferenceRepository) ? this.activeReferenceRepository : this.defaultRepositoryID);
>>>>>>> CICD/CI_CD
    this.fetchRepositories();
    this.showSpinner = false;
  },

  methods: {
    refreshRepo() {
<<<<<<< HEAD
      this.closeModal('popup');
=======
      this.closeModal('refreshPopup');
>>>>>>> CICD/CI_CD
      this.fetchDocuments();
    },

    undoChanges() {
      document.execCommand('undo');
    },

    discardAndNavigate() {
      this.closeModal('confirmNavigatePopup');
      this.removeRowEdit(true);
      if (this.routeToMove !== null) {
        this.$router.push(this.routeToMove.path);
      }
    },

    handleKeyEvents(event) {
      if (event.ctrlKey && event.keyCode === 13) {
        this.saveChanges();
      } else if (event.keyCode === 27) {
        this.removeRowEdit(true);
      } else if (event.target.innerText.length >= this.maxTextLength && !this.isAllowedKeyCode(event)) {
        event.preventDefault();
      }
    },

    handleClipboardEvents(event) {
      let existingTextLength = event.target.innerText.length;
      // IE
      if (window.clipboardData) {
        if (window.clipboardData.getData("Text").length + existingTextLength > this.maxTextLength) {
          event.preventDefault();
        }
      }
      // Chrome , Firefox
      if (event.clipboardData) {
        if (event.clipboardData.getData("Text").length + existingTextLength > this.maxTextLength) {
          event.preventDefault();
        }
      }
    },

    isAllowedKeyCode(event) {
      return (event.keyCode === 8 ||
              event.keyCode === 38 ||
              event.keyCode === 39 ||
              event.keyCode === 37 ||
              event.keyCode === 40 ||
              event.keyCode === 46 ||
              event.ctrlKey ||
              event.metaKey);
    },

    removeRowEdit(resetChanges) {
      let activeRowData = this.selectedRow;
      if (this.activeRow.length > 0) {
        this.activeRow.forEach((node) => {
          let childNode = node.children[0];
          node.style.backgroundColor = '';
          node.style.cursor = 'pointer';

          if (childNode) {
            childNode.contentEditable = false;
            childNode.classList.remove('edit-mode');
          }

          if (Object.keys(activeRowData).length > 0 && resetChanges && node.cellIndex > 0) {
            let activeColumn = this.customTableHeaders[node.cellIndex - 1];
            childNode.innerText = activeRowData[activeColumn] ? activeRowData[activeColumn] : '';
          }
        })
        this.selectedRow = {};
        this.editMode = false;
      }
    },

    populateErrorToast(errorObject) {
      let result = [];
      _.forOwn(errorObject, (value, key) => {
        result.push(key + ':  ' + value);
      })
      return result;
    },

    saveChanges() {
      this.activeRow.forEach((node) => {
        if (this.isEditableColumn(node.cellIndex) === true) {
          let childNode = node.children[0];
          let key = this.customTableHeaders[node.cellIndex - 1];
          let text = childNode ? childNode.innerText : '';
          if (key) {
            _.set(this.editedRowData, key, text);
          }
        }
      });
      this.showSpinner = true;
      this.action = 'store';
      this.generalErrors = [];
      let activeDoc = _.cloneDeep(this.activeReferenceDocument);
      activeDoc.attributes = this.editedRowData;
      RepositoryService.updateDocument({
        repoId: this.selectedRow.repositoryId,
        docId: this.selectedRow.documentId,
        action: 'store'
      }, activeDoc).then((data) => {
        this.editedRowData = {};
        this.$refs.successToast.toggle();
        setTimeout(() => {
          this.removeRowEdit();
          this.fetchDocuments();
        }, 1000);
       }, (error) => {
        this.showSpinner = false;
        if (error.body.validation.attributeErrors) {
          this.generalErrors = this.populateErrorToast(error.body.validation.attributeErrors);
          this.$refs.errorToast.toggle();
        } else if (error.body.validation.generalErrors) {
          this.generalErrors = this.populateErrorToast(error.body.validation.generalErrors);
          this.$refs.errorToast.toggle();
        } else {
          this.generalErrors.push(this.$t('UNABLE_SAVE'));
          this.$refs.errorToast.toggle();
        }
      })
    },

    isEditableColumn(cellIndex) {
      let activeColumn = {};
      let columnName = this.customTableHeaders[cellIndex - 1];
      if (this.activeColHeaders.container && cellIndex !== 0) {
        activeColumn = _.find(this.activeColHeaders.container.contents, (column)  => {
          return column.name === columnName;
        });
      }
      return !activeColumn.readOnly;
    },

    focus(event) {
      let $el = event.target;
      if (['true', 'plaintext-only'].includes($el.contentEditable)) { // Because focus works differently in IE.
        $el.classList.add('edit-mode');
      }
    },

    initRowEdit(event) {
      let result = [];
      let $el = event.target;
      let node = $el.parentNode.parentNode.firstChild; //td

      if (Object.keys(this.selectedRow).length === 0 && this.features.actions.edit) {
        while (node && node.nodeType === Node.ELEMENT_NODE && node !== $el) {
          let childNode = node.children[0];
          result.push(node);
          node.style.backgroundColor = '#E5E9E9';
          if (this.isEditableColumn(node.cellIndex) === true && childNode) {
            childNode.contentEditable = !!window.chrome ? 'plaintext-only' : true; // To enable text copy/paste in chrome.
            if ($el.parentElement.cellIndex === node.cellIndex) { //For IE
              childNode.classList.add('edit-mode');
            }
          } else {
            node.style.cursor = 'not-allowed';
          }
          node = node.nextElementSibling || node.nextSibling;
        }
        this.activeRow = result;
      }
    },

    removeFocus(event) {
      event.target.classList.remove('edit-mode');
    },

    setEdit(rowData) {
      this.generalErrors = [];
      RepositoryService.lockDocument({
        repoId: rowData.repositoryId,
        docId: rowData.documentId
      }, {}).then((response) => {
        if (response.status === 200) {
          if (this.hasSameValues(response.body.attributes, rowData)) {
            this.setActiveReferenceDocument(response.body);
            this.editMode = true;
          } else {
            this.removeRowEdit();
<<<<<<< HEAD
            this.openModal('popup');
=======
            this.openModal('refreshPopup');
>>>>>>> CICD/CI_CD
          }
        } else if (response.status === 409) {
          this.generalErrors.push(this.$t('UNABLE_OBTAIN_LOCK'));
          this.removeRowEdit();
          this.$refs.errorToast.toggle();
        }
      }, (error) => {
        this.generalErrors.push(this.$t('UNABLE_OBTAIN_LOCK'));
        this.removeRowEdit();
        this.$refs.errorToast.toggle();
      })
    },

    openModal(ref) {
      this.$refs[ref].open();
    },

    closeModal(ref) {
      this.$refs[ref].close();
    },

    hasSameValues(objectOne, objectTwo) {
      let result = '';
      _.forOwn(objectOne, (value, key) => {
        if (objectTwo[key]) {
          result = (value === objectTwo[key]) ? result.concat('1') : result.concat('0');
        }
      })
      return !result.includes('0') && result !== '';
    },

    getViewForms(repoId) {
      this.tableHeaders();
    },

    updateRepo(value) {
      if (value !== '') {
<<<<<<< HEAD
        this.setActiveRepository(value);
        this.getViewForms(value);
      } else {
        this.setActiveRepository(this.defaultRepositoryID);
=======
        this.setActiveReferenceRepository(value);
        this.getViewForms(value);
      } else {
        this.setActiveReferenceRepository(this.defaultRepositoryID);
>>>>>>> CICD/CI_CD
      }
    },

    applyFilter() {
      this.showSpinner = true;
      this.resetDataCurrentPage();
      this.fetchDocuments();
      this.closeModal('filterModal');
    },

    tableHeaders() {
      this.showSpinner = true;
      const name = `${this.user.first}_${this.user.last}`;
      const form = this.$root.appDeployEnvName;
<<<<<<< HEAD
      const id = this.activeRepository;
=======
      const id = this.activeReferenceRepository;
>>>>>>> CICD/CI_CD
      this.showSpinner = true;
      this.repoHeaders(name, id, `${this.$root.locale.toUpperCase()}`).then((response) => {
        let sortedField = {
          'field': response[0],
          'direction': 'asc'
        }
        this.customTableHeaders = response;
        this.setSortedFields(response);
        this.getAllColumnHeaders();
        this.filterObject = this.getFilterAttributes(this.customHeaders);
        this.$refs.dataTable.sorted = sortedField;
        this.constructSortQuery(sortedField.field, sortedField.direction);
        this.fetchDocuments();
      });
    },

    getAllColumnHeaders() {
<<<<<<< HEAD
      const repositoryId = this.activeRepository;
=======
      const repositoryId = this.activeReferenceRepository;
>>>>>>> CICD/CI_CD
      this.getAllColHeaderDetails(repositoryId).then((response) => {
        let colHeaders = _.cloneDeep(response);
        let availColHeaders = _.cloneDeep(response);
        let allHeaders = response.container.contents;
        colHeaders.container.contents = _.flatten(_.map(this.customTableHeaders, (th) => {
          let active = _.remove(allHeaders, (h) => {
            return h.name === th;
          });
          return active;
        }));
        availColHeaders.container.contents = _.uniqBy(allHeaders, 'name');
        this.setActiveColHeaders(colHeaders);
        this.setDetailedColHeaders(availColHeaders);
        this.showSpinner = false;
      });
    },

    fetchRepositories() {
      this.getReferenceRepositories();
    },

    fetchDocuments() {
      this.$nextTick(() => {
        this.showSpinner = true;
        let payload = {
<<<<<<< HEAD
          repoId: this.activeRepository,
=======
          repoId: this.activeReferenceRepository,
>>>>>>> CICD/CI_CD
          pageSize: this.dataPageLimit,
          pageNumber: this.dataCurrentPage,
          search: this.searchTerms ? this.searchTerms : undefined,
          sort: this.sortQuery ? this.sortQuery : undefined,
        }
        this.addFilterQueryParams(payload);
        this.getReferenceDocuments(payload).then((response) => {
          this.showSpinner = false;
          this.dataLength = response.count;
        }, (error) => {
          console.log(error);
        });
      });
    },

    sort(headerDetails) {
      if (this.customTableHeaders.includes(headerDetails.field)) {
        this.constructSortQuery(headerDetails.field, headerDetails.direction);
        this.fetchDocuments();
      }
    },

    setActiveRepo(_id) {
<<<<<<< HEAD
      this.setActiveRepository(_id);
=======
      this.setActiveReferenceRepository(_id);
>>>>>>> CICD/CI_CD
    },

    setSelectedColumn(columnName) {
      this.selectedColumnName = columnName;
    },

    setSelectedRow(row) {
      if (!this.editMode && this.features.actions.edit) {
        this.setEdit(row.data);
        this.selectedRow = row.data;
        this.editedRowData = _.cloneDeep(row.data);
      }
    },

    customizeColumns() {
      this.$refs.columnConfig.open();
    },

    handleNewColumnConfig(columnConfig) {
      this.$refs.columnConfig.handleNewColumnConfig(columnConfig);
    },

    setPageLimit(limit) {
      this.removeRowEdit();
      this.setDataPageLimit(limit);
    },

    changePage(pageNumber) {
      this.removeRowEdit();
      this.setDataCurrentPage(pageNumber);
    },

    ...mapActions([
<<<<<<< HEAD
      'setActiveRepository',
=======
      'setActiveReferenceRepository',
>>>>>>> CICD/CI_CD
      'setActiveColHeaders',
      'setDetailedColHeaders',
      'getReferenceRepositories',
      'getReferenceDocuments',
      'setActiveReferenceDocument',
      'setDataCurrentPage',
      'setDataPageLimit',
      'resetDataCurrentPage',
<<<<<<< HEAD
      'setDataSearchTerms',
=======
      'setReferenceSearchTerms',
>>>>>>> CICD/CI_CD
      'updateLinks'
    ])
  },

  watch: {
    searchTerms(newValue, oldValue) {
      if (oldValue != null) {
        this.resetDataCurrentPage();
      }
<<<<<<< HEAD
      this.setDataSearchTerms({ searchTerms: newValue });
=======
      this.setReferenceSearchTerms({ searchTerms: newValue });
>>>>>>> CICD/CI_CD
      this.showSpinner = true;
      this.fetchDocuments();
    }
  }
};
</script>

<style lang="less">
#refviewToolbar,
.editMode {
  .ba-select-input {
    .selection {
      color: #BACBCB;
    }
    border-bottom: 1px dotted #BACBCB;
  }
}

.repos {
  &:first-child {
    .floating:first-child {
      right: auto;
    }
  }

  &:last-child {
    .floating:last-child {
      left: auto;
    }
  }

  .ba-select {
    margin-bottom: -10px;
  }
}

.ba-select-search input {
  color: #263445 !important;
}

#dataTable,
.data-table {
  table {
    .td {
      padding: 0;
    }
  }

  &.actions-disabled {
    thead {
      pointer-events: none;
    }
  }
}

#filter-modal,
.filter-modal {
  .ba-content {
    height: ~"calc(100vh - 350px)";
    overflow-y: auto;
  }
}
</style>

<style lang="less" scoped>
.title {
  font-weight: 600;
}
.spacer {
  flex: 0.5;
}

.spacerx2 {
  flex: 1;
}

.repo-label {
  margin-top: 18px;
  margin-left: 4em;
  margin-right: 20px;
  letter-spacing: .5px;
  color: #FFF;
  &.repo-name {
    min-width: 205px;
  }
}

.options {
  display: flex;
  flex-grow: 1;
  justify-content: space-around;
}

.option {
  color: #35495E;
  padding: 6px 24px;
  cursor: pointer;
  svg {
    transform: translateY(25%);
  }
}

.repos {
  flex: 2;
  margin-right: 20px;
  min-width: 200px;
}

.icon-toolbar {
  padding: 8px 15px 0 0;
  font-size: 24px;
  color: #E5E9E9;
  cursor: pointer;
}

.search-input {
  width: 25rem;
  margin-right: 20px;
}

.search-input-minimized {
  width: 14rem;
}

.maximize-enter-active {
  animation: maximize 0.25s;
}

.maximize-leave-active {
  animation: minimize 0.25s;
}

.partitions {
  margin-left: 250px;
  transition: all .25s;
  width: auto;
  height: ~"calc(100vh - 152px)";
  &.maximized {
    margin-left: 39px;
<<<<<<< HEAD
  }  
=======
  }
>>>>>>> CICD/CI_CD
}

.on-edit-mode {
  .ba-data-table {
    top: 50px;
  }
}

.spinner-wrapper {
  height: 85vh;
  margin-left: 250px;
  transition: all .25s;
  &.maximized {
    margin-left: 0px;
  }
  .spinner {
    margin: 0;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.header-context-menu-data,
.row-context-menu-data {
  padding: 10px;
  border-bottom: 2px solid #DEE0DF;
  cursor: pointer;
  &:hover {
    background-color: #DEE0DF;
  }
}

.description {
  position: absolute;
  left: 13px;
  &:hover {
    cursor: pointer;
  }
}

.filter {
  left: 55px;
  position: relative;
  padding-top: 9px;
  color: #FFFFFF;
  svg {
    &:hover {
      cursor: pointer;
    }
  }
}

.filter-count {
  position: absolute;
  color: white;
  margin-left: 7px;
  z-index: 99;
}

.ba-plus-circle {
  padding: 9px 5px 5px 5px;
  font-size: 75%;
}

.filter-icon:hover,
.settings-icon:hover,
.ba-plus-circle:hover {
  background: #5298C5;
  border-radius: 250px;
  max-width: 2em;
}


.undo-icon, .delete-icon, .save-icon, .vertical-dots-icon, .exit-icon {
  padding-top: 5px;
  padding-left: 5px;
  padding-right: 5px;
  float: left;
  max-width: 2em;
  &:hover {
    border-radius: 200px;
    background: #88C3F5;
  }
}

.access-filter {
  cursor: not-allowed;
}

.repo-screen-name {
  flex: 1;
}

.reference-message{
   width: 100%;
   text-align: center;
   color: #D4E3EC;
}

.table-data {
  min-height: 20px;
  padding: 10px 12px;
  max-width: 300px;
  white-space: pre-wrap; //IE 11
  word-wrap: break-word;
}

.edit-mode {
  border: 2px solid #3598DB;
  background-color: #FFFFFF;
}

.edit-toolbar {
  background-color: #C6E6FD;
  display: flex;
  padding: 10px 5px 5px 5px;

  .title {
    padding: 5px;
  }

  svg {
    margin-right: 10px;
    cursor: pointer;
  }

  &.toolbar-items {
    flex: 1;
  }
}

.modal-heading {
  margin-top: 20px;
  font-size: 20px;
  text-transform: uppercase;
  font-weight: 600;
  text-align: center;
}

.modal-content {
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
}

@keyframes minimize {
  0% {
    margin-left: -250px;
  }
  100% {
    margin-left: 39px;
  }
}

@keyframes maximize {
  0% {
    margin-left: 39px;
  }
  100% {
    margin-left: -250px;
  }
}
</style>
