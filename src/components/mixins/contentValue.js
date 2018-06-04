export default {
  methods: {
    getValue(item, name) {
      const result = item.ATTRIBUTES[name] ? item.ATTRIBUTES[name] : item.ATTRIBUTES[item.ATTRIBUTES.TYPE];

      return typeof result === 'undefined' ? '' : result;
    }
  }
};
