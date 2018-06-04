<template>
  <div class="table" id="table">
    <div class="table-name">
      {{ tableName }}
    </div>
    <div class="table-body">
      <ba-spinner v-if="showSpinner"
                  :indeterminate="true"
                  :progress="40"
                  :size="50"
                  class="spinner">
      </ba-spinner>

      <ba-data-table v-if="!showSpinner"
                    :custom-headers="tableHeaders"
                    :table-data="tableData"
                    :loading="!!tableData.length"
                    :id="'QueueTable-' + Date.now()"
                    :sticky-header="true"
                    :scrollable="true"
                    @rowDblClicked="goToView"
                    @sorted="sort"
                    clickable
                    use-api>
      </ba-data-table>
    </div>
    <ba-toast ref="errorToast" position="top">
      <i class="ba-icon ba-alert-circle" slot="icon"></i>
       <ol slot="body">
            <li v-for="error in generalErrors">{{ error }}</li>
          </ol>
    </ba-toast>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import MatchMergeService from '../services/matchmerge';
import dataTable from './mixins/dataTable';

export default {
  mixins: [dataTable],

  data() {
    return {
      generalErrors: null,
    }
  },

  props: {
    tableName: {
      type: String
    },
    tableHeaders: {
      type: Array,
      required: true,
      default: []
    },
    tableData: {
      type: Array,
      required: true,
      default: []
    },
    showSpinner: {
      type: Boolean,
      required: true,
      default: true
    }
  },

  computed: {
    ...mapGetters([
      'pendingErrors'
    ])
  },

  methods: {
    goToView(row) {
      if (this.tableName === 'MERGE QUEUE') {
        this.$router.push(`/matchmerge/${row.data.repositoryId}/${row.data.documentId}`);
      } else if (this.tableName === 'REMEDIATION QUEUE') {
        this.$router.push('/errorcardview/' + row.data.repositoryId + '/' + row.data.documentId);
      }
    },

    sort(headerDetails) {
      this.constructSortQuery(headerDetails.field, headerDetails.direction);
      if (this.tableName === 'MERGE QUEUE') {
        this.dataTable = this.$parent.fetchTodo('MERGE', 'TODAY', this.sortQuery);
      } else if (this.tableName === 'REMEDIATION QUEUE') {
        this.dataTable = this.$parent.fetchTodo('REMEDIATION', 'TODAY', this.sortQuery);
      }
    }
  },

  mounted() {
    const tableHeight = Number(document.getElementById('table').offsetHeight) - 30;
    const tables = document.getElementsByClassName('table-body');
    Array.prototype.every.call(tables, (element) => {
      return element.style.height = tableHeight + 'px';
    });
  }
};
</script>


<style lang="less" scoped>
.table {
  width: 100%;

  &-name {
    font-size: 13px;
    font-weight: bolder;
    background-color: #f5f6f8;
    color: #354a5c;
    height: 30px;
  }

  &-body {
    .ba-data-table {
      height: inherit;
    }
  }
}

.spinner {
  margin: 0;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
