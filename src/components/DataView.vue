<template>
  <div>
    <ba-toolbar id="toolBar" :showSideNavIcons="true" @open="minimizeTable" @close="maximizeTable" :side-nav-start-open="sideNavOpen" :links="links" sticky>
      <span id="dataView" slot="page-name">{{ 'DATA_VIEW' | translate }}</span>
        <div :class="['search-input',{'search-input-minimized' : !maximized}]">
          <ba-input id="dataViewSearch"class="search" v-model="searchTerms" :placeholder="$t('SEARCH')"></ba-input>
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
        <div>
          <div v-if="repoTypes.length > 1" class="repos">
            <ba-select v-model="repoType" :options="repoTypes" @change="updateRepoType"></ba-select>
          </div>
          <div v-else class="repo-label">
            <span>{{ repoTypes[0].name }}</span>
          </div>
        </div>
        <div class="repo-screen-name">
          <div v-if="repoOptions.length > 2" class="repos">
            <ba-select v-model="selectedRecord" :options="repoOptions" @change="updateRepo" search></ba-select>
          </div>
          <div v-else class="repo-label repo-name">
            <span>{{ repoOptions[1] ? repoOptions[1].name : 'LOADING_REPO_NAME' | translate }}</span>
          </div>
        </div>
        <div>
          <div id="columnConfigurations" class="grid-settings" v-ba-tooltip="$t('COLUMN_CONFIGURATIONS')" @click="customizeColumns">
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
    <div :class="['partitions', { maximized }]">
      <ba-data-table v-show="!showSpinner"
                     ref="dataTable"
                     :loading="loading"
                     :table-data="documents"
                     :table-data-length="dataLength"
                     :custom-headers="customHeaders"
                     :paginationChoices="paginationChoices"
                     :menuWidth="97"
                     :menuHeight="135"
                     @pageChange="setDataCurrentPage"
                     @limitChange="setDataPageLimit"
                     @rowDblClicked="goToView"
                     @rowSelected="setSelectedRow"
                     @colSelected="setSelectedColumn"
                     @sorted="sort"
                     @columnSort="handleNewColumnConfig"
                     paginated
                     clickable
                     use-api
                     fixed-pagination
                     sticky-header>
        <span id="rowPerPage" slot="row-per-page">{{ 'ROWS_PER_PAGE' | translate }}</span>
        <span v-if="showContextMenu" slot="header-context-menu">
          <div class="header-context-menu-data" @click="goToProfileColumn">{{ 'PROFILE_COLUMN' | translate }}</div>
        </span>
        <template v-if="showContextMenu" slot="row-context-menu" scope="record">
          <div class="row-context-menu-data" @click="goToView360(record.item.data.CL_ID || record.item.data.SRC_PARTY_ID || record.item.data.CNT_ID || record.item.data.CNTRT_ID)" v-if="record.item && (record.item.data.CL_ID || record.item.data.SRC_PARTY_ID || record.item.data.CNT_ID || record.item.data.CNTRT_ID)">View 360</div>
        </template>
      </ba-data-table>
    </div>
    <ba-toast ref="errorToast" position="top">
      <i class="ba-icon ba-alert-circle" slot="icon"></i>
      <div slot="body">{{ generalErrors }}
      </div>
    </ba-toast>
    <profile-column :selectedColumnName="selectedColumnName" ref="profilecolumn"></profile-column>
    <column-configurator @tableHeaders="tableHeaders" ref="columnConfig" :user="user" :activeRepo="activeRepo"></column-configurator>

    <!-- Filter Modal -->
    <ba-modal ref="filterModal" class="filter-modal" size="lg"  footer>
      <span slot="header">{{ 'ADVANCED_SEARCH' | translate }}</span>
      <span slot="body">
        <advanced-filter ref="filter" useSession :sessionKey="'dataview'" :filterData="filterObject" @enter="applyFilter()" @filterEnabled="enableFilter()" @filterDisabled="disableFilter()" @filterRemoved="applyFilter"></advanced-filter>
      </span>
       <div slot="buttons">
        <ba-button id="cancel" class="ba-default flat" @click="closeFilter">{{ 'CANCEL' | translate }}</ba-button>
        <ba-button id="applyFilter" @click="applyFilter" :disabled="validData" :class="['ba-primary', { 'access-filter' : validData }]">{{ 'APPLY_FILTER' | translate }}</ba-button>
      </div>
    </ba-modal>
  </div>
</template>

<script>
  import _ from 'lodash';
  import convertToBoolean from 'yn';
  import { mapGetters, mapActions } from 'vuex';
  import Vue from 'vue';
  import VueLocalStorage from 'vue-localstorage';
  import dataTable from './mixins/dataTable';
  import loader from './mixins/loader';
  import sideNav from './mixins/sideNav';
  import repoHeaders from './mixins/repoHeaders';
  import filter from './mixins/filter';
  import RepositoryService from '../services/repositories';

  import ProfileColumn from './ProfileColumn';
  import AdvancedFilter from './AdvancedFilter';
  import ColumnConfigurator from './ColumnConfigurator';

  Vue.use(VueLocalStorage);

  const locale = JSON.parse(Vue.localStorage.get('userProfile')).language;

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
        repoType: 'masterRepositories',
        customTableHeaders: [],
        selectedColumnName: null,
        selectedRow: null,
        showSpinner: true,
        selectedRecord: '',
        searchTerms: null,
        user: JSON.parse(atob(this.$cookie.get('user'))),
        features: this.$root.features ? this.$root.features[this.$route.name] : {},
        defaultRepositoryID: this.$root.features ? this.$root.features[this.$route.name].defRepoId : null,
        defaultEnvView: 'cardview',
        showContextMenu: convertToBoolean(this.$root.features['DATA_PROFILER'].inline)
      };
    },

    mounted() {
      this.setActiveRepository(this.defaultRepositoryID);
      this.searchTerms = this.dataSearchTerms;
      this.$refs.dataTable.setPage(this.dataCurrentPage);
      this.$refs.dataTable.setLimit(this.dataPageLimit);
    },

    computed: {
      activeRepo: {
        get() {
          this.showSpinner = true;
          this.customTableHeaders = [];
          return this.activeRepository;
        }
      },

      activeView: {
        get() {
          return (this.activeStateView === undefined || this.activeStateView === 'lineageview') ? this.defaultEnvView : this.activeStateView;
        }
      },

      repoTypes() {
        return [{
          name: this.$t('MASTER'),
          value: 'masterRepositories'
        }];
      },

      loading() {
        return this.documents.length !== 0;
      },

      repoOptions() {
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
        'masterRepositories',
        'referenceRepositories',
        'allRepositories',
        'activeColHeaders',
        'detailedColHeaders',
        'documents',
        'activeRepository',
        'activeStateView',
        'links',
        'dataSearchTerms',
        'breadCrumbs'
      ])
    },

    created() {
      this.updateLinks(this.$router.currentRoute.path);
      this.resetActiveDocument({});
      this.setActiveRepo((this.activeRepository) ? this.activeRepository : this.defaultRepositoryID);
      this.fetchRepositories();
      this.tableHeaders();
    },

    methods: {
      closeFilter() {
        this.$refs.filterModal.close();
      },

      openFilterModal() {
        this.$refs.filterModal.open();
      },

      updateRepo(value) {
        this.setActiveRepo(value);
        this.activeRepositoryID = value;
        this.tableHeaders();
      },

      updateRepoType(value) {
        if (this[value] && this[value].length < 2) {
          this.repoType = value;
          this.updateRepo(this.repoOptions[1].value);
        }
      },

      applyFilter() {
        this.showSpinner = true;
        this.resetDataCurrentPage();
        this.fetchDocuments();
        this.closeFilter();
      },

    tableHeaders() {
      this.showSpinner = true;
      const name = `${this.user.first}_${this.user.last}`;
      const form = this.$root.appDeployEnvName;
      const id = this.activeRepository;
      this.showSpinner = true;
      this.repoHeaders(name, id,`${locale.toUpperCase()}`).then((response) => {
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
        const repositoryId = this.activeRepository;
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
        });
      },

      goToView(row) {
        if (this.breadCrumbs.length > 0) {
          this.removeBreadCrumbs(0);
        }
        this.$router.push(`/${this.activeView}/${this.activeRepository}/${row.data.documentId}`);
      },

      fetchRepositories() {
        this.getAllRepositories();
      },

      fetchDocuments() {
        this.$nextTick(() => {
        this.showSpinner = true;
          let payload = {
            repoId: this.activeRepository,
            pageSize: this.dataPageLimit,
            pageNumber: this.dataCurrentPage,
            search: this.searchTerms ? this.searchTerms : undefined,
            sort: this.sortQuery ? this.sortQuery : undefined,
            locale: `${locale.toUpperCase()}`
          }
          this.addFilterQueryParams(payload);
          this.getDocuments(payload).then((response) => {
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
        this.setActiveRepository(_id);
      },

      setSelectedColumn(columnName) {
        this.selectedColumnName = columnName;
      },

      setSelectedRow(row) {
        this.selectedRow = row.data;
      },

      checkIfNumeric(columnName) {
        let total = 0;
        _.forEach(this.documents, function(value, index) {
          total = _.add(total, _.toNumber(_.get(value, columnName)));
        });
        return !isNaN(total)
      },

      goToProfileColumn() {
        this.$refs.profilecolumn.init(this.activeRepository, this.selectedColumnName, this.checkIfNumeric(this.selectedColumnName));
      },

      goToLineageView() {
        this.showSpinner = true;
        RepositoryService.getDocument({
          repoId: this.activeRepository,
          documentId: this.selectedRow.documentId,
          nested: true
        }, {}).then((data) => {
          // To check if audits is available. There needs to be a better validation once we get proper data structure.
          if (data.body.attributes.AUDITHISTORY === undefined && data.body.attributes.AUDITS === undefined) {
            this.showSpinner = false;
            this.generalErrors = 'Lineage View not available for this item';
            this.$refs.errorToast.toggle();
          } else {
            this.setActiveDocument({
              doc: data.body
            });
            this.setActiveStateView('lineageview');
            this.$router.push(`/lineageview/${this.activeRepository}/${this.selectedRow.documentId}`);
          }
        }, (error) => {
          console.log(error);
        });
      },

      goToView360(record) {
        this.$router.push(`/view360/${record}`);
      },

      customizeColumns() {
        this.$refs.columnConfig.open();
      },

      handleNewColumnConfig(columnConfig) {
        this.$refs.columnConfig.handleNewColumnConfig(columnConfig);
      },

      ...mapActions([
        'getMasterRepositories',
        'getAllRepositories',
        'setActiveRepository',
        'setActiveStateView',
        'setActiveColHeaders',
        'setDetailedColHeaders',
        'getDocuments',
        'setActiveDocument',
        'setDataCurrentPage',
        'setDataPageLimit',
        'resetDataCurrentPage',
        'setDataSearchTerms',
        'updateLinks',
        'resetActiveDocument',
        'removeBreadCrumbs'
      ])
    },

    watch: {
      searchTerms(newValue, oldValue) {
        if (oldValue != null) {
          this.resetDataCurrentPage();
        }
        this.setDataSearchTerms({ searchTerms: newValue });
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

  #filter-modal, .filter-modal {
    .ba-content {
      height: ~"calc(100vh - 350px)";
      overflow-y: auto;
    }
  }

</style>

<style lang="less" scoped>
  .spacer {
    flex: 0.5;
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

  .grid-settings {
    padding: 8px 15px 0 0;
    font-size: 24px;
    color: #E5E9E9;
    cursor: pointer;
  }

  .search-input {
    // width: 30rem;
    flex: 1;
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
    .ba-data-table {
      top: 50px;
<<<<<<< HEAD
    }    
=======
    }
>>>>>>> CICD/CI_CD
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

  .header-context-menu-data, .row-context-menu-data {
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

  .repo-screen-name{
    flex: 1;
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
