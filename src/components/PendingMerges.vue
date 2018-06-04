<template>
  <div>
    <ba-toolbar id="toolBar" :showSideNavIcons="true" @open="minimizeTable" @close="maximizeTable" :side-nav-start-open="sideNavOpen" :links="links" sticky>
      <span slot="page-name">{{ 'PENDING_MATCHES' | translate }}</span>
      <div class="search-input">
        <ba-input id="pendingMergesSearch" class="search" v-model="searchTerms" :placeholder="$t('SEARCH')"></ba-input>
      </div>
      <div class="spacerx2">
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
      <div class="spacerx2">
        <label class="pending-merges-label">{{ 'PENDING_MERGES' | translate }}</label>
        <span class="pending-merges-remaining">{{ pendingMergesRemaining }}</span>
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
    <div :class="['match-merge-table', { maximized }]">
      <ba-data-table v-show="!this.showSpinner"
                     ref="dataTable"
                     :tableData="pendingMerges"
                     :custom-headers="customHeaders"
                     :table-data-length="dataLength"
                     :paginationChoices="paginationChoices"
                     :loading="loading"
                     @pageChange="setMergeCurrentPage"
                     @limitChange="setMergePageLimit"
                     @rowDblClicked="goToPreMerge"
                     @sorted="sort"
                     @columnSort="handleNewColumnConfig"
                     paginated
                     clickable
                     use-api
                     fixedPagination
                     sticky-header>
        <span id="rowPerPage" slot="row-per-page">{{ 'ROWS_PER_PAGE' | translate }}</span>
        <template scope="data">
          <pending-merge-table-data :record="data.value"></pending-merge-table-data>
        </template>
      </ba-data-table>
    </div>
    <ba-toast ref="errorToast" position="top">
      <i class="ba-icon ba-alert-circle" slot="icon"></i>
      <div slot="body">{{ generalErrors }}
      </div>
    </ba-toast>

    <column-configurator @tableHeaders="setTableHeaders" ref="columnConfig" :user="user" :activeRepo="mergeRepo" ></column-configurator>

    <!-- Filter Modal -->
    <ba-modal ref="filterModal" class="filter-modal" size="lg" footer>
      <span slot="header">{{ 'ADVANCED_SEARCH' | translate }}</span>
      <span slot="body">
        <advanced-filter ref="filter" useSession :sessionKey="'pm'" :filterData="filterObject" @enter="applyFilter()" @filterEnabled="enableFilter()" @filterDisabled="disableFilter()" @filterRemoved="applyFilter"></advanced-filter>
      </span>
       <div slot="buttons">
        <ba-button class="ba-default flat" @click="closeFilter">{{ 'CANCEL' | translate }}</ba-button>
        <ba-button @click="applyFilter" :disabled="validData" :class="['ba-primary', { 'access-filter' : validData }]">{{ 'APPLY_FILTER' | translate }}</ba-button>
      </div>
    </ba-modal>
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';
import Vue from 'vue';
import VueLocalStorage from 'vue-localstorage';
import PendingMergeTableData from './PendingMergeTableData.vue';
import dataTable from './mixins/dataTable';
import loader from './mixins/loader';
import sideNav from './mixins/sideNav';
import repoHeaders from './mixins/repoHeaders';
import filter from './mixins/filter';
import MatchMergeService from '../services/matchmerge';
import RepositoryService from '../services/repositories';

import AdvancedFilter from './AdvancedFilter.vue'
import ColumnConfigurator from './ColumnConfigurator';

Vue.use(VueLocalStorage);
const locale = JSON.parse(Vue.localStorage.get('userProfile')).language;

export default {
  mixins: [dataTable, sideNav, repoHeaders, filter, loader],

  components: {
    AdvancedFilter,
    PendingMergeTableData,
    ColumnConfigurator
  },

  data() {
    return {
      searchTerms: null,
      pendingMergesRemaining: '',
      customTableHeaders: [],
      user: JSON.parse(atob(this.$cookie.get('user'))),
      mergeRepo: this.$root.features ? this.$root.features[this.$route.name].defRepoId : null,
    };
  },

  mounted() {
    this.searchTerms = this.mergeSearchTerms;
    this.$refs.dataTable.setPage(this.mergeCurrentPage);
    this.$refs.dataTable.setLimit(this.mergePageLimit);
  },

  computed: {
    loading() {
      return this.pendingMerges.length !== 0;
    },

    ...mapGetters([
      'pendingMerges',
      'links',
      'mergeSearchTerms',
      'activeColHeaders',
      'detailedColHeaders'
    ])
  },

  created() {
    this.updateLinks(this.$router.currentRoute.path);
    this.setCurrentState(this.$router.history.current.path);
    this.setTableHeaders();
  },

  methods: {

    applyFilter() {
      this.showSpinner = true;
      this.resetMergeCurrentPage();
      this.fetchDocuments();
      this.closeFilter();
    },

    closeFilter() {
      this.$refs.filterModal.close();
    },

    openFilterModal() {
      this.$refs.filterModal.open();
    },

    setTableHeaders() {
      this.showSpinner = true;
      const name = `${this.user.first}_${this.user.last}`;
      const form = this.$root.appDeployEnvName;
      const id = this.mergeRepo;
      this.showSpinner = true;
      this.repoHeaders(name, id,`${locale.toUpperCase()}`).then((response) => {
        let sortedField = {
          'field': response[0],
          'direction': 'asc'
        }
        let length = response.length - 1;
        response.splice(length, 0, 'MATCHSCORE');
        this.customTableHeaders = response;
        this.filterObject = this.getFilterAttributes(this.customHeaders);
        this.getAllColumnHeaders();
        this.setSortedFields(response);
        this.constructSortQuery(sortedField.field, sortedField.direction);
        this.fetchDocuments();
      });
    },

    getAllColumnHeaders() {
      const id = this.mergeRepo;
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
          repoId: this.mergeRepo,
          pageSize: this.mergePageLimit,
          pageNumber: this.mergeCurrentPage,
          search: this.searchTerms ? this.searchTerms : undefined,
          sort: this.sortQuery ? this.sortQuery : undefined
        };
        this.addFilterQueryParams(payload);
        this.getPendingMerges(payload).then((info) => {
          this.dataLength = info.count;
          this.pendingMergesRemaining = `${this.dataLength} ${this.$t('MERGE_DOCUMENTS_REMAINING')}`;
          this.showSpinner = false;
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

    goToPreMerge(row) {
      this.showSpinner = true;
      this.getMatchMergeDocs(row);
    },

    getMatchMergeDocs(row) {
      this.$router.push(`/matchmerge/${this.mergeRepo}/${row.data.documentId}`);
    },

    customizeColumns() {
      this.$refs.columnConfig.open();
    },

    handleNewColumnConfig(columnConfig) {
      this.$refs.columnConfig.handleNewColumnConfig(columnConfig);
    },

    ...mapActions([
      'getPendingMerges',
      'setPreMergeInformation',
      'setMergeMessage',
      'setActiveColHeaders',
      'setDetailedColHeaders',
      'setMergeCurrentPage',
      'setMergePageLimit',
      'resetMergeCurrentPage',
      'setMergeSearchTerms',
      'setCurrentState',
      'updateLinks'
    ])
  },

  watch: {
    searchTerms(newValue, oldValue) {
      if (oldValue != null) {
        this.resetMergeCurrentPage();
      }
      this.setMergeSearchTerms({ searchTerms: newValue });
      this.showSpinner = true;
      this.fetchDocuments();
    }
  }
};
</script>

<style lang="less" scoped>
.pending-merges-label {
  color: #BACBCB !important;
  margin-bottom: 0;
  font-size: 12px;
  margin-top: 5px;
  text-transform: uppercase;
}

.pending-merges-remaining {
  color: #FFFFFF;
  font-size: 12px;
}

.spacerx2 {
  flex: 1;
}

.search-input {
  width: 25rem;
  margin-right: 20px;
}

.match-merge-table {
  margin-left: 250px;
  transition: all .25s;
  width: auto;
  height: ~"calc(100vh - 152px)";

  &.maximized {
    margin-left: 39px;
  }

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

.grid-settings {
  padding: 8px 15px 0 0;
  font-size: 24px;
  color: #E5E9E9;
  cursor: pointer;
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

.maximize-enter-active {
  animation: maximize 0.25s;
}

.maximize-leave-active {
  animation: minimize 0.25s;
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

.access-filter{
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
