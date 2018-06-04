import _ from 'lodash';

export default {
  methods: {
    getLabel(content, item) {
      let labelItem = null;
      if (content && item) {
        labelItem = _.find(content.values, v => v.slot === 'label');
      }
      return labelItem ? item.ATTRIBUTES[labelItem.name] : '';
    }
  }
}
