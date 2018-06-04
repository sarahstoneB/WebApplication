<template>
  <div>
    <ba-toolbar :showSideNavIcons="true" @open="minimizeTable" @close="maximizeTable" :side-nav-start-open="sideNavOpen" :links="links" sticky>
      <span slot="page-name"> {{ 'RELATIONSHIPS' | translate }}</span>
        <div class="options">
          <div class="spacer"> </div>
            <div class="option" v-ba-tooltip="$t('CANCEL')" @click="confirmActions('cancel')">
              <i class="ba-icon">
                <svg style="padding:5px 5px; width:24px; height:24px; max-width: 2em;" viewBox="0 0 24 24">
                  <path fill="#F0F8F9" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </i>
            </div>
            <div class="option" v-ba-tooltip="$t('CARD_VIEW')" @click="redirectToCardView">
              <i class="ba-icon">
                <svg style="padding:5px 5px; width:24px; height:24px; max-width: 2em;" viewBox="0 0 24 24">
                  <path fill="#F0F8F9" d="M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3" />
                </svg>
              </i>
            </div>
        </div>
    </ba-toolbar>
    <div :class="['spinner-wrapper', { maximized }]" v-if="showSpinner">
      <ba-spinner  :indeterminate="true" :progress="40" :size="50" class="spinner"></ba-spinner>
    </div>
    <div :class="['content', { maximized },{'show-spinner': showSpinner}]">

      <div class="breadcrumbs">
        <div class="left" v-show="isScrollLeft" @click="scrollLeft">
          <svg class="navigate-icon" viewBox="0 0 24 24">
            <path fill="#287bb2"  d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
          </svg>
        </div>

        <div ref="breadCrumbContainer" :class="['breadcrumb-container', {'is-scrolled': !isScrollLeft}]">
          <ba-breadcrumb ref="breadCrumbs" :path="breadCrumbs"></ba-breadcrumb>
        </div>

        <div class="right" v-show="isScrollRight" @click="scrollRight">
          <svg class="navigate-icon" viewBox="0 0 24 24">
            <path fill="#287bb2" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
          </svg>
        </div>
      </div>

      <div class="sidenav" id="relationshipContainer">
        <ul id="search-header">
          <li>
            <a class="active">
              <svg id="icon-alignment" style="width:23px;height:23px;" viewBox="0 0 24 24" v-if="getOrganizationType === 'Organization'">
                <path fill="#484848" d="M18,15H16V17H18M18,11H16V13H18M20,19H12V17H14V15H12V13H14V11H12V9H20M10,7H8V5H10M10,11H8V9H10M10,15H8V13H10M10,19H8V17H10M6,7H4V5H6M6,11H4V9H6M6,15H4V13H6M6,19H4V17H6M12,7V3H2V21H22V7H12Z" />
              </svg>
              <svg id="icon-alignment" style="width:23px;height:23px;" viewBox="0 0 24 24" v-else>
                <path fill="#484848" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
              <div class="user-name" v-ba-tooltip="documentUser">{{ documentUser }}</div>
            </a>
          </li>
        </ul>
        <ul class="parent-child-relationships">
          <li :key="index" v-for="(type, index) in types">
            <a @click="getRelationshipRecords(type)" :class="[{'hidden-element': index > 1}]">{{ type | translate }}
              <span v-if="index < 2">({{ activeDocument[type] ? activeDocument[type].length : 0 }})</span>
              <svg style="width:24px;height:24px" viewBox="0 0 24 24" v-if="index < 2">
                <path fill="#484848" d="M10,17L15,12L10,7V17Z" />
              </svg>
            </a>
          </li>
        </ul>
        <br>
      </div>
      <div class="sidenav" v-if="isRelationshipRecords" id="detailedInfo">
        <ul id="search-header">
            <li>
              <a class="active" v-if="show">
                <b style="font-size: 14px">{{ relativeHeaderName | translate }}</b>
                <svg style="width:23px;height:23px" viewBox="0 0 22 22" @click="getToggle">
                  <path fill="#949C9A" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                </svg>
              </a>
              <a class="active" v-else>
                  <svg id="icon-alignment" :class="[{'search-input': !show}]" style="width:23px;height:23px;margin-top:0.2em;" viewBox="0 0 22 22">
                    <path fill="#949C9A" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                  </svg>
                  <b><ba-input ref="search" :class="[{'search': !show}]" v-model="searchTerms" :placeholder="$t('SEARCH')" ></ba-input></b>
                  <svg :class="[{'add-icon': !show}]" style="width:24px;height:24px" viewBox="0 0 24 24" @click="getToggle">
                    <path fill="#000000" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                  </svg>
              </a>
            </li>
          </ul>
          <ul :class="['scroll', { 'stop-scroll' : dataSet.length < 15 }]">
            <li v-if="dataSet.length === 0">
              <a>{{ 'NO_RECORDS_FOUND' | translate }}</a>
            </li>
             <li :key="index" v-for="(detailedInfo, index) in dataSet" v-else>
              <a @click="getDetails(detailedInfo)" :class="[{'hidden-element': (!getName(detailedInfo)) }]">{{ getName(detailedInfo) ? getName(detailedInfo) : '0'  }}</a>
            </li>
            <li v-for="info in showDivs" v-if="dataSet.length >= 0">
              <a class="hidden-element">{{ info }}</a>
            </li>
          </ul>
        <br>
      </div>
      <div :class="['cardview',{'card-maximize': (!maximized && isRelationshipRecords) }, {'stretch-card': !isRelationshipRecords}]" v-if="!showSpinner">
    <ba-content  :class="['partitions', { maximized }]">
      <card-view-card :card="card"/>
    </ba-content>
    </div>
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

    <ba-toast ref="errorToast"  position="top">
        <i class="ba-icon ba-alert-circle" slot="icon"></i>
        <div slot="body">{{ generalErrors[0] }}</div>
    </ba-toast>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions } from 'vuex';
import CardViewCard from './CardViewCard';
import dataTable from './mixins/dataTable';
import loader from './mixins/loader';
import sideNav from './mixins/sideNav';
import relationship from './mixins/relationship';
import ErrorService from '../services/error';
import RepositoriesService from '../services/repositories';
import EventBus from './../event-bus';
import relationshipForm from './../../utils/relationshipForm.json';


export default {
  mixins: [sideNav, dataTable, loader, relationship],

  data() {
    return {
      detailedMessage: '',
      showSpinner: false,
      isRelationshipRecords: false,
      selectedList: [],
      searchTerms: '',
      relativeHeaderName:'',
      typeOfAction: '',
      generalErrors: [],
      showDivs: [],
      show: true,
      isScrollLeft: false,
      isScrollRight: false,
      previousScrollValue: 1,
      types: [
        'PARENTRELATIONSHIPS',
        'CHILDRELATIONSHIPS'
      ]
    }
  },

  created() {
    _.times(75, (i) => {
      this.types.push(' 0');
    });
    this.searchTerms = '';
    if (Object.keys(this.activeDocument).length !== 0) {
      this.showSpinner = false;
    } else {
      this.getDataViewDocument();
    }
  },

  components: {
    CardViewCard
  },

  watch: {
    '$route': 'updatedDocId'
  },

  updated() {
    let container = this.$refs.breadCrumbContainer;
    let content = this.$refs.breadCrumbs;
    if (container && content) {
      let scrolling = container.clientWidth < container.scrollWidth;
      if (this.previousScrollValue == 1) {
        if (scrolling) {
          container.scrollLeft = container.clientWidth;
        }
        this.isScrollLeft = ((container.scrollLeft + container.clientWidth) == content.clientWidth) || scrolling;
      }
    }
  },

  computed: {

    filteredItems() {
      return _.filter(this.selectedList, (record) => {
        return this.getName(record).toLowerCase().includes(this.searchTerms.toLowerCase());
      });
    },

    dataSet() {
      return this.searchTerms != '' ? this.filteredItems : this.selectedList;
    },

    repositoryId() {
      return this.$route.params.repoId;
    },

    documentId() {
      return this.$route.params.docId;
    },

    card() {
      return this.activeDocumentForm ? this.activeDocumentForm.pagedContent[0].partitions[0].cards[0] : [];
    },

    documentUser() {
      return this.activeDocument ? this.activeDocument.NAME : '';
    },

    getOrganizationType() {
      return this.activeDocument ? this.activeDocument.PARTYTYPE : '';
    },

    ...mapGetters([
      'currentState',
      'links',
      'activeDocument',
      'activeDocumentForm',
      'breadCrumbs'
    ])
  },

  methods: {
    scrollLeft() {
      this.$refs.breadCrumbContainer.scrollLeft -= 50;
      if (this.previousScrollValue == this.$refs.breadCrumbContainer.scrollLeft) {
        this.isScrollLeft = false;
      } else {
        this.previousScrollValue = this.$refs.breadCrumbContainer.scrollLeft;
      }
      this.isScrollRight = true;
    },

    scrollRight() {
      this.$refs.breadCrumbContainer.scrollLeft += 50;
      if (this.previousScrollValue == this.$refs.breadCrumbContainer.scrollLeft) {
        this.isScrollRight = false;
      } else {
        this.previousScrollValue = this.$refs.breadCrumbContainer.scrollLeft;
      }
      this.isScrollLeft = true;
    },

    getName(attribute) {
      return attribute.ATTRIBUTES.RELATEDNAME ? attribute.ATTRIBUTES.RELATEDNAME : attribute.ATTRIBUTES.NAME;
    },

    getToggle() {
      this.show = !this.show;
      this.searchTerms = "";
      this.showCard = false;
    },

    getRelationshipRecords(type) {
      this.showDivs = [];
      this.relativeHeaderName = type;
      this.selectedList = this.activeDocument[type];
      this.isRelationshipRecords = this.selectedList.length > 0;
      if(this.isRelationshipRecords) {
        _.times(75, (i) => {
          this.showDivs.push(' 0');
        });
      }
    },

    getDetails(detailedInfo) {
      this.isRelationshipRecords = false;
      let docId = detailedInfo.ATTRIBUTES.RELATEDDOCUMENTID ? detailedInfo.ATTRIBUTES.RELATEDDOCUMENTID : detailedInfo.DOCUMENTID;
      this.$router.push(`/relationships/${this.repositoryId}/${docId}`);
    },

    redirectToCardView() {
      this.isLoadComplete = false;
      this.$router.push(`/cardview/${this.repositoryId}/${this.documentId}`);
    },

    redirectToDataView() {
      this.isLoadComplete = false;
      this.$router.push(`/dataview/`);
    },

    updatedDocId() {
      this.getDataViewDocument();
    },

    confirmActions(typeOfAction) {
      this.typeOfAction = typeOfAction;
      if (typeOfAction == 'cancel') {
        this.isLoadComplete = false;
        this.detailedMessage = this.$t('ABOUT_TO') + " " + this.$t(typeOfAction.toUpperCase()) + " " + this.$t('DOCUMENT_WITH_ID') + " " +  this.documentId;
        this.$refs.confirmUserActions.open();
      }
    },

    closeModal() {
      this.$refs.confirmUserActions.close();
    },

    handleActions() {
      if (this.typeOfAction == 'cancel') {
        this.resetActiveDocument({});
        this.redirectToDataView();
      }
    },

    ...mapActions([
      'getDocuments',
      'resetActiveDocument'
    ])
  }
}
</script>

<style lang="less">

.breadcrumb-container {
  ul {
    padding-left: 0px !important;
    li {
      white-space: nowrap;
    }
  }
}

.is-scrolled {
  padding-left: 19px;
}
</style>

<style lang="less" scoped>
  .content {
    margin-left: 250px;
    &.maximized {
        margin-left: 40px;
     }
    }
  .sidenav {
      height: 50em;
      float: left;
 }

 .cardview {
   z-index: -1;
   position: relative;
   width: 48%;
   margin-left: 26.5em;
   float: left;
   top: -4.6em;
  }

 .card-maximize {
   width: 40%;
 }

.stretch-card {
  width: 74%;
  margin-left: 25.5em;
  z-index: -1;
}

ul {
    list-style-type: none;
    padding: 0;
    border: 1px solid gray;
    margin: 0px;
    width: 27em;
}

.scroll {
    overflow:auto;
    height: ~"calc(100vh - 165px)";
}

.parent-child-relationships {
    height: ~"calc(100vh - 165px)";
    overflow: hidden;
}

.stop-scroll {
  overflow: hidden;
}

li {
    margin-bottom: 0;
}

li a {
    display: block;
    color: #000;
    padding: 8px 16px;
    text-decoration: none;

}

li:nth-child(odd) {
  background-color: #f1f1f1;
}

a:hover {
  cursor: pointer;
}

svg {
  float: right;
  cursor: pointer;
}

#icon-alignment{
  float: left;
}

li a.active {
    background-color: #FEFEFE;
    color: #4B4B4B;
    font-size: 14px;
    height: 1.7em;
    border-bottom: 2px solid #B8C5C3;
}

#relationshipContainer {
   position: absolute;
}

#detailedInfo {
    position: relative;
    left: 28em;
    z-index: 70;
}

li::selection {
    background-color: #E5E9EA;
}

#search-header {
  border-bottom: 0px;
}

.ba-input {
  margin: 2px 0 0;
}

.ba-input .wrapper {
    flex: 1;
    width: 65%;
    float: left;
}

input {
    width: 85% !important;
}

.search-input {
  margin-top: 0.5em;
  margin-right: 0.5em;
}

.cancel-search {
  margin-top: -1.6em;
}

.add-icon {
  margin-top: -2em;
  position: relative;
}

.show-spinner {
  opacity: 0.3;
}

.user-name {
  margin-left: 0.6em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 5px;
  font-weight: 900;
}

.hidden-element {
  visibility: hidden;
}

.spinner-wrapper {
    height: 85vh;
    left: 55em;
    transition: all .25s;
    position: absolute;
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

  .spacer {
  flex: 1;
}

.options {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  min-width: 100px;
  margin-right: 12px;
  z-index: 70;
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

    & > div:first-child {
      font-weight: bold;
    }
 }

.breadcrumb-container {
  overflow: hidden;
  width: 95%;
  margin-left: 10px;
}

.right {
  padding-top: 5px;
  height: 24px;
  width: 24px;
  z-index: 101;
}

.left {
  padding-top: 5px;
  height: 24px;
  width: 24px;
  z-index: 101;
}

.breadcrumbs {
  display: flex;
}
</style>
