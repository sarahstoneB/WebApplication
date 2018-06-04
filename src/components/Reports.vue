<template>
  <div>
    <ba-toolbar ref="reportsToolbar" :showSideNavIcons="true" @open="minimizeTable" @close="maximizeTable" :side-nav-start-open="sideNavOpen" :links="links" sticky>
      <span id="reportsView" slot="page-name">{{ 'REPORTS' | translate }}</span>
      <div :class="['search-input',{'search-input-minimized' : !maximized}]">
        <ba-input id="reportsSearch" class="search" v-model="searchTerms" :disabled="activeReportsRepository === null" :placeholder="$t('SEARCH')"></ba-input>
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
            <div style="display: table" v-ba-tooltip="activeReportsRepository === null ? $t('REPO_SELECT') : $t('FILTERS')">
              <svg :style="activeReportsRepository === null ? 'pointer-events: none' : ''" @click="openModal('filterModal')" class="filter-icon" style="padding:5px;height:22px;max-width: 2em;" viewBox="0 0 24 24">
                <path :fill="'#FFFFFF'" d="M3,2H21V2H21V4H20.92L14,10.92V22.91L10,18.91V10.91L3.09,4H3V2Z" />
              </svg>
            </div>
          </span>
        </div>
      </div>
      <div class="repo-screen-name">
        <div v-if="repoOptions.length > 2" class="repos">
          <ba-select v-model="selectedRecord" :options="repoOptions" @change="updateRepo" search></ba-select>
        </div>
        <div v-else class="repo-label repo-name">
          <span>{{ repoOptions[1] ? repoOptions[1].name : 'Loading Repo Name...' }}</span>
        </div>
      </div>
      <div>
        <div class="icon-toolbar">

          <span v-ba-tooltip="activeReportsRepository === null ? $t('REPO_SELECT') : $t('COLUMN_CONFIGURATIONS')">
            <svg class="settings-icon" @click="customizeColumns" :style="activeReportsRepository === null ? 'pointer-events: none' : ''" viewBox="0 0 24 24">
              <path fill="#FFFFFF" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
            </svg>
          </span>
        </div>
      </div>
    </ba-toolbar>
    <div :class="['spinner-wrapper', { maximized }]" v-if="showSpinner">
      <ba-spinner v-if="showSpinner" :indeterminate="true" :progress="40" :size="50" class="spinner"></ba-spinner>
    </div>
    <div :class="['partitions', { maximized }]">
      <div :class="['empty-records', { maximized }]">
        <h4 class="empty-wrapper" v-if="!loading && (activeReportsRepository !== null)">{{ 'NO_RECORDS_FOUND' | translate }}</h4>
        <h4 class="empty-wrapper" v-if="activeReportsRepository === null && reportRepositories.length > 0">{{ 'REPO_SELECT' | translate }}</h4>
      </div>
      <ba-data-table :class="data-table" v-show="!showSpinner && activeReportsRepository !== null"
                     ref="dataTable"
                     :loading="loading"
                     :table-data="reportDocuments"
                     :table-data-length="dataLength"
                     :custom-headers="customHeaders"
                     :paginationChoices="paginationChoices"
                     :menuWidth="97"
                     :menuHeight="135"
                     paginated
                     @pageChange="setReportsCurrentPage"
                     @limitChange="setReportsPageLimit"
                     @sorted="sort"
                     @columnSort="handleNewColumnConfig"
                     clickable
                     use-api
                     fixed-pagination
                     sticky-header>
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
    <column-configurator @tableHeaders="tableHeaders" ref="columnConfig" :user="user" :activeRepo="activeRepo"></column-configurator>

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
      repoType: 'reportRepositories',
      customTableHeaders: [],
      showSpinner: false,
      selectedRecord: '',
      generalErrors: [],
      searchTerms: null,
      user: JSON.parse(atob(this.$cookie.get('user'))),
      features: this.$root.features ? this.$root.features[this.$route.name] : {},
      defaultRepositoryID: null,
      routeToMove: null
    };
  },

  mounted() {
    this.searchTerms = this.reportsSearchTerms;
    this.setActiveReportsRepository(this.defaultRepositoryID);
    this.showSpinner = true;
  },

  computed: {
    activeRepo: {
      get() {
        this.showSpinner = true;
        if (this.activeReportsRepository === null) {
          this.showSpinner = false;
        }
        this.customTableHeaders = [];
        return this.activeReportsRepository;
      }
    },

    repoTypes() {
      return [{
        name: this.$t('REPORT'),
        value: 'reportRepositories'
      }];
    },

    loading() {
      let loading;
      if (this.activeReportsRepository === null) {
        loading = false;
      } else {
        loading = (this.reportDocuments.length !== 0);
      }
      return loading;
    },

    repoOptions() {
      if (this.activeReportsRepository === null) {
        this.showSpinner = false;
      }
      return [{
        name: this.$t('CHOOSE_A_REPOSITORY'),
        value: ''
      }].concat(
        _.map(this.reportRepositories, (r) => {
          return {
            name: `${r.repositoryDisplayName ? r.repositoryDisplayName : r.repositoryName} - [${r.repositoryId}]`,
            value: r.repositoryId
          };
        })
      );
    },

    ...mapGetters([
      'reportRepositories',
      'activeColHeaders',
      'detailedColHeaders',
      'reportDocuments',
      'activeReportsRepository',
      'links',
      'reportsSearchTerms',
      'reportsCurrentPage',
      'reportsPageLimit'
    ])
  },

  created() {
    this.updateLinks(this.$router.currentRoute.path);
    this.setActiveReportsRepo((this.activeReportsRepository) ? this.activeReportsRepository : this.defaultRepositoryID);
    this.fetchRepositories();
    this.showSpinner = false;
  },

  methods: {

    populateErrorToast(errorObject) {
      let result = [];
      _.forOwn(errorObject, (value, key) => {
        result.push(key + ':  ' + value);
      })
      return result;
    },

    openModal(ref) {
      this.$refs[ref].open();
    },

    closeModal(ref) {
      this.$refs[ref].close();
    },

    getViewForms(repoId) {
      this.tableHeaders();
    },

    updateRepo(value) {
      if (value !== '') {
        this.setActiveReportsRepository(value);
        this.getViewForms(value);
      } else {
        this.setActiveReportsRepository(this.defaultRepositoryID);
      }
    },

    applyFilter() {
      this.showSpinner = true;
      this.resetReportsCurrentPage();
      this.fetchDocuments();
      this.closeModal('filterModal');
    },

    tableHeaders() {
      this.showSpinner = true;
      const name = `${this.user.first}_${this.user.last}`;
      const form = this.$root.appDeployEnvName;
      const id = this.activeReportsRepository;
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
      const repositoryId = this.activeReportsRepository;
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
      this.getReportRepositories();
    },

    fetchDocuments() {
      this.$nextTick(() => {
        this.showSpinner = true;
        let payload = {
          repoId: this.activeReportsRepository,
          pageSize: this.reportsPageLimit,
          pageNumber: this.reportsCurrentPage,
          search: this.searchTerms ? this.searchTerms : undefined,
          sort: this.sortQuery ? this.sortQuery : undefined,
        }
        this.addFilterQueryParams(payload);
        this.getReportDocuments(payload).then((response) => {
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

    setActiveReportsRepo(_id) {
      this.setActiveReportsRepository(_id);
    },

    customizeColumns() {
      this.$refs.columnConfig.open();
    },

    handleNewColumnConfig(columnConfig) {
      this.$refs.columnConfig.handleNewColumnConfig(columnConfig);
    },

    ...mapActions([
      'setActiveReportsRepository',
      'setActiveColHeaders',
      'setDetailedColHeaders',
      'getReportRepositories',
      'getReportDocuments',
      'resetReportsCurrentPage',
      'setReportsSearchTerms',
      'updateLinks'
    ])
  },

  watch: {
    searchTerms(newValue, oldValue) {
      if (oldValue != null) {
        this.resetReportsCurrentPage();
      }
      this.setReportsSearchTerms({ searchTerms: newValue });
      this.showSpinner = true;
      this.fetchDocuments();
    }
  }
};
</script>

<style lang="less">
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
.settings-icon {
  padding: 5px;
  max-width: 2em;
  height: 22px;
}

.filter-icon:hover,
.settings-icon:hover,
.ba-plus-circle:hover {
  background: #5298C5;
  border-radius: 250px;
  max-width: 2em;
}

.access-filter {
  cursor: not-allowed;
}

.repo-screen-name {
  flex: 1;
}

.reference-message {
   width: 100%;
   text-align: center;
   color: #D4E3EC;
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
