<template>
  <div>
    <ba-toolbar :showSideNavIcons="true" @open="minimizeTable" @close="maximizeTable" :side-nav-start-open="sideNavOpen" :links="links" sticky>
      <span slot="page-name">{{'LINEAGE_VIEW' | translate}}</span>
      <div class="spacer"></div>
      <div class="option" @click="cancel">
        <i class="ba-icon">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="#E5E9E9" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </i>
        <span>{{ 'CANCEL' | translate }}</span>
      </div>
    </ba-toolbar>
  <div :class="['partitions', { maximized }]">
    <ba-data-table v-if="!showSpinner"
                   :table-data="auditData"
                   :table-data-length="auditData.length"
                   :paginationChoices="paginationChoices"
                   @rowDblClicked="showAuditHistory"
                   clickable use-api
                   sticky-header
    >
    </ba-data-table>
  </div>
  <div>
    <ba-modal ref="changes">
      <span slot="header">
        <span>  PARTY CHANGES </span>
      </span>
      <span slot="body">
        <ba-data-table :table-data="partyChanges" :table-data-length="partyChanges.length" :paginationChoices="paginationChoices"></ba-data-table>
      </span>
    </ba-modal>
  </div>
</div>
</template>

<script>
import _ from 'lodash'
import sideNav from './mixins/sideNav'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [sideNav],

  created() {
    this.getSelectedDocument();
  },

  data() {
    return {
      showSpinner: true,
      repositoryId: this.$route.params.repoId,
      documentId: this.$route.params.docId,
      audits: [],
      auditHistory: [],
      auditData: [],
      partyChanges: []
    };
  },

  computed: {
    ...mapGetters([
      'documentJson',
      'links'
    ])
  },

  mounted() {
    this.auditData = this.getAuditData();
    this.partyChanges = this.getPartyChanges();
  },

  methods: {
    getSelectedDocument() {
      this.showSpinner = false;
      this.auditHistory = this.documentJson.ATTRIBUTES.AUDITHISTORY;
    },

    cancel() {
      this.$router.push('/dataview');
    },

    getAuditData() {
      let array = [];
      let attrs = this.documentJson.ATTRIBUTES;
      _.forEach(this.auditHistory, function(value, index) {
        let newObject = _.defaults (
          {
            'DATE': value.DATEMODIFIED,
            'DOCUMENTID': value.DOCUMENTID,
            'CHGID': value.USERMODIFIED,
            'SRCID': value.ATTRIBUTES.SOURCESYSTEM,
            'MDMPARTYID': value.ATTRIBUTES.MDMPARTYID,
            'ACCOUNTPHASESTATUS': attrs.ACCOUNTPHASESTATUS,
            'ACCOUNTTYPE': attrs.ACCOUNTTYPE
          }
        );
        array.push(newObject);
      });
      return array;
    },

  getPartyChanges() {
    let tableData = [];
    //let changes = this.documentJson.ATTRIBUTES.PARTYCHANGES; Supply partychanges object.
    let changes =  JSON.parse('{"Name": {"t": "c", "p": "U6", "v": "Clinics/Doctors"}, "FullName": {"t": "a", "v": "Clover Park Technical College"}}');
    _.forOwn(changes, function(value, key) {
      let newObject = _.defaults (
        {
          'Attribute Name': key,
          'Action': value.t == 'a'? 'ADD': 'CHANGE',
          'Previous Value': value.p,
          'Current Value': value.v
        }
      )
      tableData.push(newObject);
    });
    return tableData;
  },

  showAuditHistory(row) {
    console.log(this.documentJson);
    if (_.has(this.documentJson.ATTRIBUTES, 'AUDITHISTORY')) {
      this.$refs.changes.open();
    } else {
      // for SIT if it is Audits....
    }
  },

  ...mapActions([
    'setActiveDocument',
    'setActiveStateView'
  ])
  }
}

</script>

<style lang="less" scoped>
.spacer {
  flex: 1;
}
.partitions {
  margin-left: 250px;
  transition: all .25s;
  width: auto;
  height: ~"calc(100vh - 152px)";
  overflow-y: hidden;
  &.maximized {
    margin-left: 40px;
  }
}

.option {
  color: #FFFFFF;
  padding: 6px 24px;
  cursor: pointer;
  text-align: center;

  span {
    color: #E5E9E9;
    font-size: 12px;
  }

  .toggle-label {
    font-size: 12px;
    padding-bottom: 4px;
  }

  svg {
    transform: translateY(25%);
  }
}
</style>
