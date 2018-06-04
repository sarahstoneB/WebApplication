<template>
  <div>
    <div v-if="(name == 'ADDRESSES') && validError">
    <ba-card class="error-card">
      <span slot="title" v-if="title">{{ content }}</span>
      <ba-content class="data-container">
        <div class="error-header" :class="title">
          <i class="ba-icon">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
            </svg>
          </i> 
          <span v-if="invalidError" class="error-text" v-ba-tooltip="invalidInfo">{{ invalidInfo.split('.')[0] }}</span>
        </div>
      </ba-content>
    </ba-card>    
    </div>
    
    <div class="partitions">
      <div class="title-container" v-if="title">{{ title }}</div>
      <div :class="[{ 'flexed' : partitions === 1 }, 'content-partition']" v-for="p in partitions">
        <content-description :tool-tip="c.toolTip" :name="c.name" :item="item" class="item" v-if="c.type === 'description'" :key="c.name" v-for="c in getPartitionContent(p)" />
        <content-attribute :show-label="showLabel" :display-name="c.displayName" :tool-tip="c.toolTip" :name="c.name" :item="item" :label="getLabel(c, item)" class="item" v-if="c.type === 'attribute'" :key="c.name" v-for="c in getPartitionContent(p)" />
      </div>
<<<<<<< HEAD
      <i v-if="editForm.allowModifyExisting && cardActions.edit" class="ba-icon ba-dots-vertical" @click="openOptionsMenu"></i>
=======
      <i v-if="editForm.allowModifyExisting && cardActions.edit && disableEdit" class="ba-icon ba-dots-vertical" @click="openOptionsMenu"></i>
>>>>>>> CICD/CI_CD
      <div v-if="editForm.allowModifyExisting && cardActions.edit" ref="optionsMenu" class="options-menu" tabindex="-1" @blur="closeOptionsMenu" v-show="showOptionMenu">
        <ul>
          <li v-if="editForm.allowModifyExisting && cardActions.edit" @click="openEditModal">
            <i class="ba-icon">
              <svg style="width:15px;height:15px" viewBox="0 0 20 20">
                <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
              </svg>
            </i>
            <span @click="setEdit">{{ 'EDIT' | translate }}</span>
          </li>
          <li v-if="editForm.allowDeleteExisting && cardActions.delete" @click="openRemoveModal">
            <i class="ba-icon ba-delete"></i>
            <span>{{ 'REMOVE' | translate }}</span>
          </li>
        </ul>
      </div>
      <i v-if="item.CATEGORY === 'Relationship' || item.CATEGORY === 'Party'" class="ba-icon relation-link" @click="goToRelationship(item)" v-ba-tooltip="$t('GO_TO_RELATIONSHIP')">
        <svg viewBox="0 0 24 24">
          <path d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z" />
        </svg>
      </i>
    </div>
    <div class="status-content" v-if="status">{{ status }}</div>
<<<<<<< HEAD
    <ba-modal v-if="editForm.allowModifyExisting && cardActions.edit" class="edit-form" ref="editModal" @cancel="resetStagedChanges" @ok="mergeStagedChanges" footer :language="language">
=======
    <ba-modal v-if="editForm.allowModifyExisting && cardActions.edit" class="edit-form" ref="editModal" footer>
>>>>>>> CICD/CI_CD
      <span slot="header">{{ 'EDIT' | translate }}</span>
      <div class="modal-min-height">
        <edit-section :is-nested="true" :randomDocId="randomDocId" :document-id="item.DOCUMENTID" :partitions="f.partitions" :content="f.content" :document-type="name" v-for="f in editForm.content"/>
      </div>
      <div slot="buttons">
        <ba-button id="custColCancel" class="ba-default flat" @click="closeEditModal">{{ 'CANCEL' | translate }}</ba-button>
        <ba-loader-button id="custColSave" class="ba-primary" @click="mergeStagedChange" :done="done">{{ 'SAVE' | translate }}</ba-loader-button>
      </div>            
    </ba-modal>
    <ba-modal ref="removeModal"
              :header="false"
              footer>
      <div class="modal-remove-confirm">
        {{ 'REMOVE_CARD_VIEW_CONF_PREFIX' | translate }} {{ name }} {{ 'REMOVE_CARD_VIEW_CONF_SUFFIX' | translate }}
      </div>
      <div slot="buttons">
        <ba-button id="custColCancel" class="ba-default flat" @click="closeRemoveModal">{{ 'CANCEL' | translate }}</ba-button>
        <ba-button id="custColSave" class="ba-primary" @click="removeItemFromList">{{ 'SAVE' | translate }}</ba-button>
      </div>      
    </ba-modal>
  </div>
</template>

<script>
  import _ from 'lodash';
  import { mapGetters, mapActions } from 'vuex';
  import contentPartition from './mixins/contentPartition';
  import contentLabel from './mixins/contentLabel';
  import card from './mixins/card';
  import ContentAttribute from './ContentAttribute';
<<<<<<< HEAD
=======
  import errorRemediation from './mixins/errorRemediation';
  import loader from './mixins/loader'
>>>>>>> CICD/CI_CD
  import ContentDescription from './ContentDescription';
  import EditSection from './EditSection';
  import ErrorService from '../services/error';
  import RepositoryService from '../services/repositories';
  import EventBus from './../event-bus';

  export default {
    mixins: [contentPartition, contentLabel, card, errorRemediation, loader],
    props: ['item', 'content', 'partitions', 'name', 'form', 'showLabel', 'randomDocId'],

    components: {
      ContentAttribute,
      ContentDescription,
      EditSection
    },

    data() {
      return {
        showOptionMenu: false,
        repositoryId: this.$route.params.repoId,
        documentId: this.$route.params.docId,
        action: '',
        invalidDetails: false,
        invalidError: false,
        invalidInfo: false
      };
    },

    computed: {
      title() {
        var titleItem = null
        if (this.content && this.item) {
          titleItem = _.find(this.content, c => c.slot === 'title');
        }
        return titleItem ? this.item.ATTRIBUTES[titleItem.name] : '';
      },

      status() {
        var statusItem = null
        if (this.content && this.item) {
          statusItem = _.find(this.content, c => c.slot === 'status');
        }
        return statusItem ? this.item.ATTRIBUTES[statusItem.name] : '';
      },

      validError() {
        var errors = false;
        _.each(this.errorMessage, (error) => {
          let validId = error.toLowerCase().includes('addressid') ? this.item.ATTRIBUTES.ADDRESSID : this.item.ATTRIBUTES.SOURCEPARTYID;
          if (error.includes(validId)) {
            errors = true;
          }
        });
        if (this.name == 'ADDRESSES') {
          _.each( this.activeDocumentErrors, ( val, key ) => {
            if (val[Object.keys(val)[0]]['DATA']) {
              this.invalidError = true;
              this.invalidInfo = val[Object.keys(val)[0]]['ERROR'];
              this.setErrorMessage(this.invalidInfo);
              errors = true;
            } else if (val[Object.keys(val)[0]]['data']) {
              this.invalidError = true;
              this.invalidInfo = val[Object.keys(val)[0]]['error'];
              this.setErrorMessage(this.invalidInfo);
              errors = true;
            }            
          });            
        }        
        return errors;
      },

      disableEdit() {
        let disableEdit = false;
        let errorHeaders = ['SPECIALTIES','IDENTIFIERS','LICENSES','ADDRESSES'];
        _.each( this.activeDocumentErrors, ( val, key ) => {
          if (errorHeaders.includes(key.toUpperCase()) && this.validError && this.name == key.toUpperCase()) {
            disableEdit = true;
          } else if (val[Object.keys(val)[0]]['DATA'] && this.name == 'ADDRESSES') {
            disableEdit = true;
          } else if (val[Object.keys(val)[0]]['data'] && this.name == 'ADDRESSES') {
            disableEdit = true;
          }
        });
        return disableEdit;
      },

      ...mapGetters([
        'remediationChanges',
        'documentJson',
        'activeDocumentErrors',
        'edit',
        'errorMessage'
      ])
    },

    methods: {

      getValue(attribute) {
        return this.item.ATTRIBUTES[attribute];
      },

      goToRelationship(item) {
        EventBus.$emit('relationship', item);
      },

      openEditModal() {
        this.$refs.editModal.open();
      },

      closeEditModal() {
        this.resetStagedChanges();
        this.$refs.editModal.close();
      },

      openRemoveModal() {
        this.$refs.removeModal.open();
      },

      closeRemoveModal() {
        this.resetStagedChanges()
        this.$refs.removeModal.open();
      },

      checkMergedChanges() {
        // Could initiate check for each individual value change, leaving the red on values unchanged?
        this.mergeStagedChanges();
      },

      mergeStagedChange() {
        this.validateInputs(this.repositoryId,this.documentId, 'validate','editModal');
        this.mergeStagedChanges();
      },

      openOptionsMenu() {
        this.showOptionMenu = true;
        this.$nextTick(() => {
          this.$refs.optionsMenu.focus();
        });
      },

      closeOptionsMenu() {
        this.showOptionMenu = false;
      },

      removeItemFromList() {
      this.removeItem(name, item.DOCUMENTID);
      this.closeRemoveModal();
      },

      setEdit() {
        RepositoryService.lockDocument({
          repoId: this.documentJson.REPOSITORYID,
          docId: this.documentJson.DOCUMENTID
        }, {}).then((response) => {
          if (response.ok) {
            this.setEditStatus({
              edit: true
            })
          } else {
            this.setEditStatus({
              edit: false
            })
          }
        })
      },

      ...mapActions([
        'resetStagedChanges',
        'mergeStagedChanges',
        'removeItemFromActiveDocument',
        'setEditStatus',
        'setActiveDocumentErrors',
        'setErrorMessage'
      ])
    }
  }
</script>
<style lang="less">
 .error-card.ba-card {
   margin-top: 0px;
  .ba-content {
    padding: 0px;
  }
 }
</style>
<style lang="less" scoped>
  .error-text {
    padding-left: 1em;
    position: relative;
    bottom: 6px;
  }
  .ba-card {
    padding: 0;
    .error-header {
      background: #DB4439;
      color: #FFFFFF;
      padding: 10px 0 6px 10px;

      i svg {
        fill: #FFFFFF;
      }
    }
  }
  .partitions {
    display: flex;
    padding: 15px;
    position: relative;
    border-top: 1px solid #B2C4C4;

    .title-container {
      margin-right: 10px;
      font-weight: bold;
    }

    & > i {
      position: absolute;
      right: 10px;
      top: 15px;
      cursor: pointer;
    }

    .options-menu {
      position: absolute;
      right: 10px;
      top: 15px;
      background: #FFFFFF;
      border: 1px solid #BACBCB;
      cursor: pointer;
      z-index: 9;

      ul {
        list-style: none;
        margin-bottom: 0;

        li {
          margin-bottom: 0;
          padding: 4px 16px 4px 4px;

          i {
            color: #E5E9E9;
            margin-right: 5px;

            svg {
              fill: #E5E9E9;
            }
          }

          &:hover {
            background: #F4F6F8;
          }
        }
      }
    }
  }

  .relationship {
    cursor: pointer;
    color: blue;
    text-decoration: underline;
    padding-left: 10px;
  }

  .relation-link {
    svg {
      fill: #BACBCB;
      height: 20px;
      width: 20px;
    }
  }

  .control-button {
    background: #4395D5;
    height: 35px;
    width: 35px;
    border-radius: 50%;
    cursor: pointer;
    flex: auto;
    margin: 0 0 10px 10px;
    position: relative;

    i {
      position: relative;
      left: 5px;
      top: 4px;
      color: #4395D5;

      svg {
        height: 24px;
        width: 24px;
        fill: #E5E9E9;
      }
    }
  }

  .status-content {
    background: rgba(0, 0, 0, 0.05);
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding: 5px 10px;
    font-size: 0.75rem;
  }

  .modal-min-height {
    min-height: 200px;
  }

  .modal-remove-confirm {
    min-height: 100px;
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    padding-top: 30px;
    word-break: break-word;
  }

  .content-partition {
    margin-right: 20px;
    word-break: break-word;
    flex: 1;
  }
</style>
