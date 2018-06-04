import {mapActions} from 'vuex';

export default {
  computed: {
    features() {
      return this.$root.features ? this.$root.features : {};
    },

    actions() {
      return this.isError ? this.features.ERROR_REMEDIATION.actions : this.features.DATA_VIEW.actions;
    },

    editForm() {
      return this.form && this.form.edit ? this.form.edit : {};
    },

    cardActions() {
      return this.actions ? this.actions.card : {};
    },

    isError() {
      return this.$route.path.includes('errorcardview');
    }
  },

  methods: {
    removeItem(documentType, documentId) {
      this.removeItemFromActiveDocument({ documentType: documentType, documentId: documentId });
      this.closeOptionsMenu();
    },

    ...mapActions([
      'removeItemFromActiveDocument'
    ])
  }
};
