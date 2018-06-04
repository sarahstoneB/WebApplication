export default {
  methods: {
    getDisplayValue(str = '') {
      return str.length > 60 ? str.substr(0, 60).concat('...') : str;
    }
  }
};
