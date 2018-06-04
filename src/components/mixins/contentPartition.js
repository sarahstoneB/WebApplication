import _ from 'lodash';

export default {
  computed: {
    splitContent() {
      return this.content ? _.chunk(this.content, Math.ceil(this.content.length / this.partitions)) : [];
    }
  },

  methods: {
    getPartitionContent(partition) {
      if (this.partitions === 1) {
        return this.content ? this.content : null;
      } else if (this.partitions === 2) {
        return this.content ? _.filter(this.content, (value, index) => {
          return (partition === 2 ? (index % 2 === 1) : (index % 2 === 0)) && (value.slot === 'value' || value.slot === undefined);
        }) : [];
      } else {
        let partitionedContent = [];
        let content = {};
        _.forEach(this.splitContent, (value, index) => {
          content = _.at(value, [partition - 1])[0];
          partitionedContent.push(content ? content : {});
        })
        return partitionedContent;
      }
    }
  }
};
