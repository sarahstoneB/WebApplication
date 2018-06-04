import _ from 'lodash';

export default {
  methods: {
    getStatus(content, item) {
      var statusItem = null
        if (content && item) {
          statusItem = _.find(content, c => c.slot === 'status')
        }
        return statusItem ? item.ATTRIBUTES[statusItem.name] : ''
      }
  }
}
