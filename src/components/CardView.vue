<template>
  <div>
    <ba-toolbar :showSideNavIcons="true" @open="minimizeTable" @close="maximizeTable" :side-nav-start-open="sideNavOpen" :links="links" sticky>
      <span id="cardView" slot="page-name"> {{ (isError ? 'ERROR_CARD_VIEW' : 'CARD_VIEW') | translate }}</span>
      <div class="options">
        <div class="spacer"></div>
          <div id="cancel" class="option" v-ba-tooltip="$t('BACK_TO')" @click="confirmActions('cancel')">
          <i class="ba-icon">
            <svg style="padding:5px 5px; width:24px; height:24px; max-width: 2em;" viewBox="0 0 24 24">
              <path fill="#FFFFFF" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
            </svg>
          </i>
        </div>
        <div class="option" v-ba-tooltip="$t('RELATIONSHIPS')" @click="switchtoRelationShip" v-if="showRelationshipCard">
          <i class="ba-icon">
            <svg style="padding:5px 5px; width:24px; height:24px; max-width: 2em;" viewBox="0 0 24 24">
              <path fill="#FFFFFF" d="M7.2,11.2C8.97,11.2 10.4,12.63 10.4,14.4C10.4,16.17 8.97,17.6 7.2,17.6C5.43,17.6 4,16.17 4,14.4C4,12.63 5.43,11.2 7.2,11.2M14.8,16A2,2 0 0,1 16.8,18A2,2 0 0,1 14.8,20A2,2 0 0,1 12.8,18A2,2 0 0,1 14.8,16M15.2,4A4.8,4.8 0 0,1 20,8.8C20,11.45 17.85,13.6 15.2,13.6A4.8,4.8 0 0,1 10.4,8.8C10.4,6.15 12.55,4 15.2,4Z" />
            </svg>
          </i>
        </div>
        <div id="reject" class="option" v-ba-tooltip="$t('REJECT')" @click="confirmActions('reject')" v-if="isError && features.actions.reject">
          <i class="ba-icon">
            <svg style="padding:5px 5px; width:24px; height:24px; max-width: 2em;" viewBox="0 0 24 24">
              <path fill="#E5E9E9" d="M8.27,3L3,8.27V15.73L8.27,21H15.73C17.5,19.24 21,15.73 21,15.73V8.27L15.73,3M9.1,5H14.9L19,9.1V14.9L14.9,19H9.1L5,14.9V9.1M9.12,7.71L7.71,9.12L10.59,12L7.71,14.88L9.12,16.29L12,13.41L14.88,16.29L16.29,14.88L13.41,12L16.29,9.12L14.88,7.71L12,10.59" />
            </svg>
          </i>
        </div>
<<<<<<< HEAD
        <div id="save" v-if="canSave" class="option" v-ba-tooltip="$t('SAVE')" @click="confirmActions('save')">
=======
        <div id="save" v-if="canSave" :class="['option', {'disable-save-icon': isErrorDocument }]" v-ba-tooltip="$t('SAVE')" @click="confirmActions('save')">
>>>>>>> CICD/CI_CD
          <i class="ba-icon">
            <svg style="padding:5px 5px; width:24px; height:24px; max-width: 2em;" viewBox="0 0 24 24">
              <path fill="#E5E9E9" d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" />
            </svg>
          </i>
        </div>
      </div>
    </ba-toolbar>

    <div :class="['spinner-wrapper', { maximized }]" v-if="showSpinner">
      <ba-spinner v-if="showSpinner" :indeterminate="true" :progress="40" :size="50" class="spinner"></ba-spinner>
    </div>

    <ba-content :class="['partitions', { maximized }]">
      <card-view-partition v-if="!showSpinner" class="partition" :partition="partition" v-for="partition in partitions" />
    </ba-content>

    <ba-modal ref="savePopup" size="sm" footer>
    <span slot="header">
      <span class="popup-header">save Changes</span>
    </span>
    <div class="modal-message">
      <div class="popup-text">You are about to Save {{documentId}}.</div>
      <div>Would you like to continue?</div>
    </div>
    <div slot="buttons">
      <ba-button class="ba-default flat" @click="closeSave">Cancel</ba-button>
      <ba-loader-button class="ba-primary" @click="saveChanges">Confirm</ba-loader-button>
    </div>
  </ba-modal>

  <ba-modal ref="cancelPopup" size="sm" footer>
  <span slot="header">
    <span class="popup-header">Cancel Changes</span>
  </span>
  <div class="modal-message">
    <div class="popup-text">You are about to Cancel {{documentId}}.</div>
    <div>Would you like to continue?</div>
  </div>
  <div slot="buttons">
    <ba-button class="ba-default flat" @click="closeCancel">Cancel</ba-button>
    <ba-loader-button class="ba-primary" @click="cancel">Confirm</ba-loader-button>
  </div>
  </ba-modal>

   <ba-modal ref="rejectPopup" size="sm" footer>
    <span slot="header">
      <span class="popup-header">Reject Changes</span>
    </span>
    <div class="modal-message">
      <div class="popup-text">You are about to reject  {{documentId}}.</div>
      <div>Would you like to continue?</div>
    </div>
    <div slot="buttons">
      <ba-button class="ba-default flat" @click="closeReject">Cancel</ba-button>
      <ba-loader-button class="ba-primary" @click="reject">Confirm</ba-loader-button>
    </div>
  </ba-modal>

    <div class="toast-container">
      <ba-toast ref="successToast" v-on:close="redirect" position="top">
        <i class="ba-icon ba-check" slot="icon"></i>
        <span slot="body">{{ documentId }}  {{ 'HAS_BEEN' | translate }}  {{ action === 'store' ?  action.concat('d').toUpperCase()  : action.concat('ed').toUpperCase()  | translate  }}. {{ 'REDIRECTING_BACK' | translate }}</span>
      </ba-toast>
      <ba-toast ref="errorToast" v-on:close="redirect" position="top">
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
    </div>
    <ba-modal ref="confirmUserActions" :header="false" footer>
      <span slot="header"> {{ "CONFIRM_ACTION" | translate }} </span>
      <div class="modal-message">
        <div> {{ detailedMessage }}.</div>
        <div> {{ "LIKE_TO_CONTINUE" | translate }} </div>
      </div>
      <div slot="buttons">
        <ba-button id="yes" class="ba-default flat" @click="closeModal"> {{ "NO" | translate }} </ba-button>
        <ba-loader-button id="no" @click="handleActions()" :done="done"> {{ "YES" | translate }} </ba-loader-button>
      </div>
    </ba-modal>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions } from 'vuex';
import CardViewPartition from './CardViewPartition';
import dataTable from './mixins/dataTable';
import loader from './mixins/loader';
import relationship from './mixins/relationship';
import sideNav from './mixins/sideNav';
import ErrorService from '../services/error';
import RepositoriesService from '../services/repositories';
import EventBus from './../event-bus';

export default {
  mixins: [sideNav, dataTable, loader, relationship],

  data() {
    return {
      viewType: 'cardView',
      action: '',
      generalErrors: [],
      locationHash: window.location.hash,
      canRedirect: true,
      typeOfAction: '',
      detailedMessage: '',
      showRelationshipCard: false
    }
  },

  created() {
    if (this.isError) {
      this.updateLinks('/errorremediation');
      this.getErrorDocument();
    } else {
      this.updateLinks('/dataview');
      this.validDocument();
    }
  },

  mounted() {
    EventBus.$on('relationship', (item) => {
      this.goToRelationship(item);
    })
  },

  destroyed() {
    if (this.$store.state.DataView.documentJson && this.locationHash.includes('errorcardview')) {
      ErrorService.processError({
        repoId: this.$store.state.DataView.documentJson.REPOSITORYID,
        docId: this.$store.state.DataView.documentJson.DOCUMENTID,
        action: 'cancel'
      },
        {
          action: 'cancel'
        }).then(() => {
        }, (error) => {
          console.log(error)
        });
    }
    EventBus.$off('relationship');
    if (this.$router.currentRoute.name === 'DATA_VIEW') {
      this.resetActiveDocument({});
    }
  },

  components: {
    CardViewPartition
  },

  watch: {
    '$route': 'updatedDocId'
  },

  computed: {
    repositoryId() {
      return this.$route.params.repoId;
    },

    documentId() {
      return this.$route.params.docId;
    },

    features() {
      return this.isError ? this.$root.features.ERROR_REMEDIATION : this.$root.features.DATA_VIEW;
    },

    canSave() {
      return this.features && this.features.actions ? this.features.actions.save : false;
    },

    partitions() {
      return this.activeDocumentForm ? this.activeDocumentForm.pagedContent[0].partitions : [];
    },

    isError() {
      return this.$route.path.includes("errorcardview");
    },

    isErrorDocument() {
      let validError = this.errorMessage ? this.errorMessage.length : 0; 
      return validError;
    },

    ...mapGetters([
      'activeDocument',
      'activeDocumentForm',
      'activeDocumentErrors',
      'links',
      'remediationChanges',
      'documentJson',
      'currentState',
      'errorMessage'
    ])
  },

  methods: {
    updatedDocId() {
      this.getDataViewDocument();
    },

    redirect() {
      let errorRemediation = this.$route.path.includes('errorcardview');
      if (errorRemediation && this.canRedirect) {
        this.resetActiveDocumentErrors();
        if (this.currentState.length < 1) {
          this.$router.push('/errorremediation/');
        } else {
          this.$router.push(this.currentState);
        }
      } else if (!errorRemediation && this.canRedirect) {
        this.$router.push('/dataview');
      }
    },

    confirmActions(type) {
      this.typeOfAction = type;
      this.isLoadComplete = false;
      this.detailedMessage = this.$t('ABOUT_TO') + " " + this.$t(this.typeOfAction.toUpperCase()) + " " + this.$t('DOCUMENT_WITH_ID') + " " +  this.documentId;
      this.$refs.confirmUserActions.open();
    },

    switchtoRelationShip() {
      this.$router.push(`/relationships/${this.repositoryId}/${this.documentId}`);
    },

    closeModal() {
      this.$refs.confirmUserActions.close();
    },

    saveChanges() {
      this.isLoadComplete = false;
      let path = this.$route.path;
      let isError = path.includes('errorcardview');
      if (isError) {
        this.action = "process";
        ErrorService.processError({
          repoId: this.repositoryId,
          docId: this.documentId,
          action: this.action
        },
          {
            action: this.action,
            attributes: this.remediationChanges.attributes
          }).then((response) => {
            if (response.ok) {
              this.isLoadComplete = true;
              this.canRedirect = true;
              this.$refs.successToast.toggle();
              this.closeModal();
            }
          }, error => {
            this.isLoadComplete = true;
            this.canRedirect = false;
            this.closeModal();
            this.generalErrors = error.body.validation.generalErrors;
            this.$refs.errorToast.toggle();
            this.loading = false;
          })
      } else {
        this.action = "store";
        delete this.documentJson['FORM'];
        delete this.documentJson.ATTRIBUTES['AUDIT'];
        delete this.documentJson.ATTRIBUTES['ALTERNATEIDTOCONTACTLINKS'];
        delete this.documentJson.ATTRIBUTES['ALTERNATEIDTOADDRESSLINKS'];
        delete this.activeDocument['AUDIT'];
        delete this.activeDocument['ALTERNATEIDTOCONTACTLINKS'];
        delete this.activeDocument['ALTERNATEIDTOADDRESSLINKS'];

        // Remove Attributes which were added in the state for staged changes before saving
        _.forOwn(this.activeDocument, function(value, key) {
          _.forEach(value, (v, i) => {
            if (v.CREATEDBYUSER) {
              delete v['DOCUMENTID'];
              delete v['DOCUMENTTYPE'];
              delete v['CREATEDBYUSER'];
            }
          })
        });

        _.merge(this.documentJson.ATTRIBUTES, this.activeDocument);
        let newAttrs = JSON.stringify(this.documentJson);
        newAttrs = newAttrs.replace(/"ATTRIBUTES":/g, '"attributes":');
        let newDoc = JSON.parse(newAttrs);
        RepositoriesService.updateDocument({
          repoId: this.repositoryId,
          docId: this.documentId,
          action: this.action
        }, newDoc).then((data) => {
          this.$refs.successToast.toggle();
        }, (error) => {
          this.isLoadComplete = true;
          this.canRedirect = false;
          this.closeModal();
          this.generalErrors = error.body.validation.generalErrors;
          this.$refs.errorToast.toggle();
        })
      }
    },

    validDocument() {
      if (Object.keys(this.activeDocument).length !== 0) {
        this.showRelationshipCard = this.activeDocument.PARENTRELATIONSHIPS.length > 0 || this.activeDocument.CHILDRELATIONSHIPS.length > 0
        this.showSpinner = false;
      } else {
        this.getAllRepositories();
        this.getDataViewDocument();
      }
    },

    getErrorDocument() {
      this.getAllRepositories();
      this.getErrorRemediationDoc(this.repositoryId, this.documentId);
    },

    reject() {
      this.isLoadComplete = false;
      this.action = "reject";
      this.loading = true;
      ErrorService.reject({
        repoId: this.repositoryId,
        docId: this.documentId,
        action: this.action
      },
        {
          handlingDetails: this.activeDocumentErrors
        }).then((data) => {
          this.isLoadComplete = true;
          this.canRedirect = true;
          this.$refs.successToast.toggle();
          this.loading = false;
        }, (error) => {
          this.isLoadComplete = true;
          this.canRedirect = false;
          this.closeModal();
          this.generalErrors = error.body.validation.generalErrors;
          this.$refs.errorToast.toggle();
          this.loading = false;
        })
    },

    cancel() {
      this.isLoadComplete = false;
      this.action = "cancel";
      this.canRedirect = true;
      let errorRemediation = this.$route.path.includes('errorCardView');
      if (errorRemediation) {
        ErrorService.processError({
          repoId: this.repositoryId,
          docId: this.documentId,
          action: this.action
        }, {
            action: this.action
          }).then((data) => {
            this.isLoadComplete = true;
            this.showSpinner = true;
            this.resetActiveDocument({});
            this.$refs.successToast.toggle();
          }, (error) => {
            this.isLoadComplete = true;
            this.canRedirect = false;
            this.closeModal();
            this.generalErrors = error.body.validation.generalErrors;
            this.$refs.errorToast.toggle();
          })
      } else {
        RepositoriesService.updateDocument({
          repoId: this.repositoryId,
          docId: this.documentId,
          action: this.action
        }, {
            action: this.action
          }).then((data) => {
            this.isLoadComplete = true;
            this.resetActiveDocument({});
            this.showSpinner = true;
            this.setEditStatus({
              edit: false
            });
            this.$refs.successToast.toggle();
          }, (error) => {
            this.isLoadComplete = true;
            this.canRedirect = false;
            this.closeModal();
            this.generalErrors = error.body.validation.generalErrors;
            this.$refs.errorToast.toggle();
          })
      }
    },

    goToRelationship(item) {
      window.scrollTo(0, 0);
      if (item.CATEGORY === 'Relationship') {
        this.$router.push({
          name: 'Card View',
          params: {
            repoId: this.$route.params.repoId,
            docId: item.ATTRIBUTES.RELATEDDOCUMENTID
          }
        })
        this.getDataViewDocument();
      } else {
        this.$router.push({
          name: 'Card View',
          params: {
            repoId: this.$route.params.repoId,
            docId: item.DOCUMENTID
          }
        })
        this.getDataViewDocument();
      }
    },

<<<<<<< HEAD
    returnToPrevDoc() {
      const repoId = this.$route.params.repoId;
      const documentId = this.$route.params.fromId;
      this.showSpinner = true;
      RepositoriesService.getDocument({
        repoId: repoId,
        documentId: documentId,
        nested: true
      }, {}).then((data) => {
        this.setActiveDocument({
          doc: data.body
        });
        this.$router.push(`/cardview/${repoId}/${documentId}`);
        this.showSpinner = false;
      }, (error) => {
        console.log(error);
      });
    },

    handleActions() {
      if(this.typeOfAction == 'save') {
        this.saveChanges();
      }else if(this.typeOfAction == 'cancel') {
        this.cancel();
      } else {
        this.reject();
      }
    },

=======
>>>>>>> CICD/CI_CD
    returnToPrevDoc() {
      const repoId = this.$route.params.repoId;
      const documentId = this.$route.params.fromId;
      this.showSpinner = true;
      RepositoriesService.getDocument({
        repoId: repoId,
        documentId: documentId,
        nested: true
      }, {}).then((data) => {
        this.setActiveDocument({
          doc: data.body
        });
        this.$router.push(`/cardview/${repoId}/${documentId}`);
        this.showSpinner = false;
      }, (error) => {
        console.log(error);
      });
    },

    handleActions() {
      if(this.typeOfAction == 'save') {
        this.saveChanges();
      }else if(this.typeOfAction == 'cancel') {
        this.cancel();
      } else {
        this.reject();
      }
    },

    showSavePopup() {
      this.$refs.savePopup.open();
    },
    showCancelPopup() {
      this.$refs.cancelPopup.open();
    },
    showRejectedPopup() {
      this.$refs.rejectPopup.open();
    },
    closeReject() {
      this.$refs.rejectPopup.close();
    },

    closeSave() {
      this.$refs.savePopup.close();
    },

    closeCancel() {
      this.$refs.cancelPopup.close();
    },

    ...mapActions([
      'getDocuments',
      'getAllRepositories',
      'setActiveDocument',
      'resetActiveDocument',
      'resetActiveDocumentErrors',
      'setActiveStateView',
      'setErrorMessage',
      'setEditStatus',
      'updateLinks'
    ])
  }
}
</script>

<style lang="less" scoped>
nav.toolbar div.options div.option i.ba-icon {
  color: #E5E9E9;
}
.modal-message {
    text-align: center;
    font-size: 1rem;

    & > div:first-child {
      font-weight: bold;
    }
 }

.ba-breadcrumb {
  margin-left: 250px;
  &.maximized {
    margin-left: 40px;
  }
}

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

.partitions {
  margin-left: 250px;
  transition: all .25s;
  display: flex;
  background: #F4F6F8;
  min-height: 85vh;

  .partition {
    flex: 1;
    margin: 0 10px;
    max-width: -webkit-fill-available;
    word-break: break-all;
  }

  &.maximized {
    margin-left: 40px;
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
  margin-right: 1em;
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

  .toggle-label {
    font-size: 12px;
    padding-bottom: 4px;
  }

  svg {
    transform: translateY(25%);
  }
}

.modal-message {
  text-align: center;
  font-size: 1rem;

  .popup-text {
    font-weight: bold;
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

.disable-save-icon {
  opacity: 0.3;
  pointer-events: none;
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
