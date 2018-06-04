<template>
  <div>
    <ba-toolbar :showSideNavIcons="true" @open="minimizeTable" @close="maximizeTable" :side-nav-start-open="sideNavOpen" :links="links" sticky>
      <span slot="page-name">{{ 'RECORD_VIEW' | translate }}</span>
      <div class="options">
        <div class="spacer"></div>

        <div class="option" @click="cancel" v-ba-tooltip='"Back"'>
          <i class="ba-icon">
            <svg style="padding:5px 5px; width:24px; height:24px; max-width: 2em;" viewBox="0 0 24 24">
              <path fill="#FFFFFF" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
            </svg>
          </i>
        </div>

        <div v-show="activeDocumentForm" class="viewtype-select">
          <ba-select v-model="viewType" :options="viewTypes" @change="goToView"></ba-select>
        </div>
      </div>
    </ba-toolbar>

    <ba-content :class="['partitions', { maximized }]">

      <div class="record-container">
        <ba-spinner v-if="showSpinner" :indeterminate="true" :progress="40" :size="50" class="spinner"></ba-spinner>

        <div v-if="!showSpinner">
          <expansion-panel>
              <expandable-content :openByDefault="true" :title="'RECORD DETAILS' | translate">
              <div class="table-container">
                <table :class="['nested-table', 'merge-table', { maximized }, { 'maximize-right': maximizedRight }]">
                  <thead>
                    <tr>
                      <th>{{ 'NAME' | translate }}</th>
                      <th>{{ 'VALUE' | translate }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(value, key) in this.documentAttributes" v-bind:key="value.key">
                      <td>{{ key.replace('__', '') }}</td>
                      <td>{{ value }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </expandable-content>

            <expandable-content :title="'ADDRESS' | translate" v-if="addresses && addresses.length > 0">
              <table
                     :class="['nested-table', 'merge-table', { maximized }, { 'maximize-right': maximizedRight }]"
                     v-for="address in this.addresses"
                     v-bind:key="address.key">
                <thead>
                  <tr>
                    <th>{{ 'ADDRESS' | translate }} {{ 'NAME' | translate }}</th>
                    <th>{{ 'ADDRESS' | translate }} {{ 'VALUE' | translate }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(value, key) in address.ATTRIBUTES" v-bind:key="value.key">
                    <td width="30%">{{ key }}</td>
                    <td width="70%">{{ value }}</td>
                  </tr>
                </tbody>
              </table>
            </expandable-content>

            <expandable-content :title="'CONTACT' | translate" v-if="contacts && contacts.length > 0">
              <table
                     :class="['nested-table', 'merge-table', { maximized }, { 'maximize-right': maximizedRight }]"
                     v-for="contact in this.contacts"
                     v-bind:key="contact.key">
                <thead>
                  <tr>
                    <th>{{ 'CONTACT' | translate }} {{ 'NAME' | translate }}</th>
                    <th>{{ 'CONTACT' | translate }} {{ 'VALUE' | translate }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(value, key) in contact.ATTRIBUTES" v-bind:key="value.key">
                    <td width="30%">{{ key }}</td>
                    <td width="70%">{{ value }}</td>
                  </tr>
                </tbody>
              </table>
            </expandable-content>

            <expandable-content :title="'ALTERNATE IDENTIFIER' | translate" v-if="alternateIdentifiers && alternateIdentifiers.length > 0">
              <table
                     :class="['nested-table', 'merge-table', { maximized }, { 'maximize-right': maximizedRight }]"
                     v-for="identifier in this.alternateIdentifiers"
                     v-bind:key="identifier.key">
                <thead>
                  <tr>
                    <th>{{ 'ALTERNATE_IDENTIFIER' | translate }} {{ 'NAME' | translate }}</th>
                    <th>{{ 'ALTERNATE_IDENTIFIER' | translate }} {{ 'VALUE' | translate }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(value, key) in identifier.ATTRIBUTES" v-bind:key="value.key">
                    <td width="30%">{{ key }}</td>
                    <td width="70%">{{ value }}</td>
                  </tr>
                </tbody>
              </table>
            </expandable-content>

            <expandable-content :title="'SPECIALTY' | translate" v-if="specialties && specialties.length > 0">
              <table
                     :class="['nested-table', 'merge-table', { maximized }, { 'maximize-right': maximizedRight }]"
                     v-for="specialty in this.specialties"
                     v-bind:key="specialty.key">
                <thead>
                  <tr>
                    <th>{{ 'SPECIALTY' | translate }} {{ 'NAME' | translate }}</th>
                    <th>{{ 'SPECIALTY' | translate }} {{ 'VALUE' | translate }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(value, key) in specialty.ATTRIBUTES" v-bind:key="value.key">
                    <td width="30%">{{ key }}</td>
                    <td width="70%">{{ value }}</td>
                  </tr>
                </tbody>
              </table>
            </expandable-content>

            <expandable-content :title="'RELATIONSHIP' | translate" v-if="relationship && relationship.length > 0">
              <table
                     :class="['nested-table', 'merge-table', { maximized }, { 'maximize-right': maximizedRight }]"
                     v-for="relationship in this.relationship"
                     v-bind:key="relationship.key">
                <thead>
                  <tr>
                    <th>{{ 'RELATIONSHIP' | translate }} {{ 'NAME' | translate }}</th>
                    <th>{{ 'RELATIONSHIP' | translate }} {{ 'VALUE' | translate }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(value, key) in relationship.ATTRIBUTES" v-bind:key="value.key">
                    <td width="30%">{{ key }}</td>
                    <td width="70%">{{ value }}</td>
                  </tr>
                </tbody>
              </table>
            </expandable-content>

            <expandable-content :title="'PARENTRELATIONSHIPS' | translate" v-if="parentRelationships && parentRelationships.length > 0">
              <table
                     :class="['nested-table', 'merge-table', { maximized }, { 'maximize-right': maximizedRight }]"
                     v-for="relationship in this.parentRelationships"
                     v-bind:key="relationship.key">
                <thead>
                  <tr>
                    <th>{{ 'RELATIONSHIPS' | translate }} {{ 'NAME' | translate }}</th>
                    <th>{{ 'RELATIONSHIPS' | translate }} {{ 'VALUE' | translate }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(value, key) in relationship.ATTRIBUTES" v-bind:key="value.key">
                    <td width="30%">{{ key }}</td>
                    <td width="70%">{{ value }}</td>
                  </tr>
                </tbody>
              </table>
            </expandable-content>

            <expandable-content :title="'CHILDRELATIONSHIPS' | translate" v-if="childRelationships && childRelationships.length > 0">
              <table
                     :class="['nested-table', 'merge-table', { maximized }, { 'maximize-right': maximizedRight }]"
                     v-for="relationship in this.childRelationships"
                     v-bind:key="relationship.key">
                <thead>
                  <tr>
                    <th>{{ 'RELATIONSHIPS' | translate }} {{ 'NAME' | translate }}</th>
                    <th>{{ 'RELATIONSHIPS' | translate }} {{ 'VALUE' | translate }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(value, key) in relationship.ATTRIBUTES" v-bind:key="value.key">
                    <td width="30%">{{ key }}</td>
                    <td width="70%">{{ value }}</td>
                  </tr>
                </tbody>
              </table>
            </expandable-content>

            <expandable-content :title="'AUDIT' | translate" v-if="audits && audits.length > 0">
              <table
                     :class="['nested-table', 'merge-table', { maximized }, { 'maximize-right': maximizedRight }]"
                     v-for="audit in this.audits"
                     v-bind:key="audit.key">
                <thead>
                  <tr>
                    <th>{{ 'AUDIT' | translate }} {{ 'NAME' | translate }}</th>
                    <th>{{ 'AUDIT' | translate }} {{ 'VALUE' | translate }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(value, key) in audit.ATTRIBUTES" v-bind:key="value.key">
                    <td width="30%">{{ key }}</td>
                    <td v-if="value.includes('[')" class="clickable-record" width="70%" @click="openRecordDetails(value, key)">{{ truncate(parseJSON(value)[0]) }}</td>
                    <td v-else-if="value.includes('{')" class="clickable-record" width="70%" @click="openRecordDetails(value, key)">{{ truncate(value) }}</td>
                    <td v-else width="70%">{{ value }}</td>
                  </tr>
                </tbody>
              </table>
            </expandable-content>

            <expandable-content :title="'AUDIT_HISTORY' | translate" v-if="audithistory && audithistory.length > 0">
              <table
                     :class="['nested-table', 'merge-table', { maximized }, { 'maximize-right': maximizedRight }]"
                     v-for="audithistory in this.audithistory"
                     v-bind:key="audithistory.key">
                <thead>
                  <tr>
                    <th>{{ 'AUDIT_HISTORY' | translate }} {{ 'NAME' | translate }}</th>
                    <th>{{ 'AUDIT_HISTORY' | translate }} {{ 'VALUE' | translate }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(value, key) in audithistory.ATTRIBUTES" v-bind:key="value.key">
                    <td width="30%">{{ key }}</td>
                    <td v-if="value.includes('[')" class="clickable-record" width="70%" @click="openRecordDetails(value, key)">{{ truncate(parseJSON(value)[0]) }}</td>
                    <td v-else-if="value.includes('{')" class="clickable-record" width="70%" @click="openRecordDetails(value, key)">{{ truncate(value) }}</td>
                    <td v-else width="70%">{{ value }}</td>
                  </tr>
                </tbody>
              </table>
            </expandable-content>
          </expansion-panel>
        </div>
      </div>
    </ba-content>

    <ba-modal ref="recordDetails" size="md">
      <span slot="header">{{ selectedRecord }}</span>
      <span slot="body">
        <div class="record-details">
          <span v-if="recordDetails && recordDetails.constructor === Object">
            <li v-for="(value, index) in recordDetails">{{ value }}</li>
          </span>
          <span v-else>{{ recordDetails }}</span>
        </div>
      </span>
    </ba-modal>

    <ba-modal ref="cancelPopup" size="sm" @ok="cancel" footer>
    <span slot="header">
      <span class="popup-header">Cancel Changes</span>
    </span>
    <div class="modal-message">
      <div class="popup-text">You are about to Cancel  {{documentId}}.</div>
      <div>Would you like to continue?</div>
    </div>
    <div slot="buttons">
      <ba-button class="ba-default flat" @click="closeCancel">Cancel</ba-button>
      <ba-loader-button class="ba-primary" @click="cancel">Confirm</ba-loader-button>
    </div>
    </ba-modal>
    <div class="toast-container">
      <ba-toast ref="successToast" v-on:close="redirect" position="top">
        <i class="ba-icon ba-check" slot="icon"></i>
        <span slot="body">{{ documentId }} has been {{ action }}ed. Redirecting back to Dataview table.</span>
      </ba-toast>
      <ba-toast ref="errorToast" position="top">
        <i class="ba-icon ba-alert-circle" slot="icon"></i>
        <div slot="body">The following error(s) occurred while trying to perform {{ action }} on document {{ documentId }}.
          <ol slot="body">
            <li v-for="error in generalErrors">
              {{ error }}
            </li>
          </ol>
        </div>
      </ba-toast>
    </div>
     <ba-modal ref="confirmUserActions" :header="false" footer>
      <span slot="header">Confirm your Action</span>
      <div class="modal-message">
        <div>You are about to cancel the document with Id {{ documentId }}.</div>
        <div>Would you like to continue?</div>
      </div>
      <div slot="buttons">
        <ba-button class="ba-default flat" @click="closeModal">No</ba-button>
        <ba-loader-button @click="cancel" :done="done">Yes</ba-loader-button>
      </div>
    </ba-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import sideNav from './mixins/sideNav'
import loader from './mixins/loader'
import CardViewPartition from './CardViewPartition'
import RepositoriesService from '../services/repositories'
import ExpansionPanel from './ExpansionPanel'
import ExpandableContent from './ExpandableContent'


export default {
  mixins: [sideNav, loader],
  components: {
    'expansion-panel': ExpansionPanel,
    'expandable-content': ExpandableContent
  },

  data() {
    return {
      viewTypes: [{
        name: this.$t('CARD_VIEW'),
        value: 'cardView'
      }, {
        name: this.$t('RECORD_VIEW'),
        value: 'recordView'
      }],
      action: '',
      selectedRecord: '',
      viewType: 'recordView',
      nested: true,
      documentAttributes: [],
      document: [],
      addresses: [],
      contacts: [],
      alternateIdentifiers: [],
      specialties: [],
      relationship: [],
      relationships: [],
      parentRelationships: [],
      childRelationships: [],
      audits: [],
      audithistory: [],
      isToggledRecordDetails: false,
      recordDetails: [],
      isToggledAddress: false,
      isToggledContact: false,
      isToggledIdentifier: false,
      isToggledSpecialties: false,
      isToggledRelationship: false,
      isToggledRelationships: false,
      isToggledAudits: false,
      isToggledAudithistory: false,
    }
  },

  created() {
    this.getSelectedDocument();
  },

  computed: {

    fromId() {
      return this.$route.params.fromId;
    },

    repositoryId() {
      return this.$route.params.repoId;
    },

    documentId() {
      return this.$route.params.docId;
    },

    dataSet: {
      cache: false,
      get() {
        return this.activeDocument ? this.activeDocument[this.card.name] : [];
      }
    },

    ...mapGetters([
      'activeDocumentForm',
      'activeDocument',
      'documentJson',
      'links'
    ])
  },

  methods: {
    openRecordDetails(value, key) {
      let parsedJSON = this.parseJSON(value);
      this.selectedRecord = key;
      this.recordDetails = (key === 'LOG') ? _.omitBy(parsedJSON, _.isObject) : parsedJSON;
      if (parsedJSON && parsedJSON.length > 0) {
        this.$refs.recordDetails.open();
      }
    },

    parseJSON(value) {
      try {
        let parsedValues = JSON.parse(value);

        //TODO: Remove while implementing lineage view.
         if (Object.prototype.toString.call(parsedValues).slice(8, -1) === 'Object') {
          return value;
        } else if (parsedValues.length === 0) {
          return '';
        } else {
          return parsedValues;
        }
      } catch (exception) {
        return value;
      }
    },

    returnToPrevDoc() {
      this.showSpinner = true;
      RepositoriesService.getDocument({
        repoId: this.repositoryId,
        documentId: this.fromId,
        nested: true
      }, {}).then((data) => {
        this.setActiveDocument({
          doc: data.body
        });
        this.$router.push(`/recordview/${this.repositoryId}/${this.fromId}`);
        this.showSpinner = false;
      }, (error) => {
        console.log(error);
      });
    },

    truncate(string) {
      return (string && string.length > 120) ? string.substring(0, 120) + '...' : string;
    },

    redirect() {
      this.setActiveStateView('cardview')
      this.$router.push('/dataview');
    },

    getSelectedDocument() {
      this.showSpinner = false;
      this.document = _.omit(this.documentJson, ["FORM"]);
      this.documentAttributes = _.omitBy(this.document.ATTRIBUTES, _.isObject);
      let nestedDocs = _.pickBy(this.document.ATTRIBUTES, _.isObject);
      this.contacts = nestedDocs.CONTACTS;
      this.addresses = nestedDocs.ADDRESSES;
      this.alternateIdentifiers = nestedDocs.ALTERNATEIDENTIFIERS;
      this.specialties = nestedDocs.SPECIALTIES;
      this.relationship = nestedDocs.RELATIONSHIP;
      this.relationships = nestedDocs.RELATIONSHIPS;
      this.parentRelationships = nestedDocs.PARENTRELATIONSHIPS;
      this.childRelationships = nestedDocs.CHILDRELATIONSHIPS;
      this.audits = nestedDocs.AUDITS ? nestedDocs.AUDITS : nestedDocs.AUDIT;
      this.audithistory = nestedDocs.AUDITHISTORY;
    },

    goToView(selectedViewType) {
      if (selectedViewType === "recordView") {
        this.setActiveStateView('recordview');
        this.$router.push({name: 'Record View',
          params: {
            repoId: this.repositoryId,
            docId: this.documentId,
            fromId: this.$route.params.fromId
          }
        })
      } else if (selectedViewType === "cardView") {
        this.setActiveStateView('cardview');
        this.$router.push({name: 'Card View',
          params: {
            repoId: this.repositoryId,
            docId: this.documentId,
            fromId: this.$route.params.fromId
          }
        })
      }
    },

    getDocument() {
      this.showSpinner = true;
        RepositoriesService.getDocument({
          repoId: this.repositoryId,
          documentId: this.documentId,
          nested: true
        }, {}).then((data) => {
          this.showSpinner = false;
          this.setActiveDocument({
            doc: data.body
          });
          this.getSelectedDocument();
        }, (error) => {
          this.generalErrors = error.body.serviceError;
          this.showSpinner = false;
          this.$refs.errorToast.toggle();
        });
    },

    cancel() {
      this.isLoadComplete = false;
      this.action = "cancel"
        RepositoriesService.updateDocument({
          repoId: this.repositoryId,
          docId: this.documentId,
          action: this.action
        }, {
          action: this.action
        }).then((data) => {
          this.isLoadComplete = true;
          this.resetActiveDocument({});
          this.setEditStatus({
            edit: false
          });
          this.$refs.successToast.toggle()
        }, (error) => {
          this.generalErrors = error.body.validation.generalErrors;
          this.$refs.errorToast.toggle();
        })
    },

    closeCancel() {
      this.$refs.cancelPopup.close();
    },

    showCancelPopup() {
      this.$refs.cancelPopup.open();
    },

    toggleAll(open) {
      this.isToggledRecordDetails = this.isToggledAudits = this.isToggledAddress = this.isToggledContact =
      this.isToggledIdentifier = this.isToggledSpecialties = this.isToggledAudithistory =
      this.isToggledRelationship = this.isToggledRelationships = open;
    },

    toggle(name) {
      let isOpen = this[name];
      this.toggleAll(false);
      this[name] = !isOpen;
    },

    confirmActions() {
      this.isLoadComplete = false;
      this.$refs.confirmUserActions.open();
    },

    closeModal() {
      this.$refs.confirmUserActions.close();
    },


    ...mapActions([
      'setActiveDocument',
      'setActiveStateView',
      'setEditStatus',
      'resetActiveDocument'
    ])
  }
}
</script>


<style lang="less" scoped>

.back-to-doc {
  position: absolute;
  margin-left: 250px;
  padding-left: 25px;
  transition: all .25s;
  background: #F4F6F8;
  .back-to-doc-action {
    cursor: pointer;
  }
  span {
    font-size: 12px;
  }
  svg {
    transform: translateY(25%);
    fill: #000000;
  }

  &.maximized {
    margin-left: 40px;
    padding-left: 25px;
  }
}

nav.toolbar div.options div.option i.ba-icon {
  color: #E5E9E9;
}

.maximize-enter-active {
  animation: maximize .25s;
}

.maximize-leave-active {
  animation: minimize .25s;
}

.spacer {
  flex: 1;
}

.options {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  min-width: 100px;
  margin-right: 12px;
}

.option {
  color: #FFFFFF;
  cursor: pointer;
  svg {
    &:hover {
      width: 30px;
      height: 30px;
      margin-bottom: 10px;
      background-color: #5298C5;
      border-radius: 250px;
    }
  }

  span {
    color: #E5E9E9;
    font-size: 12px;
  }

  .modal-message {
    text-align: center;
    font-size: 1rem;

    .popup-text {
      font-weight: bold;
    }
  }
  .toggle-label {
    font-size: 12px;
    padding-bottom: 4px;
  }

  svg {
    transform: translateY(25%);
  }
}

.viewtype-select {
  padding: 3px 26px 0 26px;
}

.ba-select {
  margin-top: 0;
  width: 140px;
  text-align: left;
}

.partitions {
  padding: 0px;
  margin-left: 250px;
  transition: all .25s;

  .partition {
    flex: 1;
    margin: 0 10px;
    max-width: -webkit-fill-available;
    word-break: break-all;
  }

  &.maximized {
    margin-left: 40px;
  }

  .spinner {
    margin: 0;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 470%);
  }
}

.record-container {
  padding: 25px;
  background-color: #F4F6F8;
  min-height: 85vh;
}

.table-name {
  height: 26px;
  background-color: #f9f9f9;
  font-weight: bolder;
  border-top: solid 2px #BACBCB;
  border-bottom: solid 2px #BACBCB;
  padding-top: 9px;
  margin-bottom: 10px;
  padding-left: 10px;
  cursor: pointer;

  span,
  i {
    float: right;
    padding: 0 5px 0 0;
  }
}

.nested-table {
  width: 100%;
  font-size: 12px;
  margin-bottom: 0;
  white-space: normal;

  td {
    word-wrap: break-word;
  }

  td, tr, th, thead {
    padding-left: 23px; padding-right: 23px;
    border-left: 0; border-right: 0;
  }

  tr:last-child {
    border-bottom: 0;
  }
}

.clickable-record {
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    background-color: #F4F6F8;
  }
}

.record-details {
  max-height: 500px;
  overflow-y: auto;
}

.modal-message {
    text-align: center;
    font-size: 1rem;

    & > div:first-child {
      font-weight: bold;
    }
 }

@keyframes minimize {
  0% {
    margin-left: -250px;
  }
  100% {
    margin-left: 0px;
  }
}

@keyframes maximize {
  0% {
    margin-left: 0px;
  }
  100% {
    margin-left: -250px;
  }
}
</style>
