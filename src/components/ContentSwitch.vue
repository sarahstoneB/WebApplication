<template>
  <div class="content-switch-wrapper">
    <template v-for="(c, index) in content">
<<<<<<< HEAD
      <div class="editIcon"><i v-if="cardActions.edit && editForm.allowModifyExisting" class="ba-icon ba-dots-vertical" @click="openOptionsMenu"></i></div>
=======
      <div class="editIcon" v-if="editIcons"><i v-if="cardActions.edit && editForm.allowModifyExisting" class="ba-icon ba-dots-vertical" @click="openOptionsMenu"></i></div>
>>>>>>> CICD/CI_CD
      <div v-if="cardActions.edit && editForm.allowModifyExisting" ref="optionsMenu" class="options-menu" tabindex="-1" @blur="closeOptionsMenu" v-show="showOptionMenu">
      <ul>
        <li v-if="editForm.allowModifyExisting || cardActions.edit" @click="openEditModal">
          <i class="ba-icon">
            <svg style="width:15px;height:15px" viewBox="0 0 24 24">
              <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
            </svg>
          </i>
          <span>{{ 'EDIT' | translate }}</span>
        </li>
<<<<<<< HEAD
      </ul>
    </div>
    <content-description :name="c.name" :item="item" :toolTip="c.toolTip" v-if="c.type === 'description'" />
    <content-attribute :name="c.name" :item="item" :showLabel="showLabel" :displayName="c.displayName" :toolTip="c.toolTip" :format="c.format" :label="getLabel(c, item)" :status="getStatus(c, item)" v-if="c.type === 'attribute'" />
    <content-template :template="c.template" :showLabel="showLabel" :displayName="c.displayName" :values="c.values" :item="item" :toolTip="c.toolTip" :label="getLabel(c, item)" v-if="c.type === 'template'" />
    <content-switch :name="c.name" :cases="c.cases" :showLabel="showLabel" :displayName="c.displayName" :item="item" v-if="c.type === 'switch'" />
    <ba-modal v-if="(cardActions.edit && editForm.allowModifyExisting) && index == 0" class="edit-form" ref="editModal" @cancel="resetStagedChanges" @ok="mergeStagedChanges" footer :language="language">
=======
        <li v-if="editForm.allowDeleteExisting && cardActions.delete" @click="openRemoveModal">
          <i class="ba-icon ba-delete"></i>
          <span>{{ 'REMOVE' | translate }}</span>
        </li>
      </ul>
    </div>
    <content-description :name="c.name" :item="item" :toolTip="c.toolTip" v-if="c.type === 'description'" :isPartyCard="isPartyCard"/>
    <content-attribute :name="c.name" :item="item" :showLabel="showLabel" :displayName="c.displayName" :toolTip="c.toolTip" :format="c.format" :label="getLabel(c, item)" :status="getStatus(c, item)" v-if="c.type === 'attribute'" />
    <content-template :template="c.template" :showLabel="showLabel" :displayName="c.displayName" :values="c.values" :item="item" :toolTip="c.toolTip" :label="getLabel(c, item)" v-if="c.type === 'template'" />
    <content-switch :name="c.name" :cases="c.cases" :showLabel="showLabel" :displayName="c.displayName" :item="item" v-if="c.type === 'switch'" />
    <ba-modal v-if="(cardActions.edit && editForm.allowModifyExisting) && index == 0" class="edit-form" ref="editModal" footer>
>>>>>>> CICD/CI_CD
      <span slot="header">{{ 'EDIT' | translate }}</span>
      <div class="modal-min-height">
        <edit-section :is-nested="true" :document-id="item.DOCUMENTID" :partitions="f.partitions" :content="f.content" :document-type="groupName" :name ="groupName" v-for="f in editForm.content" />
      </div>
<<<<<<< HEAD
=======
      <div slot="buttons">
        <ba-button id="custColCancel" class="ba-default flat" @click="closeEditModal">{{ 'CANCEL' | translate }}</ba-button>
        <ba-button id="custColSave" :class="['ba-primary',{'disabled-button': !errorInfo}]" @click="mergeStagedChange">{{ 'SAVE' | translate }}</ba-button>
      </div>       
    </ba-modal>
    <ba-modal ref="removeModal"
              :header="false"
              footer>
      <div class="modal-remove-confirm">
        {{ 'REMOVE_CARD_VIEW_CONF_PREFIX' | translate }} {{ groupName }} {{ 'REMOVE_CARD_VIEW_CONF_SUFFIX' | translate }}
      </div>
      <div slot="buttons">
        <ba-button id="custColCancel" class="ba-default flat" @click="closeRemoveModal">{{ 'CANCEL' | translate }}</ba-button>
        <ba-button id="custColSave" class="ba-primary" @click="removeItemFromList(groupName, item.DOCUMENTID)">{{ 'SAVE' | translate }}</ba-button>
      </div>      
>>>>>>> CICD/CI_CD
    </ba-modal>
    </template>
  </div>
</template>

<script>
  import _ from 'lodash';
  import { mapGetters, mapActions } from 'vuex';
  import ContentAttribute from './ContentAttribute';
  import ContentDescription from './ContentDescription';
  import ContentTemplate from './ContentTemplate';
  import ContentSwitch from './ContentSwitch';
  import contentLabel from './mixins/contentLabel';
  import contentStatus from './mixins/contentStatus';
  import EditSection from './EditSection';
  import contentPartition from './mixins/contentPartition';
<<<<<<< HEAD
  import card from './mixins/card';

  export default {
    mixins: [contentLabel, contentStatus, card, contentPartition],
    props: ['name', 'cases', 'item', 'showLabel', 'form', 'groupName'],
=======
  import errorRemediation from './mixins/errorRemediation';
  import card from './mixins/card';

  export default {
    mixins: [contentLabel, contentStatus, card, contentPartition, errorRemediation],
    props: ['name', 'cases', 'item', 'showLabel', 'form', 'groupName', 'isPartyCard'],
>>>>>>> CICD/CI_CD
   
    components: {
      ContentAttribute,
      ContentTemplate,
      ContentSwitch,
      EditSection,
      ContentDescription
    },

    data() {
      return {
<<<<<<< HEAD
        showOptionMenu: false
=======
        showOptionMenu: false,
        repositoryId: this.$route.params.repoId,
        documentId: this.$route.params.docId,
>>>>>>> CICD/CI_CD
      };
    },

    computed: {
      activeCase() {
        return _.findIndex(this.cases, c => c.equals && c.equals.value === this.item.ATTRIBUTES[this.name]);
      },
      
      content() {
        let content = {};
        if (~this.activeCase) {
          content = this.cases[this.activeCase].equals.content;
        } else {
          const defaultContent = _.find(this.cases, c => c.default !== undefined);
          content = defaultContent ? defaultContent.default.content : [];
        }
        return content;
      },

<<<<<<< HEAD
      ...mapGetters([
        'documentJson',
        'edit'
=======
      editIcons() {
        let allowEdit = false;
        _.each(this.errorMessage, (error) => {
          if(error.includes(this.item.DOCUMENTID)) {
            allowEdit = true;
          }
        });
        return allowEdit;
      },    

      ...mapGetters([
        'documentJson',
        'edit',
        'errorInfo',
        'errorMessage'
>>>>>>> CICD/CI_CD
      ])
    },

    methods: {
<<<<<<< HEAD
      openEditModal() {
        this.$refs.editModal[0].open();
      },
=======

      openRemoveModal() {
        this.$refs.removeModal[0].open();
      },

      openEditModal() {
        this.$refs.editModal[0].open();
      },
      
      closeEditModal() {
        this.resetStagedChanges();
        this.$refs.editModal[0].close();
      },

      closeRemoveModal() {
        this.resetStagedChanges();
        this.$refs.removeModal[0].open();
      },

      mergeStagedChange() {
        this.validateInputs(this.repositoryId,this.documentId, 'validate','editModal')
        this.mergeStagedChanges();
        this.closeEditModal();
      },
>>>>>>> CICD/CI_CD

      openOptionsMenu() {
        this.showOptionMenu = true;
        this.$nextTick(() => {
          this.$refs.optionsMenu[0].focus();
        });
      },

      closeOptionsMenu() {
        this.showOptionMenu = false;
      },

<<<<<<< HEAD
=======
      removeItemFromList(groupName,docId) {
        this.removeItem(groupName,docId);
        this.closeRemoveModal();
      },

>>>>>>> CICD/CI_CD
      ...mapActions([
        'resetStagedChanges',
        'mergeStagedChanges'
      ])
    }
  }
</script>

<style>
<<<<<<< HEAD
.nested-group .group-content {
  display : block;
}
</style>
=======

.nested-group .group-content {
  display : block;
}

.modal-remove-confirm {
  text-align: center;
  font-weight: 900;
}

.disabled-button {
  opacity: 0.38;
  pointer-events: none;
}
</style>

>>>>>>> CICD/CI_CD
<style lang="less" scoped>
  .content-switch-wrapper {
    flex : 2;
    position : relative;
<<<<<<< HEAD
    float : left;
=======
>>>>>>> CICD/CI_CD
    width : 100%;
  }
  .group-content {
    & > i {
      cursor: pointer;
    }
    .options-menu {
      position: absolute;
      right: 0;
      top: 0;
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
<<<<<<< HEAD

  .modal-min-height {
    min-height: 200px;
  }
 .content-switch-wrapper > div {
    float: left;
    &.editIcon {
      float:right;
    }
  }
</style>
=======
  
  .modal-min-height {
    min-height: 200px;
  }
  .content-switch-wrapper > div {
    &.editIcon {
      float:right;
      cursor: pointer;
    }
  }
  
  </style>
>>>>>>> CICD/CI_CD
