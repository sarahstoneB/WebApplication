<template>
  <div class="page">
<<<<<<< HEAD
    <content-section :partitions="c.partitions" :showLabel="showLabel" :content="c.content" :data-set="dataSet" v-for="c in content" />
    <i v-if="editForm.allowModifyExisting && cardActions.edit" class="ba-icon ba-dots-vertical" @click="openOptionsMenu"></i>
=======
    <content-section :partitions="c.partitions" :showLabel="showLabel" :content="c.content" :data-set="dataSet" v-for="c in content" :isPartyCard="true"/>
    <i v-if="editForm.allowModifyExisting && cardActions.edit && disableEdit" class="ba-icon ba-dots-vertical" @click="openOptionsMenu"></i>
>>>>>>> CICD/CI_CD
    <div v-if="editForm.allowModifyExisting && cardActions.edit" ref="optionsMenu" class="options-menu" tabindex="-1" @blur="closeOptionsMenu" v-show="showOptionMenu">
      <ul>
        <li v-if="editForm.allowModifyExisting && cardActions.edit" @click="openEditModal">
          <i class="ba-icon">
            <svg style="width:15px;height:15px" viewBox="0 0 24 24">
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
<<<<<<< HEAD
    <ba-modal v-if="editForm.allowModifyExisting && cardActions.edit" class="edit-form" ref="editModal" @cancel="resetStagedChanges" @ok="mergeStagedChanges" footer>
      <span slot="header">{{ 'EDIT' | translate }}</span>
      <edit-section v-if="editForm.allowModifyExisting && cardActions.edit" :is-nested="false" :partitions="f.partitions" :content="f.content" :document-type="name" v-for="f in editForm.content" />
=======
    <ba-modal v-if="editForm.allowModifyExisting && cardActions.edit" class="edit-form" ref="editModal" footer>
      <span slot="header">{{ 'EDIT' | translate }}</span>
      <edit-section v-if="editForm.allowModifyExisting && cardActions.edit" :is-nested="false" :partitions="f.partitions" :content="f.content" :document-type="name" v-for="f in editForm.content" />
      <div slot="buttons">
        <ba-button id="custColCancel" class="ba-default flat" @click="closeEditModal">{{ 'CANCEL' | translate }}</ba-button>
        <ba-loader-button id="custColSave" class="ba-primary" @click="mergeStagedChange" :done="done">{{ 'SAVE' | translate }}</ba-loader-button>
      </div> 
>>>>>>> CICD/CI_CD
    </ba-modal>

    <ba-modal ref="removeModal"
              @cancel="resetStagedChanges"
              @ok="removeItem(form.name, documentJson.DOCUMENTID)"
              :header="false"
              footer
              :language="language">
      <div class="modal-remove-confirm">
        {{ 'REMOVE_CARD_VIEW_CONF_PREFIX' | translate }} {{ form.name.toUpperCase().replace(' CARD', '') }} {{ 'REMOVE_CARD_VIEW_CONF_SUFFIX' | translate }}
      </div>
    </ba-modal>
  </div>
</template>

<script>
  import _ from 'lodash';
  import { mapGetters, mapActions } from 'vuex';
  import ContentSection from './ContentSection';
  import EditSection from './EditSection';
  import errorRemediation from './mixins/errorRemediation';
  import loader from './mixins/loader'
  import RepositoryService from '../services/repositories';

  import card from './mixins/card'

  export default {
    props: ['dataSet', 'content', 'form', 'showLabel'],
    mixins: [card, errorRemediation, loader],
    components: {
      ContentSection,
      EditSection
    },

    data() {
      return {
        showOptionMenu: false,
        repositoryId: this.$route.params.repoId,
        documentId: this.$route.params.docId,
      };
    },

    computed: {

      disableEdit() {
        let disableEdit = false;
        let errorHeaders = ['SPECIALTIES','IDENTIFIERS','LICENSES','ADDRESSES','CONTACTS'];
        _.each( this.activeDocumentErrors, ( val, key ) => {
          if (!errorHeaders.includes(key.toUpperCase())) {
            disableEdit = true;
          } 
        });
        return disableEdit;
      },

      ...mapGetters([
        'documentJson',
        'edit'
      ])
    },

    methods: {
      openEditModal() {
        this.$refs.editModal.open();
      },

      openOptionsMenu() {
        this.showOptionMenu = true;
        this.$nextTick(() => {
          this.$refs.optionsMenu.focus();
        });
      },

      removeItem(documentType, documentId) {
        this.removeItemFromActiveDocument({ documentType: documentType, documentId: documentId });
        this.closeOptionsMenu();
      },

      openRemoveModal() {
        this.$refs.removeModal.open();
      },

      closeEditModal() {
        this.$refs.editModal.close();
        this.resetStagedChanges();
      },

      setEdit() {
        let errorRemediation = this.$route.path.includes('errorpartyview');
        if (!errorRemediation) {
          this.RepositoryService.lockDocument({
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
        }
      },

      mergeStagedChange() {
        this.mergeStagedChanges();
        this.validateInputs(this.repositoryId,this.documentId, 'validate','editModal');
      },

      closeOptionsMenu() {
        this.showOptionMenu = false;
      },

      ...mapActions([
        'setEditStatus',
        'resetStagedChanges',
        'removeItemFromActiveDocument',
        'mergeStagedChanges'
      ])
    }
  }
</script>

<style lang="less">
  .edit-form {
    .ba-content {
      max-height: 50vh;
      overflow-y: auto;
    }
  }
</style>

<style lang="less" scoped>
  .page {
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
      color: #000;
      border: 1px solid #BACBCB;
      cursor: pointer;

      ul {
        list-style: none;
        margin-bottom: 0;

        li {
          padding: 4px 16px 4px 4px;
          margin-bottom: 0;

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
    .modal-remove-confirm {
      min-height: 100px;
      font-size: 22px;
      font-weight: bold;
      text-align: center;
      padding-top: 30px;
      word-break: break-word;
    }
  }
</style>
