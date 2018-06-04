// fetchDocuments() needs to be implemented by any component that includes this mixin
import Vue from 'vue';
import _ from 'lodash';
import VueLocalStorage from 'vue-localstorage';
import { mapGetters, mapActions } from 'vuex';
import MatchMergeService from './../../services/matchmerge';
import ErrorService from './../../services/error';


Vue.use(VueLocalStorage);

const locale = JSON.parse(Vue.localStorage.get('userProfile')).language;

export default {
  data() {
    return {
      activeRow: {},
      dataLength: 0,
      sortQuery: '',
      paginationChoices:
      [{
        name: '5',
        value: 5
      }, {
        name: '10',
        value: 10
      }, {
        name: '15',
        value: 15
      }, {
        name: '20',
        value: 20
      }, {
        name: '50',
        value: 50
      }, {
        name: '100',
        value: 100
      }, {
        name: '500',
        value: 500
      }]
    };
  },

  computed: {
    selectedRows() {
      return this.$refs.dataTable.getSelected();
    },

    ...mapGetters([
      'dataCurrentPage',
      'dataPageLimit',
      'mergeCurrentPage',
      'mergePageLimit',
      'errorCurrentPage',
      'errorPageLimit'
    ])
  },

  methods: {
    constructSortQuery(columnName, sortDirection) {
      const sortType = sortDirection ? (sortDirection === 'asc' ? '+' : '-') : '+';
      this.sortQuery = columnName + sortType;
    },

    setDataPageLimit(limit) {
      this.$store.dispatch('setDataPageLimit', limit);
    },

    setMergePageLimit(limit) {
      this.$store.dispatch('setMergePageLimit', limit);
    },

    setErrorPageLimit(limit) {
      this.$store.dispatch('setErrorPageLimit', limit);
    },

    setReportsPageLimit(limit) {
      this.$store.dispatch('setReportsPageLimit', limit);
    },

    setReportsCurrentPage(page) {
      this.$store.dispatch('setReportsCurrentPage', page);
    },

    setDataCurrentPage(page) {
      this.$store.dispatch('setDataCurrentPage', page);
    },

    setMergeCurrentPage(page) {
      this.$store.dispatch('setMergeCurrentPage', page);
    },

    setErrorCurrentPage(page) {
      this.$store.dispatch('setErrorCurrentPage', page);
    },

    setSortedFields(sortedFields) {
      // This is necessary because of how bendalloy works.
      if (this.$refs.dataTable) {
        this.$refs.dataTable.sortedFields = sortedFields;
      }
    },

    searchDocuments() {
      this.showSpinner = true;
      this.fetchDocuments();
    },

    searchDocuments() {
      this.showSpinner = true;
      this.fetchDocuments();
    },

    getMatchMergeDoc(repositoryId, documentId) {
      const sourceLabel = 'Matching ID';
      MatchMergeService.getPendingMergeDocument({
        repoId: repositoryId,
        docId: documentId,
        locale: `${locale.toUpperCase()}`
      }, {}).then((response) => {
        this.showSpinner = false;
        this.setPreMergeInformation({
          mergeDoc: response.body,
          sourceLabel: `${sourceLabel}: ${response.body.attributes.SOURCEPARTYID}`,
          matchScores: JSON.parse(response.body.attributes.MATCHDATA).MatchScores
        });

        this.setMergeMessage({
          message: response.body.attributes.MESSAGE ? response.body.attributes.MESSAGE : response.body.attributes.message
        });
      }, (error) => {
        this.generalErrors.push(error.body.serviceError);
        this.$refs.errorToast.toggle();
      });
    },

    getErrorRemediationDoc(repositoryId, documentId) {
      this.showSpinner = true;
      ErrorService.lockDocument({
        repoId: repositoryId,
        docId: documentId,
        locale: `${locale.toUpperCase()}`
      }, {}).then((data) => {
        this.showSpinner = false;
        const verified = _.includes(_.flattenDeep(_.map(data.body.sourceDocument.attributes, (a) => {
          if (typeof a === 'object') {
            return _.map(a, (aa) => {
              return aa.documentId === null;
            });
          } else {
            return a.documentId === null;
          }
        })), true);
        if (verified) {
          this.showSpinner = true;
          let errInfo = this.$t("CORRUPTED_DOCUMENT") + '  ' + this.$t("REDIRECTING_BACK");
          this.generalErrors = [errInfo];
          this.$refs.errorToast.toggle();
        } else {
          this.setActiveDocument({
            doc: data.body
          });
        }
      }, (error) => {
        this.generalErrors = [error.body.serviceError];
        this.$refs.errorToast.toggle();
      });
    },

    ...mapActions([
      'setPreMergeInformation',
      'setMergeMessage'
    ])
  },

  watch: {
    dataCurrentPage(page) {
      this.$refs.dataTable.setPage(page);
      this.fetchDocuments();
    },

    reportsCurrentPage(page) {
      this.$refs.dataTable.setPage(page);
      this.fetchDocuments();
    },

    mergeCurrentPage(page) {
      this.$refs.dataTable.setPage(page);
      this.fetchDocuments();
    },

    errorCurrentPage(page) {
      this.$refs.dataTable.setPage(page);
      this.fetchDocuments();
    },

    dataPageLimit(limit) {
      this.$refs.dataTable.setLimit(limit);
      this.setDataCurrentPage(1);
      this.fetchDocuments();
    },

    reportsPageLimit(limit) {
      this.$refs.dataTable.setLimit(limit);
      this.setReportsCurrentPage(1);
      this.fetchDocuments();
    },

    errorPageLimit(limit) {
      this.$refs.dataTable.setLimit(limit);
      this.setErrorCurrentPage(1);
      this.fetchDocuments();
    },

    mergePageLimit(limit) {
      this.$refs.dataTable.setLimit(limit);
      this.setMergeCurrentPage(1);
      this.fetchDocuments();
    }
  }
};
