<template>
  <div>
    <ba-toolbar id="toolBar" :showSideNavIcons="true" @open="minimizeTable" @close="maximizeTable" :side-nav-start-open="sideNavOpen" :links="links" sticky>
      <span id="errorRemediation" slot="page-name">{{ 'ERROR_REMEDIATION' | translate }}</span>
      <div class="search-input">
        <ba-input id="errorRemediationSearch" class="search" v-model="searchTerms" :placeholder="$t('SEARCH')"></ba-input>
      </div>
      <div class="spacer">
        <div class="filter">
          <span>
            <span class="description" v-ba-tooltip="$t('FILTERS')" @click="openFilterModal" v-if="filterCount > 0">
              <div class="filter-count">!</div>
              <svg style="width:18px;height:18px" viewBox="0 0 24 24">
                <path fill="#D53B31" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
              </svg>
            </span>
            <div>
              <svg v-ba-tooltip="$t('FILTERS')" @click="openFilterModal" class="filter-icon" style="padding:5px;height:22px;max-width: 2em;" viewBox="0 0 24 24">
                <path fill="#FFFFFF" d="M3,2H21V2H21V4H20.92L14,10.92V22.91L10,18.91V10.91L3.09,4H3V2Z" />
              </svg>
            </div>
          </span>
        </div>
      </div>
      <div class="spacerx3">
        <label class="pending-errors-label" v-if="pendingErrorsRemaining">{{ 'PENDING_ERRORS' | translate }}</label>
        <span class="pending-errors-remaining" v-if="pendingErrorsRemaining">{{ pendingErrorsRemaining }}</span>
      </div>
      <div>
        <div class="grid-settings" v-ba-tooltip="$t('COLUMN_CONFIGURATIONS')" @click="customizeColumns">
          <span>
            <i class="ba-icon ba-settings"></i>
          </span>
        </div>
      </div>
    </ba-toolbar>
    <div :class="['spinner-wrapper', { maximized }]" v-if="showSpinner">
      <ba-spinner v-if="showSpinner" :indeterminate="true" :progress="40" :size="50" class="spinner"></ba-spinner>
    </div>
    <div :class="['empty-records', { maximized }]">
      <h4 class="empty-wrapper" v-if="!loading">{{ 'NO_RECORDS_FOUND' | translate }}</h4>
    </div>
    <div :class="['error-remediation-table', { maximized }]">
      <ba-data-table v-show="!showSpinner"
                     ref="dataTable"
                     :loading="loading"
                     :tableData="pendingErrors"
                     :table-data-length="dataLength"
                     :custom-headers="customHeaders"
                     :paginationChoices="paginationChoices"
                     @pageChange="setErrorCurrentPage"
                     @limitChange="setErrorPageLimit"
                     @rowDblClicked="goToErrorCardView"
                     @sorted="sort"
                     @columnSort="handleNewColumnConfig"
                     paginated
                     clickable
                     use-api
                     fixedPagination
                     sticky-header>
             <span id="rowPerPage" slot="row-per-page">{{ 'ROWS_PER_PAGE' | translate }}</span>
      </ba-data-table>
    </div>
    <ba-toast ref="errorToast" position="top">
      <i class="ba-icon ba-alert-circle" slot="icon"></i>
      <div slot="body">{{ generalErrors }}
      </div>
    </ba-toast>

    <column-configurator @tableHeaders="tableHeaders" ref="columnConfig" :user="user" :activeRepo="errorRepo"></column-configurator>

    <!-- Filter Modal -->
    <ba-modal ref="filterModal" class="filter-modal" size="lg" footer>
      <span slot="header">{{ 'ADVANCED_SEARCH' | translate }}</span>
      <span slot="body">
        <advanced-filter ref="filter" useSession :sessionKey="'error'" :filterData="filterObject" @enter="applyFilter()" @filterEnabled="enableFilter()" @filterDisabled="disableFilter()" @filterRemoved="applyFilter"></advanced-filter>
      </span>
      <div slot="buttons">
        <ba-button class="ba-default flat" @click="closeFilter">{{ 'CANCEL' | translate }}</ba-button>
        <ba-button @click="applyFilter" :disabled="validData" :class="['ba-primary', { 'access-filter' : validData }]">{{ 'APPLY_FILTER' | translate }}</ba-button>
      </div>
    </ba-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
import Vue from 'vue';
import VueLocalStorage from 'vue-localstorage';
import dataTable from './mixins/dataTable'
import loader from './mixins/loader'
import sideNav from './mixins/sideNav'
import repoHeaders from './mixins/repoHeaders'
import ErrorService from '../services/error'
import filter from './mixins/filter';
import RepositoryService from '../services/repositories';
import ColumnConfigurator from './ColumnConfigurator';
import AdvancedFilter from './AdvancedFilter.vue';

Vue.use(VueLocalStorage);
const locale = JSON.parse(Vue.localStorage.get('userProfile')).language;

export default {
  mixins: [dataTable, sideNav, repoHeaders, filter, loader],

  components: {
    AdvancedFilter,
    ColumnConfigurator
  },

  data() {
    return {
      errorRepo: this.$root.features ? this.$root.features[this.$route.name].defRepoId : 0,
      customTableHeaders: [],
      user: JSON.parse(atob(this.$cookie.get('user'))),
      generalErrors: null,
      searchTerms: null
    }
  },

  mounted() {
    this.searchTerms = this.errorSearchTerms;
    this.$refs.dataTable.setPage(this.errorCurrentPage);
    this.$refs.dataTable.setLimit(this.errorPageLimit);
  },

  computed: {
    loading() {
      return this.pendingErrors.length !== 0;
    },

    ...mapGetters([
      'activeDocument',
      'activeColHeaders',
      'detailedColHeaders',
      'pendingErrors',
      'links',
      'errorSearchTerms'
    ])
  },

  created() {
    this.updateLinks(this.$router.currentRoute.path);
    this.setActiveDocumentErrors({});
    this.resetErrorMessage();
    this.setCurrentState(this.$router.history.current.path);
    this.tableHeaders();
  },

  methods: {
    openFilterModal() {
      this.$refs.filterModal.open();
    },

    applyFilter() {
      this.showSpinner = true;
      this.resetErrorCurrentPage();
      this.fetchDocuments();
      this.closeFilter();
    },

    closeFilter() {
      this.$refs.filterModal.close();
    },

    tableHeaders() {
       this.showSpinner = true;
      const name = `${this.user.first}_${this.user.last}`;
      const form = this.$root.appDeployEnvName;
      const id = this.errorRepo;
       this.showSpinner = true;
      this.repoHeaders(name, id, `${locale.toUpperCase()}`).then((response) => {
        this.customTableHeaders = response;
        this.setSortedFields(response);
        this.getAllColumnHeaders();
        this.filterObject = this.getFilterAttributes(this.customHeaders);
        let sortedField = {
          'field': response[0],
          'direction': 'asc'
        }
        this.constructSortQuery(sortedField.field, sortedField.direction);
        this.fetchDocuments();
      });
    },

    getAllColumnHeaders() {
      const id = this.errorRepo;
      this.getAllColHeaderDetails(id).then((response) => {
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
      });
    },

    fetchDocuments() {
      this.$nextTick(() => {
      this.showSpinner = true;
        let payload = {
          repoId: this.errorRepo,
          pageSize: this.errorPageLimit,
          pageNumber: this.errorCurrentPage,
          search: this.searchTerms ? this.searchTerms : undefined,
          sort: this.sortQuery ? this.sortQuery : undefined,
          status: 'Pending'
        };
        this.addFilterQueryParams(payload);
        this.getPendingErrors(payload).then((info) => {
          this.showSpinner = false;
          this.dataLength = info.count
          this.pendingErrorsRemaining = `${this.dataLength} ` + this.$t('ERROR_DOCUMENTS_REMAINING');
        }, (error) => {
          console.log(error)
        })
      })
    },

    sort(headerDetails) {
      if (this.customTableHeaders.includes(headerDetails.field)) {
        this.constructSortQuery(headerDetails.field, headerDetails.direction);
        this.fetchDocuments();
      }
    },

    goToErrorCardView(row) {
      this.$router.push('/errorcardview/' + this.errorRepo + '/' + row.data.documentId);
    },

    customizeColumns() {
      this.$refs.columnConfig.open();
    },

    handleNewColumnConfig(columnConfig) {
      this.$refs.columnConfig.handleNewColumnConfig(columnConfig);
    },

  ...mapActions([
      'getPendingErrors',
      'setActiveDocument',
      'setActiveColHeaders',
      'setDetailedColHeaders',
      'setErrorMessage',
      'setErrorCurrentPage',
      'setErrorPageLimit',
      'resetErrorCurrentPage',
      'setErrorSearchTerms',
      'setCurrentState',
      'updateLinks',
      'resetErrorMessage',
      'setActiveDocumentErrors'
    ])
  },

  watch: {
    searchTerms(newValue, oldValue) {
      if (oldValue != null) {
        this.resetErrorCurrentPage();
      }
      this.setErrorSearchTerms({ searchTerms: newValue });
      this.showSpinner = true;
      this.fetchDocuments();
    }
  }
}
</script>
<style lang="less">
.error-remediation-table .pagination-container.fixed {
  white-space: nowrap;
}
</style>
<style lang="less" scoped>
.pending-errors-label {
  color: #BACBCB !important;
  margin-bottom: 0;
  font-size: 12px;
  margin-top: 5px;
  text-transform: uppercase;
}

.pending-errors-remaining {
  color: #FFFFFF;
  font-size: 12px;
}

.spacer {
  flex: 0.5;
}

.spacerx3 {
  flex: 1;
  margin-left: 7em;
}

.search-input {
  width:25rem;
  margin-right: 20px;
}

.error-remediation-table {
  margin-left: 250px;
  transition: all .25s;
  width: auto;
  height: 77vh;

  &.maximized {
    margin-left: 39px;
  }
<<<<<<< HEAD
  
=======
>>>>>>> CICD/CI_CD
  .ba-data-table {
    top: 50px;
  }
}

.spinner-wrapper {
  height: 85vh;
  margin-left: 250px;
  transition: all .25s;

  &.maximized {
    margin-left: 39px;
  }

  .spinner {
    margin: 0;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.grid-settings {
  padding: 8px 15px 0 0;
  font-size: 24px;
  color: #E5E9E9;
  cursor: pointer;
}

.active-headers {
  padding-bottom: 15px;
  border-bottom: 2px solid #BACBCB;
}

.active-header-title {
  margin: 0 0 10px 10px;
  font-size: 14px;
  display: flex;
  .active-header {
    flex: 6;
  }
  .add-all-headers {
    text-align: right;
  }
  .remove-all-headers {
    text-align: left;
  }
  .add-all-headers,
  .remove-all-headers {
    font-size: 12px;
    flex: 1;
    text-decoration: underline;
    color: #4899D2;
    font-weight: bold;
    cursor: pointer;
    letter-spacing: 0.1rem;
  }
  .pipe {
    flex: 0.25;
    text-align: center;
  }
}


.avail-header-title {
  padding-top: 15px;
  margin: 0 0 10px 10px;
  font-size: 14px;
}


.col-header-name {
  margin-left: 15px;
  font-size: 12px;
  font-weight: bold;
}

.col-order {
  color: #BACBCB;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.avail-headers {
  min-height: 20px;
  .col-header {
    color: #BACBCB;
    background-color: #F4F6F8;
    border: 1px solid #F4F6F8 !important;
  }
  .col-header:active {
    color: #000000;
  }
  .col-header:hover {
    color: #000000;
  }
}

.maximize-enter-active {
  animation: maximize 0.25s;
}

.maximize-leave-active {
  animation: minimize 0.25s;
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
  margin-left: 8px;
  z-index: 99;
}

.ba-settings {
  padding: 9px 5px 5px 5px;
  font-size: 75%;
}

.filter-icon:hover,
.ba-settings:hover {
  background: #5298C5;
  border-radius: 250px;
  max-width: 2em;
}

.access-filter {
  cursor: not-allowed;
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
