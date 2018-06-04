// to be used for filters with ref="filter"
import _ from 'lodash';

export default {
  data() {
    return {
      validData: true,
      filterObject: [],
      filterCount: 0
    };
  },

  methods: {
    getFilterAttributes(headers) {
      let filterAttributes = [];
      _.forEach(headers, (obj) => {
        filterAttributes.push({ 'name' : obj.name, 'value': 'attributes.' + obj.value })
      })
      return filterAttributes;
    },

    addFilterQueryParams(payload) {
      let filters = this.$refs.filter.getFilters();
      if (filters[0] && filters[0].attribute && filters[0].query) {
        this.filterCount = filters.length;
        _.forEach(filters, (obj) => {
          if(obj.attribute && obj.query) {
            payload[obj.attribute] = obj.query.trim();
          }
        });
      } else {
        this.filterCount = 0;
      }
    },

    clearFilter() {
      this.$refs.filter.clearFilters();
    },

    enableFilter() {
      this.validData = false;
    },

    disableFilter() {
      this.validData = true;
    },
  }
}
