<template>
  <div>
    <ba-toolbar :showSideNavIcons="true" @open="minimizeTable" @close="maximizeTable" :side-nav-start-open="sideNavOpen" :links="links" sticky>
      <span id="dashBoard" slot="page-name">{{ 'DASHBOARD' | translate }}</span>
    </ba-toolbar>

    <div :class="['dashboard-container', { maximized }]">
      <div class="dashboard-column">
        <div class="table-container">
          <queue-table :tableName="$t('REMEDIATION_QUEUE')"
                       :tableHeaders="errorTableHeaders"
                       :tableData="errorsTodo"
                       :showSpinner="!errorsTodoIsLoaded">
          </queue-table>
        </div>

        <div class="charts-row">
          <donut-chart :title="$t('MERGES_TO_DO_TODAY')"
                       :legend="$t('PENDING_MERGES')"
                       :closed-amount="mergesClosedToday"
                       :pending-amount="mergesTodoToday">
          </donut-chart>

          <donut-chart :title="$t('ERRORS_TO_DO_TODAY')"
                       :legend="$t('PENDING_ERRORS')"
                       :closed-amount="errorsClosedToday"
                       :pending-amount="errorsTodoToday">
          </donut-chart>
        </div>
      </div>

      <div class="dashboard-column">
        <div class="table-container">
          <queue-table :tableName="$t('MERGE_QUEUE')"
                       :tableHeaders="mergeTableHeaders"
                       :tableData="mergesTodo"
                       :showSpinner="!mergesTodoIsLoaded">
          </queue-table>
        </div>

        <div class="charts-row">
          <donut-chart :title="$t('MERGES_CLOSED_YESTERDAY')"
                       :legend="$t('CLOSED_MERGES')"
                       :closed-amount="mergesTodoYesterday"
                       :pending-amount="mergesClosedYesterday">
          </donut-chart>

          <donut-chart :title="$t('ERRORS_CLOSED_YESTERDAY')"
                       :legend="$t('CLOSED_ERRORS')"
                       :closed-amount="errorsTodoYesterday"
                       :pending-amount="errorsClosedYesterday">
          </donut-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment'
import sideNav from './mixins/sideNav';
import QueueTable from './QueueTable.vue';
import DonutChart from './DonutChart.vue';

const TODAY = moment(moment().format('YYYY-MM-DD').concat('T23:59:59.999'), moment.ISO_8601).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
const YESTERDAY = moment(moment().subtract(1, 'days').format("YYYY-MM-DD").concat('T23:59:59.999'), moment.ISO_8601).format('YYYY-MM-DDTHH:mm:ss.SSSZ');

export default {
  mixins: [sideNav],

  components: {
    QueueTable,
    DonutChart
  },

  data() {
     return {
       mergesTodoToday: 0,
       mergesClosedToday: 0,
       errorsTodoToday: 0,
       errorsClosedToday: 0,
       mergesTodoYesterday: 0,
       mergesClosedYesterday: 0,
       errorsTodoYesterday: 0,
       errorsClosedYesterday: 0,
       mergesTodoIsLoaded: false,
       errorsTodoIsLoaded: false
     }
  },

  computed: {
    features() {
      return this.$root.features ? this.$root.features : {};
    },

    errorTableHeaders() {
      return [
        'SOURCEPARTYID',
        'ERRORDATE',
        'ERROR',
        'SOURCESYSTEM'
      ];
    },

    mergeTableHeaders() {
      return [
        'MDMPARTYID',
        'PARTYTYPE',
        'NAME'
      ];
    },

    mergesTodo() {
      return this.dashboardPendingMerges;
    },

    errorsTodo() {
      return this.dashboardPendingErrors;
    },

    ...mapGetters([
      'dashboardPendingMerges',
      'dashboardPendingErrors',
      'links'
    ])
  },

  methods: {
    repoId(type) {
      let module = Object.keys(this.features).find((f) => { return ~f.indexOf(type); });
      return this.features[module] ? this.features[module].defRepoId : 0;
    },

    fetchTodo(type, day='TODAY') {
      this.$nextTick(() => {
        const payload = {
          repoId: this.repoId(type),
          pageSize: 20,
          pageNumber: 1,
          status: ['Pending'],
          createdBefore: day === 'TODAY' ? TODAY : YESTERDAY,
        };

        this.getDashboardPendingErrors(payload).then((response) => {
          this.errorsTodoIsLoaded = true;
          if (day === 'YESTERDAY') {
            this.errorsTodoYesterday = response.count;
          } else if (day === 'TODAY') {
            this.errorsTodoToday = response.count;
          }
        }, (error) => {
          console.log(error);
        });

        this.getDashboardPendingMerges(payload).then((response) => {
          this.mergesTodoIsLoaded = true;
          if (day === 'YESTERDAY') {
            this.mergesTodoYesterday = response.count;
          } else if (day === 'TODAY') {
            this.mergesTodoToday = response.count;
          }
        }, (error) => {
          this.mergesTodoIsLoaded = true;
          console.log(error);
        });
      });
    },

<<<<<<< HEAD
    fetchClosed(type, day='TODAY' ) {
=======
    fetchClosed(type, day) {
>>>>>>> CICD/CI_CD
      this.$nextTick(() => {
        const payload = {
          repoId: this.repoId(type),
          pageSize: 20,
          pageNumber: 1,
          status:['Handled', 'Rejected'],
          modifiedBefore: day === 'TODAY' ? TODAY : YESTERDAY,
        };

        this.getClosedErrors(payload).then((response) => {
          if (day === 'YESTERDAY') {
            this.errorsClosedYesterday = response.count;
          } else if (day === 'TODAY') {
            this.errorsClosedToday = response.count;
          }
        }, (error) => {
          console.log(error);
        });

        this.getClosedMerges(payload).then((response) => {
          this.mergesTodoIsLoaded = true;
          if (day === 'YESTERDAY') {
            this.mergesClosedYesterday = response.count;
          } else if (day === 'TODAY') {
            this.mergesClosedToday = response.count;
          }
        }, (error) => {
          this.mergesTodoIsLoaded = true;
          console.log(error);
        });
      });
    },

    ...mapActions([
      'getDashboardPendingErrors',
      'getDashboardPendingMerges',
      'getClosedMerges',
      'getClosedErrors',
      'setCurrentState',
      'updateLinks'
    ])
  },

  created() {
    this.updateLinks(this.$router.history.current.path);
    this.fetchTodo('REMEDIATION', 'TODAY');
    this.fetchTodo('REMEDIATION', 'YESTERDAY');
    this.fetchTodo('MERGE', 'TODAY');
    this.fetchTodo('MERGE', 'YESTERDAY');
    this.fetchClosed('REMEDIATION', 'TODAY');
    this.fetchClosed('REMEDIATION', 'YESTERDAY');
    this.fetchClosed('MERGE', 'TODAY');
    this.fetchClosed('MERGE', 'YESTERDAY');
    this.setCurrentState(this.$router.history.current.path);
  }
};
</script>


<style lang="less" scoped>
.dashboard-container  {
  display: flex;
  margin-left: 250px;
  transition: all 0.25s;
  height: ~"calc(100vh - 110px)";
  background-color: #f5f6f8;

  &.maximized {
    margin-left: 40px;
  }

  .dashboard-column {
    display: flex;
    flex-direction: column;
    flex: 1 auto;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    margin: 20px;
    width: 300px;

    .table-container {
      display: flex;
      justify-content: center;
      flex: 7 auto;
      background-color: #fff;
      height: 70%;
    }

    .charts-row {
      margin: 20px 0 0 0;
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      flex: 3 auto;
      height: 30%;
    }
  }
}
</style>
