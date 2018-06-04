<template>
  <div>
    <ba-toolbar :showSideNavIcons="true" @open="minimizeTable" @close="maximizeTable" :side-nav-start-open="sideNavOpen" :links="links" sticky>
      <span id="matchAndMerge" slot="page-name">{{ 'MATCH_MERGE' | translate }}</span>
      <div class="options">
        <div class="merge-message" v-if="typeof mergeMessage !== 'undefined'">
          <label class="merge-message-label">{{ 'MERGE' | translate }}</label>
          <p class="merge-message-content">{{ mergeMessage }}</p>
        </div>
<<<<<<< HEAD
<<<<<<< HEAD
        <div class="option" v-ba-tooltip='"Back"' @click="cancel">
=======
        <div class="option" v-ba-tooltip="$t('BACK_TO')" @click="confirmActions('cancel')">
>>>>>>> DSUI/master_vue
=======
        <div class="option" v-ba-tooltip="$t('BACK_TO')" @click="confirmActions('cancel')">
>>>>>>> CICD/CI_CD
          <i class="ba-icon">
            <svg style="padding:5px 5px; width:24px; height:24px; max-width: 2em;" viewBox="0 0 24 24">
              <path fill="#FFFFFF" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
            </svg>
          </i>
        </div>
      </div>
    </ba-toolbar>
    <div :class="['main-wrapper', { maximized }]">
<<<<<<< HEAD
<<<<<<< HEAD
      <div v-if="!showSpinner" class="source-document">
        <div class="source-document-name">
          <span>{{ sourceDocument.LABEL }}</span>
          <div class="control-button-container">
            <!-- reject -->
            <div class="control-button" tooltip="Reject" @click="confirmActions('reject')" v-if="features.actions.reject">
              <i class="ba-icon">
                <svg viewBox="0 0 24 24">
                  <path fill="#FFFFFF" d="M8.27,3L3,8.27V15.73L8.27,21H15.73C17.5,19.24 21,15.73 21,15.73V8.27L15.73,3M9.1,5H14.9L19,9.1V14.9L14.9,19H9.1L5,14.9V9.1M9.12,7.71L7.71,9.12L10.59,12L7.71,14.88L9.12,16.29L12,13.41L14.88,16.29L16.29,14.88L13.41,12L16.29,9.12L14.88,7.71L12,10.59" />
                </svg>
              </i>
            </div>
            <!-- create -->
            <div class="control-button" tooltip="Create Master Party" @click="confirmActions('create')" v-if="allowCreate && features.actions.create">
              <i class="ba-icon">
                <svg viewBox="0 0 24 24">
                  <path fill="#FFFFFF" d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                </svg>
              </i>
            </div>
          </div>
        </div>
        <merge-attributes :attributes="mergeGroups.attribute" :document="sourceDocument"></merge-attributes>
        <merge-nested-grids :nestedGrids="mergeGroups.nestedGrid" :document="sourceDocument" :ceilings="nestedGridItemCeilings" ></merge-nested-grids>
        <merge-nested-groups :nestedGroups="mergeGroups.nestedGroupBy" :document="sourceDocument" :sorting="nestedGroupByItemSortings"></merge-nested-groups>
      </div>
      <div v-if="!showSpinner" :class="{ 'matched-multi-wrapper': matchedDocuments.length > 1, 'matched-single-wrapper': matchedDocuments.length == 1 }">
        <div class="matched-document" :key="matchedDoc.ATTRIBUTES.MERZI" v-for="matchedDoc in matchedDocuments">
          <div class="matched-document-name">
            <span>{{ matchedDocumentLabel(matchedDoc) }}</span>
=======
      <div class="sample">
        <div :class="['source-tab', {'sticky-source-tab' : isScrolled}]">
        </div>  
        <div v-if="!showSpinner" class="source-document" ref="sourceDocument" :class="[{'source-sticky-row' : ('.source-document&&.sticky-row')},{'sticky-row' : isScrolled},{'on-maximized': !maximized}]">
          <div :class="['source-document-name',{'source-document-name-toggled': (isScrolled && (!maximized))}]">
            <span>{{ sourceDocument.LABEL }}</span>
>>>>>>> DSUI/master_vue
            <div class="control-button-container">
              <!-- reject -->
              <div class="control-button" v-ba-tooltip="$t('REJECT')" @click="confirmActions('reject')" v-if="features.actions.reject">
=======
      <div class="sample">
        <div :class="['source-tab', {'sticky-source-tab' : isScrolled}]">
        </div>
        <div v-if="!showSpinner" class="source-document" ref="sourceDocument" :class="[{'source-sticky-row' : ('.source-document&&.sticky-row')},{'sticky-row' : isScrolled},{'on-maximized': !maximized}]">
          <div :class="['source-document-name',{'source-document-name-toggled': (isScrolled && (!maximized))}]">
            <span>{{ sourceDocument.LABEL }}</span>
            <div class="control-button-container">
              <!-- reject -->
              <div class="control-button" v-ba-tooltip="$t('REJECT')" @click="confirmActions('reject')" v-if="features.actions.reject && allowReject">
>>>>>>> CICD/CI_CD
                <i class="ba-icon">
                  <svg viewBox="0 0 24 24">
                    <path fill="#FFFFFF" d="M8.27,3L3,8.27V15.73L8.27,21H15.73C17.5,19.24 21,15.73 21,15.73V8.27L15.73,3M9.1,5H14.9L19,9.1V14.9L14.9,19H9.1L5,14.9V9.1M9.12,7.71L7.71,9.12L10.59,12L7.71,14.88L9.12,16.29L12,13.41L14.88,16.29L16.29,14.88L13.41,12L16.29,9.12L14.88,7.71L12,10.59" />
                  </svg>
                </i>
              </div>
<<<<<<< HEAD
<<<<<<< HEAD
              <!-- merge -->
              <div class="control-button" tooltip="Merge" @click="confirmActions('merge',matchedDoc)" v-if="features.actions.merge">
=======
              <!-- create -->
              <div id="createMasterParty" class="control-button" v-ba-tooltip="$t('MASTER_PARTY')" @click="confirmActions('create')" v-if="allowCreate && features.actions.create">
>>>>>>> DSUI/master_vue
=======
              <!-- create -->
              <div id="createMasterParty" class="control-button" v-ba-tooltip="$t('MASTER_PARTY')" @click="confirmActions('create')" v-if="allowCreate && features.actions.create">
>>>>>>> CICD/CI_CD
                <i class="ba-icon">
                  <svg viewBox="0 0 24 24">
                    <path fill="#FFFFFF" d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                  </svg>
                </i>
              </div>
            </div>
          </div>
          <div :class="['source-attribute',{'sticky-source-document' : isScrolled},{'source-attribute-toggled': (isScrolled && (!maximized))}]">
            <merge-attributes :attributes="mergeGroups.attribute" :document="sourceDocument"></merge-attributes>
          </div>
          <merge-nested-grids :nestedGrids="mergeGroups.nestedGrid" :document="sourceDocument" :ceilings="nestedGridItemCeilings" ></merge-nested-grids>
          <merge-nested-groups :nestedGroups="mergeGroups.nestedGroupBy" :document="sourceDocument" :sorting="nestedGroupByItemSortings"></merge-nested-groups>
        </div>
      </div>
      <div v-if="!showSpinner" :class="[{ 'matched-multi-wrapper': matchedDocuments.length > 1, 'matched-single-wrapper': matchedDocuments.length == 1 }]">
        <div class="tab-screen">
          <div style="float:left" v-if="navigateLeft">
            <svg :class="['navigate-icon', {'sticky-left-icon' : isScrolled}, {}]" viewBox="0 0 24 24" @click="getPreviousRecord" v-if="showNext">
              <path fill="#287bb2"  d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
            </svg>
<<<<<<< HEAD
          </div>          
          <div :class="['matched-tab', {'sticky-tab' : isScrolled}, {'multiple-matched-tab' : (navigateRight || navigateLeft)}, {'multiple-sticky-tab' : ((navigateRight || navigateLeft) && isScrolled)},{'toggle-multiple-matched-tab' : ((navigateRight || navigateLeft) && (!maximized))},{'toggle-multiple-sticky-tab' : (((navigateRight || navigateLeft) && (!maximized)) && isScrolled)},{'toggle-left-multiple-matched-tab' : (((navigateRight || navigateLeft) && !navigateLeft) && (!maximized))},{'toggle-left-multiple-sticky-tab' : ((((navigateRight || navigateLeft) && !navigateLeft) && (!maximized)) && isScrolled)}]" ref="matchedTab">
            <transition-group :name="showLeftTransiton ? 'toggle-backward' : 'toggle-forward'" tag="ul">
              <li  v-for="(matchedDoc, index) in matchedDocs" :key="matchedDoc.ATTRIBUTES.MERZID" @click="showTab(matchedDoc)" :class="[{'active': ((currentTab === matchedDoc) || ((initialActiveDocument === matchedDoc) && activateFirstDocument   )) }]">
                <span class="match_progress">{{ matchedDoc.ATTRIBUTES.MERZID }} - 100%</span>
=======
          </div>
          <div :class="['matched-tab', {'sticky-tab' : isScrolled}, {'multiple-matched-tab' : (navigateRight || navigateLeft)}, {'multiple-sticky-tab' : ((navigateRight || navigateLeft) && isScrolled)},{'toggle-multiple-matched-tab' : ((navigateRight || navigateLeft) && (!maximized))},{'toggle-multiple-sticky-tab' : (((navigateRight || navigateLeft) && (!maximized)) && isScrolled)},{'toggle-left-multiple-matched-tab' : (((navigateRight || navigateLeft) && !navigateLeft) && (!maximized))},{'toggle-left-multiple-sticky-tab' : ((((navigateRight || navigateLeft) && !navigateLeft) && (!maximized)) && isScrolled)}]" ref="matchedTab">
            <transition-group :name="showLeftTransiton ? 'toggle-backward' : 'toggle-forward'" tag="ul">
              <li  v-for="(matchedDoc, index) in matchedDocs" :key="matchedDoc.ATTRIBUTES.MERZID" @click="showTab(matchedDoc)" :class="[{'active': ((currentTab === matchedDoc) || ((initialActiveDocument === matchedDoc) && activateFirstDocument   )) }]">
                <span class="match_progress">{{ matchedDoc.ATTRIBUTES.MERZID }} - {{matchScores[matchedDoc.DOCUMENTKEY].toFixed(2)}}%</span>
>>>>>>> CICD/CI_CD
              </li>
            </transition-group>
          </div>
          <div style="float:right" v-if="navigateRight">
            <svg :class="['navigate-icon', {'sticky-right-icon' : isScrolled}]" style="margin-left: -3em;" viewBox="0 0 24 24" @click="getNextRecord" v-if="showNext">
              <path fill="#287bb2" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
            </svg>
          </div>
        </div>
        <div class="matched-documents">
<<<<<<< HEAD
          <div class="matched-document"  :key="matchedDoc.ATTRIBUTES.MERZI" v-for="(matchedDoc, index) in matchedDocuments" :class=" [{'active': (currentTab === matchedDoc || (index === 0 && currentTab == null))} ,{'deactive-document': !(currentTab === matchedDoc || (index === 0 && currentTab == null))} , {'sticky-row' : isScrolled},,{'on-toggle-matched-document': !maximized}]">
=======
          <div class="matched-document"  :key="matchedDoc.ATTRIBUTES.MERZID" v-for="(matchedDoc, index) in matchedDocuments" :class=" [{'active': (currentTab === matchedDoc || (index === 0 && currentTab == null))} ,{'deactive-document': !(currentTab === matchedDoc || (index === 0 && currentTab == null))} , {'sticky-row' : isScrolled},,{'on-toggle-matched-document': !maximized}]">
>>>>>>> CICD/CI_CD
            <div :class="['matched-document-name',{'matched-document-name-toggled': (isScrolled && (!maximized))}]">
              <span>{{ matchedDocumentLabel(matchedDoc) }}</span>
              <div class="control-button-container">
                <!-- link -->
                <div class="control-button inactive" v-ba-tooltip="$t('LINK')" v-if="features.actions.link">
                  <i class="ba-icon">
                    <svg viewBox="0 0 24 24">
                      <path fill="#FFFFFF" d="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z" />
                    </svg>
                  </i>
                </div>
                <!-- merge -->
                <div class="control-button" v-ba-tooltip="$t('MERGE')" @click="confirmActions('merge',matchedDoc)" v-if="features.actions.merge">
                  <i class="ba-icon">
                    <svg viewBox="0 0 24 24">
                      <path fill="#FFFFFF" d="M17,20.41L18.41,19L15,15.59L13.59,17M7.5,8H11V13.59L5.59,19L7,20.41L13,14.41V8H16.5L12,3.5" />
                    </svg>
                  </i>
                </div>
              </div>
            </div>
            <div :class="['matched-attribute',{'sticky-matched-document' : isScrolled},{'matched-attribute-toggled': (isScrolled && (!maximized))}]">
              <merge-attributes :attributes="mergeGroups.attribute" :document="matchedDoc" matched></merge-attributes>
            </div>
            <merge-nested-grids :nestedGrids="mergeGroups.nestedGrid" :document="matchedDoc" :ceilings="nestedGridItemCeilings" matched></merge-nested-grids>
            <merge-nested-groups :nestedGroups="mergeGroups.nestedGroupBy" :document="matchedDoc" :sorting="nestedGroupByItemSortings" matched></merge-nested-groups>
          </div>
        </div>
      </div>
      <ba-spinner v-if="showSpinner" :indeterminate="true" :progress="40" :size="50" class="spinner"></ba-spinner>
    </div>
    <ba-modal ref="confirmUserActionsModal" :header="false" footer>
      <span slot="header">{{ displayHeader }}</span>
      <div class="modal-message">
        <div>{{ displayMessage }}</div>
<<<<<<< HEAD
<<<<<<< HEAD
        <div>Would you like to continue?</div>
=======
        <div>{{ "LIKE_TO_CONTINUE" | translate }}</div>
>>>>>>> CICD/CI_CD
      </div>
      <div slot="buttons">
        <ba-button class="ba-default flat" @click="closeModal">{{ "NO" | translate }}</ba-button>
        <ba-loader-button @click="handleActions" :class="{ 'btn-disabled' : isBtnLoading }" :done="done">{{ "YES" | translate }}</ba-loader-button>
      </div>
    </ba-modal>
<<<<<<< HEAD

=======
        <div>{{ "LIKE_TO_CONTINUE" | translate }}</div>
      </div>
      <div slot="buttons">
        <ba-button class="ba-default flat" @click="closeModal">{{ "NO" | translate }}</ba-button>
        <ba-loader-button @click="handleActions" :done="done">{{ "YES" | translate }}</ba-loader-button>
      </div>
    </ba-modal>
>>>>>>> DSUI/master_vue
    <div class="toast-container">
      <ba-toast ref="successToast" v-on:close="redirect" position="top">
        <i class="ba-icon ba-check" slot="icon"></i>
        <span slot="body" v-if="(action === 'store' || action ==='merge')">{{ documentId }} {{ HAS_BEEN | translate }} {{ action.concat('d').toUpperCase() | translate }}</span>
=======
    <div class="toast-container">
      <ba-toast ref="successToast" v-on:close="redirect" position="top">
        <i class="ba-icon ba-check" slot="icon"></i>
        <span slot="body" v-if="(action === 'store' || action ==='merge')">{{ documentId }} {{ 'HAS_BEEN' | translate }} {{ action.concat('d').toUpperCase() | translate }}. {{ 'REDIRECTING_BACK' | translate }}</span>
        <span slot="body" v-else-if="(action ==='createNew')">{{ documentId }} {{ 'HAS_BEEN' | translate }} {{ 'CREATED' | translate }}. {{ 'REDIRECTING_BACK' | translate }}</span>
>>>>>>> CICD/CI_CD
        <span slot="body" v-else>{{ documentId }} {{ 'HAS_BEEN' | translate }} {{ action === 'cancel' ? action.concat('ed').toUpperCase() : 'REJECTED' | translate }}. {{ 'REDIRECTING_BACK' | translate }}</span>
      </ba-toast>
      <ba-toast ref="errorToast" v-on:close="redirect" position="top">
        <i class="ba-icon ba-alert-circle" slot="icon"></i>
        <div slot="body">{{ "FOLLOWING_ERRORS" | translate }} {{ action }}  {{ "ON_DOCUMENT" | translate }} {{ documentId }}.
          <ol slot="body">
            <li v-for="error in generalErrors">{{ error }}</li>
          </ol>
        </div>
      </ba-toast>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import { mapGetters, mapActions } from 'vuex';
  import sideNav from './mixins/sideNav';
  import dataTable from './mixins/dataTable'
  import loader from './mixins/loader'
  import MergeAttributes from './MergeAttributes';
  import MergeNestedGrids from './MergeNestedGrids';
  import MergeNestedGroups from './MergeNestedGroups';
  import MatchMergeService from '../services/matchmerge';

  export default {
    mixins: [sideNav, dataTable, loader],

    components: {
      MergeAttributes,
      MergeNestedGrids,
      MergeNestedGroups
    },

    data() {
      return {
        repositoryId: this.$route.params.repoId,
        documentId: this.$route.params.docId,
        action: '',
        generalErrors: [],
        activeMatchedDocument: {},
<<<<<<< HEAD
<<<<<<< HEAD
=======
        showSpinner: true,
>>>>>>> CICD/CI_CD
        canRedirect: true,
        currentTab : null,
        index: 0,
        maxMatchTab: 3,
        isScrolled : false,
        typeOfAction: '',
        displayHeader: '',
<<<<<<< HEAD
        displayMessage: ''
=======
        showSpinner: true,
        canRedirect: true,
        currentTab : null,
        index: 0,
        maxMatchTab: 3,
        isScrolled : false,
        typeOfAction: '',
        displayHeader: '',
        displayMessage: '',
        tabHeight : 0,
        showNext : true,
        activateFirstDocument : true
>>>>>>> DSUI/master_vue
=======
        displayMessage: '',
        tabHeight : 0,
        showNext : true,
        activateFirstDocument : true,
        isBtnLoading: false
>>>>>>> CICD/CI_CD
      };
    },

    created() {
      this.updateLinks('/pendingmerges');
      this.getMatchMergeDoc(this.repositoryId, this.documentId);
    },

    mounted() {
      window.addEventListener('scroll', this.scrollHandler);
    },

    updated() {
      this.tabHeight = this.$refs.matchedTab ? this.$refs.matchedTab.offsetHeight : 0;
    },


    computed: {

<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> CICD/CI_CD
      navigateRight() {
        return (this.matchedDocuments.length > this.maxMatchTab)  && ((this.index + 1) <  this.chunkedArray.length)
      },

      navigateLeft() {
        return this. index > 0;
      },

<<<<<<< HEAD
>>>>>>> DSUI/master_vue
=======
>>>>>>> CICD/CI_CD
      features() {
        return this.$root.features && this.$root.features.MATCH_AND_MERGE ? this.$root.features.MATCH_AND_MERGE : {};
      },

      chunkedArray() {
        return _.chunk(this.matchedDocuments, this.maxMatchTab)
      },

      initialActiveDocument() {
        return this.matchedDocuments[0];
      },

      matchedDocs() {
        return this.chunkedArray[this.index];
      },

      mergeGroups() {
        const types = ['attribute', 'nestedGrid', 'nestedGroupBy'];
        return _.groupBy(_.filter(_.get(this.mergeForm, 'form.gridContent', []), i => types.includes(i.type)), 'type');
      },

      nestedGridItemCeilings() {
        return _.reduce(this.mergeGroups.nestedGrid, (result, ng) => {
          const sourceItems = _.get(this.sourceDocument, `ATTRIBUTES.${ng.name}`, []);
          const comparisonKeys = _.map(_.find(this.mergeForm.form.gridContent, ['name', ng.name]).gridContent, 'name');
          result[ng.name] = _.reduce(this.matchedDocuments, (num, md) => {
            const newNum = _.uniqWith(_.without([].concat(sourceItems, md.ATTRIBUTES[ng.name]), undefined), (i, o) => _.isEqual(_.pick(i.ATTRIBUTES, comparisonKeys), _.pick(o.ATTRIBUTES, comparisonKeys))).length;
            if (newNum > num) {
              num = newNum;
            }

            return num;
          }, sourceItems.length);
          return result;
        }, {});
      },

      nestedGroupByItemSortings() {
        return _.reduce(this.mergeGroups.nestedGroupBy, (result, ng) => {
          const sourceItems = _.get(this.sourceDocument, `ATTRIBUTES.${ng.name}`, []);
          const groupByKey = _.find(this.mergeForm.form.gridContent, ['name', ng.name]).groupByContents.groupBy.name;
          const groupByValue = _.find(this.mergeForm.form.gridContent, ['name', ng.name]).groupByContents.value.name;
          const sharedValues = [];
          const newValues = [];
          const oldValues = [];

          const allKeys = _.reduce(this.matchedDocuments, (keys, md) => {
            const matchedItems = _.get(md, `ATTRIBUTES.${ng.name}`, []);
            const matchedKeys = _.map(matchedItems, i => i.ATTRIBUTES[groupByKey]);
            keys = _.uniq(_.concat(keys, matchedKeys));
            return keys;
          }, _.map(sourceItems, i => i.ATTRIBUTES[groupByKey]));


          _.each(allKeys, (k) => {
            const sourceValues = _.map(_.filter(sourceItems, i => i.ATTRIBUTES[groupByKey] === k), s => s.ATTRIBUTES[groupByValue]);
            const matchedValues = _.uniq(_.map(_.filter(_.without(_.flatten(_.map(this.matchedDocuments, md => md.ATTRIBUTES[ng.name])), undefined), i => i.ATTRIBUTES[groupByKey] === k), m => m.ATTRIBUTES[groupByValue]));

            const diff1 = _.isEmpty(_.difference(sourceValues, matchedValues));
            const diff2 = _.isEmpty(_.difference(matchedValues, sourceValues));

            if ((diff1 && diff2) || (diff1 && !diff2)) {
              sharedValues.push(k);
            } else if (diff1) {
              newValues.push(k);
            } else {
              oldValues.push(k);
            }
          });

          result[ng.name] = _.concat(newValues, sharedValues, oldValues);
          return result;
        }, {});
      },

      mergeDocID() {
        return _.get(this.activeMatchedDocument, 'ATTRIBUTES.MERZID', '');
      },

      merzEU() {
        return (this.$root.appDeployEnvName === 'eu' || this.$root.appDeployEnvName === 'EU');
      },

      ...mapGetters([
        'sourceDocument',
        'matchedDocuments',
        'mergeForm',
        'mergeMessage',
        'links',
        'changes',
        'allowCreate',
<<<<<<< HEAD
=======
        'allowReject',
>>>>>>> CICD/CI_CD
        'currentState',
        'matchScores'
      ])
    },

    methods: {
      getNextRecord() {
        this.showLeftTransiton = false;
        this.index++;
      },

      getPreviousRecord() {
        this.showLeftTransiton = true;
        this.index--;
      },

      matchedDocumentLabel(matchedDoc) {
        let label = matchedDoc.DOCUMENTID;
        if (this.mergeForm && !_.isEmpty(matchedDoc)) {
          const gridContent = _.get(this.mergeForm, 'form.gridContent', []);
          const labelForm = _.find(gridContent, ['name', 'MDMPARTYID']);
          if (labelForm && labelForm.cases) {
            const defaultCase = _.find(labelForm.cases, c => c.default !== undefined);
            if (defaultCase) {
              const displayName = _.get(defaultCase, 'default.content.displayName', '');
              const displayValue = _.get(defaultCase, 'default.content.name', 'MDMPARTYID');
              label = `${displayName} ${matchedDoc.ATTRIBUTES[displayValue]}`.toUpperCase();
            }
          }
        }
        return label;
      },

<<<<<<< HEAD
<<<<<<< HEAD
      getPendingDocuments() {
        MatchMergeService.getPendingMergeDocument({
        repoId: this.repositoryId,
        docId: this.documentId
      }, {}).then((response) => {
        this.showSpinner = false;
        this.setPreMergeInformation({
          mergeDoc: response.body,
          sourceLabel: `${response.body.attributes.SOURCESYSTEM}: ${response.body.attributes.SOURCEPARTYID}`
        });
        this.setMergeMessage({
          message: response.body.attributes.MESSAGE ? response.body.attributes.MESSAGE : response.body.attributes.message
        });
      }, (error) => {
        this.generalErrors.push(error.body.serviceError);
        this.$refs.errorToast.toggle();
        console.log(error.body.serviceError);
         if(error.body.serviceError.includes('lock')){
          this.showSpinner = true;
          this.$router.push(`/pendingmerges/${this.showSpinner}`);
        }
        else
        this.showSpinner = false;
      });
=======
=======
>>>>>>> CICD/CI_CD
      matchedScore(matchedDoc) {
        return `${Math.round(this.matchScores[matchedDoc.DOCUMENTKEY] * 100) / 100}%`;
      },

      scrollHandler() {
        if (typeof this.$refs.sourceDocument != 'undefined' && window.innerWidth > 695 ) {
          if (this.$refs.sourceDocument.offsetTop === 110) {
            this.isScrolled = window.pageYOffset + 90 >= this.$refs.sourceDocument.offsetTop + 43;
          } else {
            this.isScrolled = window.pageYOffset + 90 >= this.$refs.sourceDocument.offsetTop;
          }
        }
<<<<<<< HEAD
>>>>>>> DSUI/master_vue
=======
>>>>>>> CICD/CI_CD
      },

      redirect() {
        if (this.canRedirect) {
          if (this.currentState.length < 1) {
            this.$router.push('/pendingmerges/');
          } else {
            this.$router.push(this.currentState);
          }
        }
      },

      cancel() {
        this.showSpinner = true;
        this.action = 'cancel';
        this.isLoadComplete = false;
        MatchMergeService.resolvePendingDocument(
          {
            repoId: this.repositoryId,
            docId: this.documentId,
            action: this.action
          },
          {
            action: this.action
          }
        ).then((data) => {
          this.isLoadComplete = true;
          this.canRedirect = true;
          if (data.ok) {
            this.$refs.successToast.toggle();
            this.loading=false;
          }
        }, (error) => {
          this.isLoadComplete = true;
          this.canRedirect = false;
          this.closeModal();
          this.error = error;
          this.generalErrors = this.error.body.validation.generalErrors;
          this.$refs.errorToast.toggle();
          this.loading=true;
        });
      },

      confirmActions(type, matchedDoc) {
        this.typeOfAction = type;
<<<<<<< HEAD
<<<<<<< HEAD
        this.displayHeader = (type === 'create') ? 'Create New Master Document': 'Confirm Your Action';
=======
        this.displayHeader = (type === 'create') ? this.$t('NEW_MASTER_DOCUMNET') : this.$t('CONFIRM_ACTION');
>>>>>>> DSUI/master_vue
=======
        this.displayHeader = (type === 'create') ? this.$t('NEW_MASTER_DOCUMNET') : this.$t('CONFIRM_ACTION');
>>>>>>> CICD/CI_CD
        if (matchedDoc) {
          this.activeMatchedDocument = matchedDoc;
        }
        this.isLoadComplete = false;
        this.displayMessages();
        this.$refs.confirmUserActionsModal.open();
      },

      closeModal() {
        this.$refs.confirmUserActionsModal.close();
<<<<<<< HEAD
=======
      },

      showTab(matchedDocument) {
        this.activateFirstDocument = false;
        this.currentTab = matchedDocument;
       },

      addItem (matchedDocument) {
        const removed = this.limitedMatchedDocuments.splice(0, 1);
        this.limitedMatchedDocuments.push(
          ...this.moreMatchedDocuments.splice(this.moreMatchedDocuments.indexOf(matchedDocument), 1)
        )
        this.moreMatchedDocuments.push(...removed);
        this.$refs.dropdown.toggle();
        this.showTab(matchedDocument);
>>>>>>> DSUI/master_vue
      },

      showTab(matchedDocument) {
        this.activateFirstDocument = false;
        this.currentTab = matchedDocument;
       },

      addItem (matchedDocument) {
        const removed = this.limitedMatchedDocuments.splice(0, 1);
        this.limitedMatchedDocuments.push(
          ...this.moreMatchedDocuments.splice(this.moreMatchedDocuments.indexOf(matchedDocument), 1)
        )
        this.moreMatchedDocuments.push(...removed);
        this.$refs.dropdown.toggle();
        this.showTab(matchedDocument);
      },

      mergeDocuments() {
        this.action = 'merge';
        this.isLoadComplete = false;
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> DSUI/master_vue
=======
>>>>>>> CICD/CI_CD
        // get all inserted nested documents
        // grid documents
        _.each(this.mergeGroups.nestedGrid, (nestedGrid) => {
          const comparisonKeys = _.map(nestedGrid.gridContent, 'name');
          const newDocuments = _.map(_.differenceWith(this.sourceDocument.ATTRIBUTES[nestedGrid.name], this.activeMatchedDocument.ATTRIBUTES[nestedGrid.name], (i, o) => _.isEqual(_.pick(i.ATTRIBUTES, comparisonKeys), _.pick(o.ATTRIBUTES, comparisonKeys))), d => Number(d.DOCUMENTID));
          if (!_.isEmpty(newDocuments)) {
            this.addNestedDocuments({
              name: nestedGrid.name,
              documentIds: newDocuments
            });
          }
        });

        // group documents
        _.each(this.mergeGroups.nestedGroupBy, (ng) => {
          const sourceItems = _.get(this.sourceDocument, `ATTRIBUTES.${ng.name}`, []);
          const matchedItems = _.get(this.activeMatchedDocument, `ATTRIBUTES.${ng.name}`, []);
          const groupByKey = _.find(this.mergeForm.form.gridContent, ['name', ng.name]).groupByContents.groupBy.name;
          const groupByValue = _.find(this.mergeForm.form.gridContent, ['name', ng.name]).groupByContents.value.name;
          const sourceKeys = _.uniq(_.map(sourceItems, i => i.ATTRIBUTES[groupByKey]));
          let newDocuments = [];

          _.each(sourceKeys, (k) => {
            const sourceValues = _.filter(sourceItems, i => i.ATTRIBUTES[groupByKey] === k);
            const matchedValues = _.filter(matchedItems, i => i.ATTRIBUTES[groupByKey] === k);
            const newValues = _.map(_.differenceWith(sourceValues, matchedValues, (i, o) => i.ATTRIBUTES[groupByValue] === o.ATTRIBUTES[groupByValue]), d => Number(d.DOCUMENTID));
            newDocuments = _.concat(newDocuments, newValues);
          });

          if (!_.isEmpty(newDocuments)) {
            this.addNestedDocuments({
              name: ng.name,
              documentIds: newDocuments
            });
          }
        });

        MatchMergeService.resolvePendingDocument({
          repoId: this.repositoryId,
          docId: this.documentId,
          action: this.action
        }, {
          action: this.action,
          reason: 'Testing',
          matchDocumentId: Number(this.activeMatchedDocument.DOCUMENTID),
          merge: this.changes
        }).then(() => {
          this.isLoadComplete = true;
          this.isBtnLoading = false;
          this.resetChanges();
          this.$refs.successToast.toggle();
          this.loading=false;
        }, (error) => {
          this.isLoadComplete = true;
          this.isBtnLoading = false;
          this.canRedirect = false;
          this.closeModal();
          this.error = error;
          this.generalErrors = this.error.body.validation.generalErrors;
          this.$refs.errorToast.toggle();
          this.loading=true;
        });
      },

      rejectDocument() {
        this.action = 'reject';
        this.isLoadComplete = false;
        MatchMergeService.resolvePendingDocument({
          repoId: this.repositoryId,
          docId: this.documentId,
          action: this.action
        }, {
          action: this.action,
          reason: 'Testing',
          matchDocumentId: Number(this.activeMatchedDocument.DOCUMENTID)
        }).then(() => {
          this.isLoadComplete = true;
          this.isBtnLoading = false;
          this.$refs.successToast.toggle();
          this.loading=false;
        }, (error) => {
          this.isLoadComplete = true;
          this.isBtnLoading = false;
          this.canRedirect = false;
          this.closeModal();
          this.error = error;
          this.generalErrors = this.error.body.validation.generalErrors;
          this.$refs.errorToast.toggle();
          this.loading=true;
        });
      },

      createNewDocument() {
        this.action = 'createNew';
        this.isLoadComplete = false;
        MatchMergeService.resolvePendingDocument({
          repoId: this.repositoryId,
          docId: this.documentId,
          action: this.action
        }, {
          action: this.action,
          reason: 'Testing',
          matchDocumentId: Number(this.activeMatchedDocument.DOCUMENTID)
        }).then(() => {
          this.isLoadComplete = true;
          this.isBtnLoading = false;
          this.$refs.successToast.toggle();
        }, (error) => {
          this.isLoadComplete = true;
          this.isBtnLoading = false;
          this.canRedirect = false;
          this.closeModal();
          this.error = error;
          this.generalErrors = this.error.body.validation.generalErrors;
          this.$refs.errorToast.toggle();
<<<<<<< HEAD
          this.loading=true;
=======
          setTimeout(() => {
            this.isBtnLoading = false;
          }, 1000)
>>>>>>> CICD/CI_CD
        });
      },
      displayMessages() {
        if (this.typeOfAction == 'create') {
<<<<<<< HEAD
<<<<<<< HEAD
          this.displayMessage = 'You are about to make ' + this.sourceDocument.LABEL + ' a new master record.';
=======
          this.displayMessage = this.$t('ABOUT_TO') + ' ' + this.$t(this.typeOfAction.toUpperCase()) + this.sourceDocument.LABEL + ' ' + this.$t('NEW_MASTER_RECORD');
>>>>>>> CICD/CI_CD
        } else if (this.typeOfAction == 'merge') {
          this.displayMessage = this.$t('ABOUT_TO') + ' ' + this.$t(this.typeOfAction.toUpperCase()) + this.sourceDocument.LABEL + ' into '+ this.matchedDocumentLabel(this.activeMatchedDocument)+'.';
        } else {
<<<<<<< HEAD
          this.displayMessage = 'You are about to '+ this.typeOfAction +' the document with Id '+ this.documentId +'.';
=======
          this.displayMessage = this.$t('ABOUT_TO') + ' ' + this.$t(this.typeOfAction.toUpperCase()) + this.sourceDocument.LABEL + ' ' + this.$t('NEW_MASTER_RECORD');
        } else if (this.typeOfAction == 'merge') {
          this.displayMessage = this.$t('ABOUT_TO') + ' ' + this.$t(this.typeOfAction.toUpperCase()) + this.sourceDocument.LABEL + ' into '+ this.matchedDocumentLabel(this.activeMatchedDocument)+'.';
        } else {
          this.displayMessage = this.$t('ABOUT_TO') + ' ' + this.$t(this.typeOfAction.toUpperCase()) + ' ' +  this.$t('DOCUMENT_WITH_ID')+ ' ' + this.documentId +'.';
>>>>>>> DSUI/master_vue
=======
          this.displayMessage = this.$t('ABOUT_TO') + ' ' + this.$t(this.typeOfAction.toUpperCase()) + ' ' +  this.$t('DOCUMENT_WITH_ID')+ ' ' + this.documentId +'.';
>>>>>>> CICD/CI_CD
        }
      },

      handleActions() {
        this.isBtnLoading = true;
        if (this.typeOfAction == 'cancel') {
          this.cancel();
        } else if (this.typeOfAction == 'reject') {
          this.rejectDocument();
        } else if (this.typeOfAction == 'merge') {
          this.mergeDocuments();
        } else {
          this.createNewDocument();
        }
      },

      ...mapActions([
        'addNestedDocuments',
        'resetChanges',
        'setPreMergeInformation',
        'setMergeMessage',
        'updateLinks'
      ])
    }
  };
</script>

<style lang="less">
@source-width: ~"calc(50vw - 3.009em)";
@matched-width: ~"calc(50vw - 3.3em)";

  .more-dropdown .dropdown-content {
    max-height :300px;
    overflow : auto;
    right : 0;
  }
  .more-dropdown .toggle-button i.more-dropdown-icon, .more-dropdown .dropdown-content li a {
    font-size : 100%;
  }
  .toolbar.fixed  {
    z-index : 101;
  }
  .sticky-tab, .sticky-source-tab {
    position: fixed;
    top: 50px;
    width: ~"calc(50vw - 2.8em)" !important;
    background-color: #F4F5F7;
    z-index : 2;
  }
  .source-document {
    border-top: 44px !important;
    border-top-color: #F4F5F7 !important;
  }
  .source-sticky-row{
    border-top: 44px !important;
    border-top-color: #F4F5F7 !important;
  }
  .sticky-row .source-document-name{
    padding-left : 23px;
  }
  .sticky-row .grid-caption {
    padding-top: 20px;
  }
  .different i {
    z-index : 1;
  }
  .sticky-source-document{
    position: fixed;
    top: 144px;
    width: @source-width;
  }
  .multiple-matched-tab {
    width: ~"calc(50vw - 6.7em)" !important;
  }
  .sticky-left-icon {
    position: fixed;
    top:50px;
    z-index: 3;
  }
  .sticky-right-icon {
    position: fixed;
    top:50px;
    z-index: 3;
  }
  .multiple-sticky-tab {
    width: ~"calc(50vw - 3em)" !important;
    overflow: hidden;
  }
  .sticky-matched-document{
    position: fixed;
    top: 144px;
    width: @matched-width;
  }
</style>

<style lang="less" scoped>
<<<<<<< HEAD
=======
  .btn-disabled {
    pointer-events: none;
  }
>>>>>>> CICD/CI_CD

  .maximize-enter-active {
    animation: maximize 0.25s;
  }

  .maximize-leave-active {
    animation: minimize 0.25s;
  }

  @keyframes minimize {
    0% {
      margin-left: -250px;
    }
    100% {
      margin-left: 0;
    }
  }

  @keyframes maximize {
    0% {
      margin-left: 0;
    }
    100% {
      margin-left: -250px;
    }
  }

  .options {
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
    min-width: 100px;

    .option {
      color: #ffffff;
      margin-right: 20px;
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
        color: #e5e9e9;
      }

      svg {
        transform: translateY(25%);
      }

    }

    .merge-message {
      flex: 2;
      font-size: 12px;
      overflow: hidden;

      &-label {
        color: #babcbc;
        margin-bottom: 0;
        margin-top: 5px;
        text-transform: uppercase;
      }

      &-content {
        color: #ffffff;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }

  .source-document {
    -ms-overflow-style: -ms-autohiding-scrollbar;
    max-width:50%;
    overflow:hidden;
    border-top : 1px solid #C8D5D5;
  }
  .main-wrapper {
    margin-left: 250px;
    transition: all .25s;
    display: flex;
    background-color: #f5f6f8;
    min-height: ~"calc(100vh - 112px)";

    &.maximized {
      margin-left: 39px;
      .matched-multi-wrapper {
        overflow-x: hidden;
        overflow-y: hidden;
        -ms-overflow-style: -ms-autohiding-scrollbar;
        width : 50%;
      }

       .matched-document {
          min-width:~"calc(50vw - 3.4em)";
            display : none;
            &.active {
              display : block;
            }
        }
        .matched-document-name {
          border-top : 1px solid #C8D5D5;
        }

      .matched-documents {
        border-left : 1px solid #C8D5D5;
        clear : both;
      }
    }

    .spinner {
      margin: 0;
      position: relative;
      top: 50%;
      transform: translate(-50%, 470%);
    }    
    .source-document, .matched-document {
      margin-right: 8px;
      border-right: 1px solid #C8D5D5;
      border-left: 1px solid #C8D5D5;
      min-width:~"calc(50vw - 37px)";
      flex: auto;

      &-name {
        height: 50px;
        line-height: 50px;
        padding-left: 20px;
        font-size: 14px;
        font-weight: bold;
        background-color: #FFF;
        border-bottom: 3px solid #C8D5D5;
        display: flex;
        text-transform: uppercase;

        & > span:first-child {
          flex: 1;
        }
      }
    }

    .on-maximized {
      min-width: ~"calc(50vw - 150px)";
    }

    .matched-single-wrapper {
      height: 110vh;
      .matched-document {
        max-width: ~"calc(50vw - 138px)";
      }
    }

    .control-button-container {
      display: flex;

      .control-button {
        background: #4395D5;
        height: 35px;
        width: 35px;
        border-radius: 50%;
        cursor: pointer;
        flex: auto;
        margin: 8px 20px 0 0;
        position: relative;
        &:hover {
          background : #5298c6;
        }
        &.inactive {
          background: #ABBABC;
          cursor: default;
        }

        i {
          position: relative;
          left: 5px;

          svg {
            height: 24px;
            width: 24px;
          }
        }
      }
    }
  }

  .spacer {
    flex: 1;
  }

  .modal-message {
    text-align: center;
    font-size: 1rem;

    & > div:first-child {
      font-weight: bold;
    }
  }

  .matched-tab {
    width: ~"calc(50vw - 2.7em)";
    height: 3.7em;
    float: left;
  }
  .source-tab {
    width: 97%;
    height: 3.7em;
    float: left;
  }

  .matched-tab ul {
    margin : 0;
    padding : 0;
    float : left;
    width : 200%;
  }
  .sample{
    width: 50%;
    height: 110vh;
  }
  .matched-tab > ul > li {
    font-size : 100%;
    padding : 12px 22px !important;
    width : 14%;
    text-align : center;
    margin : 0;
    list-style : none;
    float : left;
    font-weight : bold;
    cursor : pointer;
    padding-right: 8px !important;
    &.active {
      border-bottom : 2px solid #4395D5;
      color : #4395D5;
      cursor : initial;
    }
  }
 .more-dropdown .dropdown-content {
    max-height :300px;
    overflow : auto;
    right : 0;
  }

  .sticky-row .source-document-name, .sticky-row.active .matched-document-name {
    position: fixed;
    top: 93.5px;
    width : ~"calc(50vw - 4.28em)";
    z-index : 2;
  }
  .sticky-row .source-document-name {
    width : ~"calc(50vw - 57px)";
  }
  .navigate-icon {
    padding:5px 5px;
    width:24px;
    height:24px;
    max-width: 2em;
    margin-top: 0.4em;
    cursor: pointer;
  }

  .navigate-icon:hover {
    background: #ABBABC;
    border-radius: 2em;
  }

  .match_progress {
    text-transform: uppercase;
  }

  .toggle-forward-leave-active {
    transition: 0.6s;
  }

  .toggle-forward-enter-active {
    transition: 0.6s;
  }

  .toggle-forward-enter-to {
    transform: translate(-300%, 0);
  }

  .toggle-forward-leave-to {
    transform: translate(-300%, 0);
  }

  .toggle-backward-leave-active {
    transition: 0s;
  }

  .toggle-backward-enter-active {
    transition: 0.6s;
  }

  .toggle-backward-enter {
    transform: translate(-400%, 0);
  }

  .toggle-backward-leave {
    transform: translate(0, 0);
  }

  .on-toggle-matched-document {
    min-width: 0 !important;
    width: ~"calc(50vw - 130px)"
  }
  .deactive-document {
    display: none ;
  }
  .source-document-name-toggled {
    width: ~"calc(50vw - 170px)" !important;
  }
  .matched-document-name-toggled, .source-attribute-toggled {
    width: ~"calc(50vw - 150px)" !important;
  }
  .matched-attribute-toggled {
    width: ~"calc(50vw - 130px)" !important;
  }
  .toggle-multiple-matched-tab {
    overflow: hidden;
    width: ~"calc(50vw - 15em)" !important;
  }
  .toggle-left-multiple-matched-tab {
    overflow: hidden;
    width: ~"calc(50vw - 12em)" !important;
  }
  .toggle-left-multiple-sticky-tab, .toggle-multiple-sticky-tab {
    width: ~"calc(50vw - 11em)" !important;
  }
</style>
