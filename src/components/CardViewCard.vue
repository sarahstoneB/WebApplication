<template>
  <div>
    <ba-card>
      <span slot="title" v-if="title">{{ title }}</span>
      <ba-content class="data-container">
        <div class="error-header" :class="title" v-if="hasErrors && isError && card.name != 'ADDRESSES'">
          <i class="ba-icon">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
            </svg>
          </i>
        </div>

        <div class="validation-header" v-if="hasBeenValidated">
          <i class="ba-icon ba-check-circle"></i>
        </div>

        <div class="card-toolbar" v-if="card.type != 'page'">
          <div class="spacer">
            <div v-if="activeDocument[card.name] && activeDocument[card.name].length > 2" class="search-wrapper">
              <input id="cardViewSearch" class="search" :placeholder="$t('SEARCH')" @focus="toggleInputFocus()" @blur="toggleInputFocus()" v-model="criteria" />
              <div :class="[ 'search-add-on', { 'search-add-on-focused' : inputFocused }]">
                <span class="ba-icon ba-search"></span>
              </div>
            </div>
          </div>
          <i v-if="actions.card.edit && editForm.allowInsert" class="ba-icon ba-plus-circle" @click="addAttribute"></i>
        </div>

        <nested-list :item="item" :content="content" :randomDocId="randomDocId" :partitions="partitions" :form="card" :showLabel="showLabel" :name="card.name" :index="index" v-for="item in dataSet.firstHalf" v-if="card.type === 'nestedList'" />
        <nested-list :item="item" :content="content" :randomDocId="randomDocId" :partitions="partitions" :form="card" :showLabel="showLabel" :name="card.name" :index="index" v-for="item in dataSet.secondHalf" v-if="card.type === 'nestedList' && isCardToggled || isRelationshipCard" />
<<<<<<< HEAD
        <nested-group-by :data-set="dataSet.firstHalf" :content="content" :groupBy="groupBy" :form="card" :name="card.name" v-if="card.type === 'nestedGroupBy'" />
        <nested-group-by :data-set="dataSet.secondHalf" :content="content" :groupBy="groupBy" :form="card" :name="card.name" v-if="card.type === 'nestedGroupBy' && (isCardToggled || isContacts)" />
=======
        <nested-group-by :data-set="dataSet.allResults" :content="content" :groupBy="groupBy" :form="card" :name="card.name" v-if="card.type === 'nestedGroupBy'" />
>>>>>>> CICD/CI_CD

        <div class="business-content" v-if="card.type == 'page'">
          <page :data-set="getDataSetForPage()" :content="content" :showLabel="showLabel" :form="card" v-if="card.type === 'page'" />
        </div>
      </ba-content>
    </ba-card>

<<<<<<< HEAD
    <div v-if="dataSet.secondHalf.length > 0 && !isContacts && !isRelationshipCard" @click="isCardToggled = !isCardToggled" class="more-cards">
=======
    <div v-if="dataSet.secondHalf.length > 0 && !isContacts && !isRelationshipCard && hideCards" @click="isCardToggled = !isCardToggled" class="more-cards">
>>>>>>> CICD/CI_CD
      <i :class="['ba-icon', {'ba-chevron-up': isCardToggled, 'ba-chevron-down': !isCardToggled}]"></i>
      <span>{{ isCardToggled ? $t('COLLAPSE'): $t('EXPAND') }}</span>
    </div>
    <div class="pagination-container" v-if="isRelationshipCard && totalDocs.length > 3">
      <div class="rows-per-page" v-show="totalResults != 0">
        <span class="rows-label">
          <span>{{ 'ROWS_PER_PAGE' | translate }}</span>
        </span>
        <ba-select v-model="pageSize" :options="pageSizes" class="select-limit" />
      </div>
      <div class="rows-label">
        <span>{{ (pageSize * (currentPage - 1) + 1) }} - {{ (pageSize * currentPage) > totalDocs.length ? totalDocs.length : pageSize * currentPage }} <span>of</span> {{ totalDocs.length }}</span>
      </div>
      <div class="rows-label icon" @click="selectedPage = 1" :class="{ disabled: currentPage === 1 }">
        <i id="navFirst" class="ba-icon ba-page-first"></i>
      </div>
      <div class="rows-label icon" @click="selectedPage = currentPage - 1" :class="{ disabled: currentPage === 1 }">
        <i id="navLeft" class="ba-icon ba-chevron-left"></i>
      </div>
      <div class="rows-label icon" @click="selectedPage = currentPage + 1" :class="{ disabled: currentPage === totalPages }">
        <i id="navRight" class="ba-icon ba-chevron-right"></i>
      </div>
      <div class="rows-label icon" @click="selectedPage = totalPages" :class="{ disabled: currentPage === totalPages }">
        <i id="navLast" class="ba-icon ba-page-last"></i>
      </div>
    </div>
<<<<<<< HEAD
    <ba-modal ref="createModal" v-if="actions.card.edit && editForm.allowInsert" class="create-form" @cancel="resetNewDocument" @ok="handleNewDocument" footer :language="language">
      <span slot="header">{{ 'CREATE' | translate }}</span>
      <div class="modal-min-height">
        <create-section v-if="actions.card.edit && editForm.allowInsert" :randomDocId="randomDocId" :is-nested="false" :partitions="f.partitions" :content="f.content" :document-type="card.name" v-for="f in card.edit.content" />
=======
    <ba-modal ref="createModal" v-if="actions.card.edit && editForm.allowInsert" class="create-form" footer>
      <span slot="header">{{ 'CREATE' | translate }}</span>
      <div class="modal-min-height">
        <create-section v-if="actions.card.edit && editForm.allowInsert" :randomDocId="randomDocId" :is-nested="false" :partitions="f.partitions" :content="f.content" :document-type="card.name" v-for="f in card.edit.content" />
      </div>
      <div slot="buttons">
        <ba-button id="custColCancel" class="ba-default flat" @click="closeShowModal">{{ 'CANCEL' | translate }}</ba-button>
        <ba-button id="custColSave" :class="['ba-primary',{'disabled-button': !errorInfo}]" @click="handleNewDocument">{{ 'SAVE' | translate }}</ba-button>
>>>>>>> CICD/CI_CD
      </div>
    </ba-modal>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions } from 'vuex';
import errorRemediation from './mixins/errorRemediation';
import contentPartition from './mixins/contentPartition';
import contentValue from './mixins/contentValue';
import NestedList from './NestedList';
import ErrorService from '../services/error';
import NestedGroupBy from './NestedGroupBy';
import CreateSection from './CreateSection';
import Page from './Page';
import RepositoryService from '../services/repositories';

export default {
  mixins: [contentPartition, contentValue, errorRemediation],

  props: ['card'],

  data() {
    return {
      isCardToggled: false,
      criteria: '',
      randomDocId: 0,
      inputFocused: false,
      selectedPage: 1,
      pageSize: 5,
<<<<<<< HEAD
      pageSizes: [3, 5, 10]
=======
      pageSizes: [3, 5, 10],
      repositoryId: this.$route.params.repoId,
      documentId: this.$route.params.docId
>>>>>>> CICD/CI_CD
    }
  },
  components: {
    NestedList,
    NestedGroupBy,
    Page,
    CreateSection
  },
  computed: {

    title() {
      return this.card && this.card.title ? this.card.title.value : '';
    },

    isRelationshipCard() {
      return this.card && this.card.name && this.card.name.includes('RELATIONSHIPS');
    },

    totalDocs() {
      return this.activeDocument[this.card.name] ? (this.searchTriggered ? this.filterBySearch(this.activeDocument[this.card.name]) : this.activeDocument[this.card.name]) : [];
    },

    totalPages() {
      return this.paginatedContent.length;
    },

    currentPage() {
      return (this.selectedPage > this.totalPages)  ? 1 : this.selectedPage;
    },

    paginatedContent() {
      return this.totalDocs ? _.chunk(this.totalDocs, this.pageSize) : [];
    },

    searchTriggered() {
      return this.criteria !== '';
    },

<<<<<<< HEAD
=======
    hideCards() {
      return this.isError ? !this.hasErrors : true;
    },

>>>>>>> CICD/CI_CD
    dataSet: {
      cache: false,
      get() {
        var result = this.isRelationshipCard ? this.paginatedContent[this.currentPage - 1] : this.totalDocs;

        if (!this.isRelationshipCard) {
          result = this.filterBySearch(this.totalDocs);
        }
<<<<<<< HEAD
        return {
          allResults: result ? result : [],
          firstHalf: result ? result.slice(0, 2) : [],
          secondHalf: result ? result.slice(2) : []
        };
=======
        result = result ? result : [];

        if (this.isError) {
          return {
            allResults: result,
            firstHalf: result && !this.hasErrors ?  result.slice(0, 2) : result,
            secondHalf: result && !this.hasErrors ? result.slice(2) : result
          };
        } else {
          return {
            allResults: result,
            firstHalf: result ?  result.slice(0, 2) : result,
            secondHalf: result ? result.slice(2) : result
          };          
        }
>>>>>>> CICD/CI_CD
      }
    },

    showLabel() {
      return this.card.view.partitions === 1 && this.card.view.showTitle;
    },

    content() {
      return this.card.view.content;
    },

    editForm() {
      return this.card && this.card.edit ? this.card.edit : {};
    },

    features() {
      return this.isError ? this.$root.features.ERROR_REMEDIATION : this.$root.features.DATA_VIEW;
    },

    actions() {
      return this.features && this.features.actions ? this.features.actions : {};
    },

    isError() {
      let path = this.$route.path;
      let isError = path.includes('errorcardview');
      return isError;
    },

    partitions() {
      return this.card && this.card.view && this.card.view.partitions ? this.card.view.partitions : 1;
    },

    groupBy() {
      return this.card.view.groupBy.name;
    },

    hasErrors() {
      // check path for error remediation vs dataview
      // Should update on component update (SET_ACTIVE_DOCUMENT -> activeDocumentErrors)
      let errorHeaders = ['SPECIALTIES','IDENTIFIERS','LICENSES','ADDRESSES','CONTACTS'];
      if (_.has(this.activeDocumentErrors, this.card.name)){
        return _.has(this.activeDocumentErrors, this.card.name);
      } else {
        if (this.card.name == 'Party card') {
        let errorPartyCard = false;
        _.each( this.activeDocumentErrors, ( val, key ) => {
          if ( val['ERROR'] && !errorHeaders.includes(key.toUpperCase())) {
            this.setErrorMessage(val['ERROR']);
            errorPartyCard = true;
          } else if ( val['error'] && !errorHeaders.includes(key.toUpperCase())) {
            this.setErrorMessage(val['error']);
            errorPartyCard = true;
          } 
        });
        return errorPartyCard;
      }
    }
    },

    hasBeenValidated() {
      // If all fields are validated hasErrors to false,
      // or add second check for view validation on card to be able to remove error header
      return false;
    },

    editStatus() {
      return this.edit;
    },

    isContacts() {
      return this.card.name.toLowerCase() === 'contacts';
    },

    ...mapGetters([
      'activeDocument',
      'activeDocumentErrors',
      'documentJson',
      'remediationChanges',
      'errorInfo'
    ])
  },

  methods: {
    filterBySearch(itemToFilterBy) {
      return itemToFilterBy.filter(item => {
        let matched = false;
        let attributes = this.getCardItems(item);
        _.forEach(attributes, (value) => {
          if (value.toLowerCase().trim().includes(this.criteria.toLowerCase().trim())) {
            matched = true;
          }
        });
        return matched;
      });
    },

    getCardItems(item) {
      let attributes = [];
      _.forEach(this.content, (value) => {
        attributes.push(this.getValue(item, value.name));
      })
      return attributes;
    },

    toggleInputFocus() {
      this.inputFocused = !this.inputFocused;
    },

    getDataSetForPage() {
      return {
        ATTRIBUTES: this.activeDocument
      }
    },

    generateRandomDocId() {
      this.randomDocId = Math.floor(Math.random() * 10000);
    },

    addAttribute() {
      this.setEdit();
      this.showCreateModal();
      this.generateRandomDocId();
    },

    setEdit() {
      if (!this.editStatus) {
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
      }
    },

    showCreateModal() {
      this.$refs.createModal.open();
    },

    closeShowModal() {
      this.resetNewDocument();
      this.$refs.createModal.close();
    },

    handleNewDocument() {
      this.addNewDocumentToActiveDocument({
        documentType: this.card.name,
        randomDocId: this.randomDocId
      });
      this.validateInputs(this.repositoryId, this.documentId, 'validate','createModal');
      this.closeShowModal();
    },

    clearup () {
      this.criteria = '';
    },

    ...mapActions([
      'resetNewDocument',
      'addNewDocumentToActiveDocument',
      'setEditStatus',
      'setErrorMessage'
    ])
  }
}
</script>

<style lang="less">
.create-form {
  .ba-content {
    max-height: 50vh;
    overflow-y: auto;
  }
}
</style>

<style lang="less" scoped>
.page .value {
  width: 25%;
  float: left;
  padding: 5px 10px;
}

.validation-header {
  color: #f1f1f1;
  padding: 10px 10px;
  background-color: #10A192;
} // Icon :before error
.value.has-error {
  background: #DB4439;
  color: #f1f1f1;
  padding: 5px;
}


.ba-card {
  padding: 0;

  &:hover {
    .ba-icon.edit {
      display: block;
    }
  }

  .business-header {
    width: 100%;
    min-height: 30px;
    padding: 10px 0 10px 10px;
    background: #2D7CB0;
    color: #f1f1f1;
  }

  .business-content {
    padding: 10px;
    background: #324A5F;
    color: #FFFFFF;
  }
  .business-content>div.value {
    width: 25%;
    float: left;
    text-align: center;
  }

  .error-header {
    background: #DB4439;
    color: #FFFFFF;
    padding: 10px 0 6px 10px;

    i svg {
      fill: #FFFFFF;
    }
  }

  .card-toolbar {
    display: flex;
    padding-left: 5px;


    .spacer {
      flex: 1;
      input {
        margin-bottom: 0;
        width: 100%;
        border-style: none;
      }
    }

    i {
      color: #B2C4C4;
      cursor: pointer;
      margin-left: 5px;

      &.ba-search, &.ba-delete.mute {
        cursor: default;
      }

      &.ba-search, &.ba-plus-circle {
        padding: 5px 5px 0 0;
      }
    }
  }

  .ba-icon.edit {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    display: none;
  }

  .ba-content {
    padding: 0;
  }
}

.options-menu {
  position: relative;
  z-index: 2;
}

.modal-min-height {
  min-height: 200px;
}

.more-cards {
  height: 26px;
  background-color: #f9f9f9;
  font-weight: bolder;
  border-left: solid 1px #BACBCB;
  border-right: solid 1px #BACBCB;
  border-bottom: solid 1px #BACBCB;
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

.search-wrapper {
  display: flex;
}

.search {
  margin: 0;
  border-bottom: 2px solid #FFF;
  transition: all .4s cubic-bezier(.25,.8,.25,1);
  &:focus {
    border-bottom: 2px solid #30A7FF !important;
  }
  &::placeholder {
    font-style: italic;
    font-size: 1em;
  }
}

.search-add-on {
  color: #BACBCB;
  padding-top: 5px;
  padding-bottom: 0;
  height: 19px;
  transition: all .4s cubic-bezier(.25,.8,.25,1);
}

.search-add-on-focused {
  border-bottom: 2px solid #30A7FF;
  color: #30A7FF;
}

  .pagination-container {
    display: flex;
    border: 1px solid #BACBCB;
    padding-top: 10px;
    padding-right: 10px;
    border-top-width: 0px;
    min-height: 30px;
    background-color: #FFFFFF;

    .rows-per-page {
      display: flex;

      .select-limit {
        margin-top: 2px;
        width: 65px;
      }
    }

    .rows-label {
      padding: 10px 10px;

      &.icon {
        padding: 12px 5px 10px;

        &.disabled {
          color: #F4F5f6;
          pointer-events: none;
        }
      }

      i {
        cursor: pointer;
      }
    }
  }
</style>
