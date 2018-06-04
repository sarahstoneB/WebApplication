<template>
  <div>
    <ba-modal id="configure-columns" ref="columnConfig" footer :language="language" :size="'large'">
      <span slot="header">{{ 'CUSTOMIZE_COLUMN_ORDER' | translate }}</span>
      <div class="sub-title">
        <span id="custColHideAll" class="remove-all-headers" v-if="isRemoveEnabled" @click="removeAll">{{ 'HIDE_ALL' | translate }}</span>
        <span class="pipe">-</span>
        <span id="custColShowAll"  class="add-all-headers" v-if="isAddEnabled" @click="addAll">{{ 'SHOW_ALL' | translate}}</span>
      </div>
      <div id="col-config-header-container" class="header-container">
        <div id="col-config-active-container" class="active-container">
          <div class="active-header-title">
            <span class="active-header">{{ 'VISIBLE_COLUMNS' | translate  }}</span>
            <span class="header-sort" v-if="emptyDetailedHeaders" @click="sort('active')">
              <i class="ba-icon">
               <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                  <path fill="#4899D2" d="M9.25,5L12.5,1.75L15.75,5H9.25M15.75,19L12.5,22.25L9.25,19H15.75M8.89,14.3H6L5.28,17H2.91L6,7H9L12.13,17H9.67L8.89,14.3M6.33,12.68H8.56L7.93,10.56L7.67,9.59L7.42,8.63H7.39L7.17,9.6L6.93,10.58L6.33,12.68M13.05,17V15.74L17.8,8.97V8.91H13.5V7H20.73V8.34L16.09,15V15.08H20.8V17H13.05Z" />
                </svg>
              </i>
            </span>
          </div>
          <draggable id="col-config-active-headers" class="active-headers" v-model="activeHeaders.container.contents" :options="{ group: 'headers' }" v-if="activeHeaders.container">
            <div class="col-header" :key="attribute.name" v-for="attribute in activeHeaders.container.contents" @click="removeHeader(attribute)">
              <span class="col-header-name">
                {{ attribute.title }}
              </span>
              <!-- <i class="ba-icon ba-window-close col-header-remove" @click="remove"></i> -->
              <i class="ba-icon col-header-move">
                <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                  <path d="M13,6V11H18V7.75L22.25,12L18,16.25V13H13V18H16.25L12,22.25L7.75,18H11V13H6V16.25L1.75,12L6,7.75V11H11V6H7.75L12,1.75L16.25,6H13Z" />
                </svg>
              </i>
            </div>
            <div class="col-header" v-if="emptyActiveHeaders">
              <span class="col-header-name">{{ 'NO_ACTIVE_COLUMNS' | translate }}</span>
            </div>
          </draggable>
        </div>
        <div id="col-config-available-container" class="available-container">
          <div class="avail-header-title">
            <span class="available-header">{{ 'HIDDEN_COLUMNS' | translate }}</span>
            <span class="header-sort" v-if="emptyActiveHeaders" @click="sort('detailed')">
              <i class="ba-icon">
               <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                  <path fill="#4899D2" d="M9.25,5L12.5,1.75L15.75,5H9.25M15.75,19L12.5,22.25L9.25,19H15.75M8.89,14.3H6L5.28,17H2.91L6,7H9L12.13,17H9.67L8.89,14.3M6.33,12.68H8.56L7.93,10.56L7.67,9.59L7.42,8.63H7.39L7.17,9.6L6.93,10.58L6.33,12.68M13.05,17V15.74L17.8,8.97V8.91H13.5V7H20.73V8.34L16.09,15V15.08H20.8V17H13.05Z" />
                </svg>
              </i>
            </span>
          </div>
          <draggable id="col-config-available-headers" class="avail-headers" v-model="detailedHeaders.container.contents" :options="{ group: 'headers' }" v-if="detailedHeaders.container">
            <div class="col-header" :key="attribute.name" v-for="attribute in detailedHeaders.container.contents" @click="addHeader(attribute)">
              <span class="col-header-name">
                {{ attribute.title }}
              </span>
              <i class="ba-icon col-header-move">
                <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                  <path d="M13,6V11H18V7.75L22.25,12L18,16.25V13H13V18H16.25L12,22.25L7.75,18H11V13H6V16.25L1.75,12L6,7.75V11H11V6H7.75L12,1.75L16.25,6H13Z" />
                </svg>
              </i>
            </div>
            <div class="col-header" v-if="emptyDetailedHeaders">
              <span class="col-header-name">{{ 'NO_HIDDEN_COLUMNS' | translate }}</span>
            </div>
          </draggable>
        </div>
      </div>
      <div slot="buttons">
        <ba-button id="custColCancel" class="ba-default flat" @click="resetColumns">{{ 'CANCEL' | translate }}</ba-button>
        <ba-loader-button id="custColSave" :done="done" @click="handleNewColumnConfig" :class="['ba-primary', {'empty-active-headers': emptyActiveHeaders}]">{{ 'SAVE' | translate }}</ba-loader-button>
      </div>
    </ba-modal>

    <ba-toast ref="errorToast" position="top">
      <i class="ba-icon ba-alert-circle" slot="icon"></i>
      <div slot="body">{{ 'COL_CONFIG_ERROR' | translate }}
      </div>
    </ba-toast>

  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions } from 'vuex';
import Draggable from 'vuedraggable';
import RepositoryService from '../services/repositories';

import loader from './mixins/loader';

export default {
  components: {
    Draggable
  },

  mixins: [loader],

  props: [
    'user',
    'activeRepo'
  ],

  data() {
    return {
      activeHeaders: {},
      detailedHeaders: {},
      resetActiveColHeaders: {},
      resetDetailedColHeaders: {},
      sortAsc: false
    }
  },

  computed: {
    emptyActiveHeaders() {
      return this.activeHeaders.container ? this.activeHeaders.container.contents.length === 0 : true;
    },

    emptyDetailedHeaders() {
      return this.detailedHeaders.container ? this.detailedHeaders.container.contents.length === 0 : true;
    },

    ...mapGetters([
      'activeColHeaders',
      'detailedColHeaders'
    ])
  },

  methods: {
    init() {
      this.activeHeaders = _.cloneDeep(this.activeColHeaders);
      this.detailedHeaders = _.cloneDeep(this.detailedColHeaders);
    },

    open() {
      this.init();
      this.$refs.columnConfig.open();
    },

    sort(header) {
      if (header === 'active' && this.sortAsc) {
        this.activeHeaders.container.contents.reverse();
        this.sortAsc = false;
      } else if (header === 'active' && !this.sortAsc) {
        this.activeHeaders.container.contents = _.orderBy(this.activeHeaders.container.contents, [(c) => {
          return c.title.toLowerCase();
        }], ['asc']);
        this.sortAsc = true;
      } else if (header === 'detailed' && this.sortAsc) {
        this.detailedHeaders.container.contents.reverse();
        this.sortAsc = false;
      } else if (header === 'detailed' && !this.sortAsc) {
        this.detailedHeaders.container.contents = _.orderBy(this.detailedHeaders.container.contents,[(c) => {
          return c.title.toLowerCase();
        }], ['asc']);
        this.sortAsc = true;
      }
    },

    addAll() {
      _.forEach(this.detailedHeaders.container.contents, (h) => {
        this.activeHeaders.container.contents.push(h);
      });
      this.detailedHeaders.container.contents = [];
      this.activeHeaders.container.contents = _.orderBy(this.activeHeaders.container.contents, [(c) => {
        return c.title.toLowerCase();
      }], ['asc']);
      this.sortAsc = true;
    },

    removeAll() {
      _.forEach(this.activeHeaders.container.contents, (h) => {
        this.detailedHeaders.container.contents.unshift(h);
      });
      this.activeHeaders.container.contents = [];
      this.detailedHeaders.container.contents = _.orderBy(this.detailedHeaders.container.contents, [(c) => {
        return c.title.toLowerCase();
      }], ['asc']);
      this.sortAsc = true;
    },

    removeHeader(header) {
      this.activeHeaders.container.contents = _.remove(this.activeHeaders.container.contents, c => c.name !== header.name);
      this.detailedHeaders.container.contents.unshift(header);
      this.isRemoveEnabled();
    },

    isRemoveEnabled() {
      return this.activeHeaders.container.contents.length > 0;
    },

    addHeader(header) {
      this.detailedHeaders.container.contents = _.remove(this.detailedHeaders.container.contents, c => c.name !== header.name);
      this.activeHeaders.container.contents.push(header);
      this.isAddEnabled();
    },

    isAddEnabled() {
      return this.detailedHeaders.container.contents.length > 0;
    },

    resetColumns() {
      this.$refs.columnConfig.close();
      this.activeHeaders = _.cloneDeep(this.activeColHeaders);
      this.detailedHeaders = _.cloneDeep(this.detailedColHeaders);
    },

    handleNewColumnConfig(columnConfig) {
      this.isLoadComplete = false;
      if (!this.activeHeaders.container) {
        this.init();
      }
      if (this.activeHeaders.name === 'default') {
        const name = `${this.user.first}_${this.user.last}_${this.activeRepo}_${this.$root.locale.toUpperCase()}`;
        this.activeHeaders.name = name;
      }
      if (columnConfig) {
        let columnData = [];
        _.forEach(columnConfig, (o) => {
          columnData.push(_.find(this.activeHeaders.container.contents, (v, i) => {
            return v.name === o;
          }));
        });
        this.activeHeaders.container.contents = columnData;
      }
      let headers = _.uniqBy(this.activeHeaders.container.contents, 'name');
      this.activeHeaders.container.contents = headers;
      RepositoryService.createNewForm({ repoId: this.activeRepo }, this.activeHeaders).then((response) => {
        this.isLoadComplete = true;
        if (response.ok) {
          this.setActiveColHeaders(response.body);
          this.$emit('tableHeaders');
          this.$refs.columnConfig.close();
        } else {
          this.$refs.errorToast.open();
          this.$refs.columnConfig.close();
        }
      },
       (error) => {
          this.isLoadComplete = true;
        });
    },
    ...mapActions([
      'setActiveColHeaders'
    ])
  }
}
</script>

<style lang="less">

  #configure-columns,
  .configure-columns {
    .ba-content {
      padding: 15px;
      height: ~"calc(100vh - 350px)";
      overflow-y: scroll;

      .sub-title {
        text-align: right;
        padding-bottom: 15px;
        border-bottom: 1px solid #BACBCB;
        .add-all-headers {
          text-align: right;
        }

        .remove-all-headers {
          text-align: left;
        }

        .add-all-headers,
        .remove-all-headers {
          font-size: 12px;
          flex: 1;
          text-decoration: underline;
          color: #4899D2;
          font-weight: bold;
          cursor: pointer;
          letter-spacing: 0.1rem;
        }

        .pipe {
          flex: 0.25;
          text-align: center;
        }
      }

      .header-container {
        display: inline-flex;
        width: 100%;

        .active-container {
          flex: 3;
          padding-right: 10px;
          padding-top: 15px;
          border-right: 0.25px solid #BACBCB;

          .active-header-title {
            margin: 0 0 10px 10px;
            font-size: 14px;
            display: flex;
            .active-header {
              flex: 6;
              svg, i {
                color: #BACBCB;
              }
            }
          }

          .active-headers {
            height: 100%;
          }
        }

        .available-container {
          flex: 3;
          padding-left: 10px;
          padding-top: 15px;

          .avail-header-title {
            margin: 0 0 10px 10px;
            font-size: 14px;
            display: flex;
            .available-header {
              flex: 6;
              svg, i {
                color: #BACBCB;
              }
            }
          }

          .avail-headers {
            height: 100%;
            .col-header {
              color: #BACBCB;
              background-color: #F4F6F8;
            }
            .col-header:active {
              color: #000000;
            }
            .col-header:hover {
              color: #000000;
            }
          }

        }
      }
    }

    .header-sort {
      padding-right: 15px;
      height: 20px;
      cursor: pointer;
    }

    .col-header {
      margin-bottom: 10px;
      border: 0.5px solid #E5E9E9;
      padding: 15px 0 15px 0;
      cursor: pointer;
      text-transform: uppercase;
      .col-header-move,
      .col-header-remove {
        float: right;
        margin-right: 15px;
        svg {
          fill: #BACBCB;
        }
      }
      .col-header-remove {
        padding-top: 2px;
        color: #BACBCB;
        .ba-window-close {
          fill: #BACBCB;
        }
      }
    }
    .col-header:active {
      box-shadow: 0px 5px 15px 2px #E5E9E9;
      svg {
        fill: #3598DB;
      }
    }
    .col-header:hover {
      box-shadow: 0px 5px 15px 2px #E5E9E9;
      svg {
        fill: #3598DB;
      }
    }

    .col-header-name {
      margin-left: 15px;
      font-size: 12px;
      font-weight: bold;
    }

    .col-order {
      color: #BACBCB;
      font-size: 1rem;
      margin-bottom: 1rem;
    }
  }

</style>
