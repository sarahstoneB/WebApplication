<template>
  <div class="main-container" @keydown="handleKeyEvents">
    <div>
      <div class="filter-menu">
        <div>
          <span id="advSearchClearAll" class="edit-option"  @click="clearFilters()">{{ 'CLEAR_ALL' | translate }}</span>
          <span id="advSearchRemoveAppliedFilter" class="edit-option"  @click="removeAppliedFilter()">{{ 'REMOVE_FILTER' | translate }}</span>
        </div>
      </div>
      <div class="filter-wrapper" :key="activeFilter.name" v-for="(activeFilter, activeFilterIndex) in  activeFilters">
        <div :class="['query-condition', { 'hidden' : activeFilterIndex === 0 }]">{{ 'AND' | translate }}</div>
        <div class="filter-container">
<<<<<<< HEAD
          <ba-dropdown id="dropdown-content" ref="dropdown" class="filter-input">
=======
          <ba-dropdown id="attribute-dropdown" ref="dropdown" class="filter-input">
>>>>>>> CICD/CI_CD
            <div id="advSearchSelectAttribute" slot="button" v-if="!activeFilters[activeFilterIndex].name" class="placeholder">{{ 'SELECT_ATTRIBUTE' | translate }}</div>
            <div slot="button" class="selected-attribute">{{ activeFilters[activeFilterIndex].name }}</div>
            <ba-dropdown-item :key="attribute.name" v-for="attribute in filterAttributes" @click="updateFilterAttributes(attribute, activeFilterIndex)">
              {{ attribute.name }}
            </ba-dropdown-item>
          </ba-dropdown>
          <span class="attribute-dropdown-icon">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="#000000" d="M7,10L12,15L17,10H7Z" />
            </svg>
          </span>
<<<<<<< HEAD
          <input type="text" class="filter-input" v-model="activeFilter.operator" disabled></input>
          <input id="advSearchvalue" type="text" class="filter-input" v-model="activeFilter.query" :placeholder="$t('VALUE')" @keyup="setFilterStatus"></input>
=======
          <ba-dropdown id="operator-dropdown" class="filter-input">
            <div slot="button" class="selected-attribute">{{ activeFilter.operator.name }}</div>
            <ba-dropdown-item :key="index" v-for="(attribute, index) in operators" @click="updateOperator(attribute, activeFilterIndex)">
              {{ attribute.name }}
            </ba-dropdown-item>
          </ba-dropdown>
          <span class="operator-dropdown-icon">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="#000000" d="M7,10L12,15L17,10H7Z" />
            </svg>
          </span>
          <input id="advSearchvalue" type="text" @change="updateFilterQuery(activeFilterIndex)" class="filter-input" v-model="activeFilter.queryText" :placeholder="$t('VALUE')" @keyup="setFilterStatus" />
>>>>>>> CICD/CI_CD
          <div id="advSearchAddButton" class="button-add" v-if="showAddButton && activeFilterIndex === activeFilters.length - 1" @click="addNewFilter(activeFilter)">
            <svg style="width:30px;height:30px" viewBox="0 0 24 24">
              <path fill="#3598DB" d="M17,13H13V17H11V13H7V11H11V7H13V11H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
            </svg>
          </div>
        </div>
        <div id="advSearchRemoveFilter"  class="remove-filter" v-show="showRemoveButton" @click="removeFilter(activeFilterIndex)">X</div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'advanced-filter',

  props: {
    filterData: {
      type: Array,
      default: () => []
    },
    useSession: {
      type: Boolean,
      default: false
    },
    sessionKey: {
      type: [String, Number],
      default: 'filter'
    },
  },

  data() {
    return {
      activeFilters: [],
      filterAttributes: [],
      operators: [
        {
          name: this.$t('EQUAL_TO'),
          value: '_'
        }, {
          name: this.$t('CONTAINS'),
          value: '*_*'
        }, {
          name: this.$t('STARTS_WITH'),
          value: '_*'
        }, {
          name: this.$t('ENDS_WITH'),
          value: '*_'
        }
      ]
    }
  },

  computed: {
    showAddButton() {
      return (this.filterAttributes.length > 0);
    },

    showRemoveButton() {
      return this.activeFilters.length > 1;
    }
  },

  watch: {
    filterData: function() {
      this.filterAttributes = this.filterData;
    }
  },

  created: function() {
    this.setFilterStatus();
  },

  mounted() {
    let filtersInSession = this.getFilterFromSession();
    if (this.useSession && filtersInSession) {
      _.forEach(filtersInSession, (filter, index) => {
        this.addFilter(filter);
      });
    } else {
      this.addNewFilter();
    }
  },

  methods: {
    setFilterToSession() {
      window.sessionStorage.setItem(this.sessionKey, JSON.stringify(this.activeFilters));
    },

    getFilterFromSession() {
      return JSON.parse(window.sessionStorage.getItem(this.sessionKey));
    },

    clearSession() {
      window.sessionStorage.removeItem(this.sessionKey);
    },

    handleKeyEvents(e) {
      if (e.key == 'Enter') {
        if (this.setFilterStatus()) {
        this.$emit('enter');
        }
      } else if (e.key == 'Escape') {
        this.$emit('esc');
      }
    },

    setFilterStatus() {
      let flagFilterStatus = true;
      this.activeFilters.forEach(function (value, key) {
        let filterName  = value.name.length;
        let filterValue = value.queryText.length;
        if (!(filterName && filterValue)) {
          flagFilterStatus = false;
        }
      });
      if (flagFilterStatus){
        this.$emit('filterEnabled');
        return flagFilterStatus;
      } else {
        this.$emit('filterDisabled');
        return flagFilterStatus;
      }
    },

    toggleActiveDropdownState(index) {
      this.activeFilters[index].active = !this.activeFilters[index].active;
    },

    removeFilter(indexToRemove) {
      this.addFilterAttributeToList(indexToRemove);
      this.activeFilters = _.remove(this.activeFilters, (filter, filterIndex) => {
        return indexToRemove !== filterIndex;
      });
      this.setFilterStatus();
    },

    removeFilterAttributeFromList(attributeToRemove) {
      this.filterAttributes = _.remove(this.filterAttributes, (filterAttribute) => {
        return filterAttribute.name !== attributeToRemove.name;
      })
    },

    addFilterAttributeToList(indexToAdd) {
      let filterToAdd = this.activeFilters[indexToAdd];
      if (filterToAdd.name) {
        this.filterAttributes.push({
          'name': filterToAdd.name,
          'value': filterToAdd.attribute
        });
      }
    },

    removeAppliedFilter() {
      this.clearFilters();
      this.$emit('filterRemoved');
    },
    
    updateOperator(operator, filterIndex) {
      this.activeFilters[filterIndex].operator = operator;
      this.updateFilterQuery(filterIndex);
    },

    updateFilterQuery(filterIndex) {
      let query = this.activeFilters[filterIndex].queryText;
      let operator = this.activeFilters[filterIndex].operator;
      query = query.replace('*', '');
      this.activeFilters[filterIndex].query = operator.value.replace('_', query);
    },

    updateFilterAttributes(attribute, filterIndex) {
      this.removeFilterAttributeFromList(attribute);
      this.addFilterAttributeToList(filterIndex);
      let activeFilterElement = this.activeFilters[filterIndex];
      activeFilterElement.attribute = attribute.value;
      activeFilterElement.name = attribute.name;
      activeFilterElement.active = false;
      this.setFilterStatus();
    },

    addFilter(filter) {
      this.activeFilters.push(filter);
    },

    addNewFilter() {
      let filterModel = {
        attribute: '',
        name: '',
<<<<<<< HEAD
        operator: this.$t('EQUAL_TO'), // TODO: pass array of operators when service is available
=======
        operator: {
          name: this.$t('EQUAL_TO'),
          value: '_'
        },
>>>>>>> CICD/CI_CD
        query: '',
        queryText: '',
        active: false
      }
      this.activeFilters.push(filterModel);
      this.setFilterStatus();
    },

    getFilters() {
      if (this.useSession) {
        if (this.activeFilters[0] && this.activeFilters[0].attribute && this.activeFilters[0].query) {
          this.setFilterToSession();
        } else {
          this.clearSession();
        }
      }
      return this.activeFilters;
    },

    clearFilters() {
      _.forEach(this.activeFilters, (obj, index) => {
        this.addFilterAttributeToList(index);
      })
      this.activeFilters = [];
      this.addNewFilter();
      this.$emit('filterDisabled');
    }
  }
}
</script>

<style lang="less">
#attribute-dropdown, #operator-dropdown {
  cursor: pointer;
  .dropdown-content {
    right: 0 !important;
    position: relative;
  }
  ul {
    margin-top: 10px;
    max-height: 200px;
    overflow-y: auto;
  }
  li {
    padding: 5px;
    min-width: 180px;
    a {
      font-size: 12px;
      padding: 0;
    }
    &:hover {
      background-color: #E5E5E5;
    }
  }
}
</style>

<style lang="less" scoped>
.main-container {
  padding-left: 20px;
  padding-right: 20px;
  transition: opacity 0.25s;
}

.filter-wrapper {
  display: flex;
  margin-bottom: 10px;
  margin-top: 10px;
}

.filter-container {
  position: relative;
  width: 80%;
  display: flex;
  border: 1px solid #EBECEE;
  padding: 10px;
  background-color: #F9F9F9;
  max-height: 30px;
}

.filter-input {
  flex: 1;
  max-width: 200px;
  margin-top: 0px;
  margin-right: 10px;
  padding-left: 5px;
  border: 1px solid #BACACA;
  background-color: #FFFFFF;
  color: #000000;
  letter-spacing: 1px;
  font-size: 0.9em;
  font-weight: bold;
}

.button-add {
  align-self: center;
  margin-top: 5px;
  cursor: pointer;
}

.query-condition {
  font-weight: bold;
  align-self: left;
  border-right: 2px solid #DBE4E3;
  border-left: 1px solid #EBECEE;
  border-top: 1px solid #EBECEE;
  border-bottom: 1px solid #EBECEE;
  background-color: #F9F9F9;
  padding: 15px 10px;
  max-height: 20px;
  text-transform: uppercase;
}

.remove-filter {
  text-align: center;
  padding: 20px;
  font-size: 1.3rem;
  line-height: 20px;
  color: #BDBFC0;
  font-weight: lighter;
  cursor: pointer;
}

.dropdown-content {
  border: 1px solid #BACACA;
  padding: 5px;
  background-color: #FFFFFF;
  max-height: 200px;
  overflow-y: auto;
}

.placeholder {
  position: relative;
  z-index: 1;
  margin-top: 5px;
  color: #C4C4C4;
  font-weight: lighter;
  cursor: pointer;
}

.selected-attribute {
  position: relative;
  width: 200px;
  flex: 4;
  margin-top: 5px;
  cursor: pointer;
  z-index: 1;
}

input {
  margin-bottom: 0;
  &::placeholder {
    color: #C4C4C4;
  }
}

.operator-dropdown-icon, .attribute-dropdown-icon {
  position: absolute;
  cursor: pointer;
}

.attribute-dropdown-icon {
  left: 190px;
}

.operator-dropdown-icon {
  left: 410px;
}

.edit-option {
  letter-spacing: 0.1em;
  margin-left: 50px;
  text-decoration: underline;
  color: #4899D2;
  font-weight: bold;
  cursor: pointer;
}

.hidden {
  visibility: hidden;
}
</style>
