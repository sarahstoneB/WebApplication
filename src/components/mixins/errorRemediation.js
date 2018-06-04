import { mapGetters, mapActions } from 'vuex';
import ErrorService from '../../services/error';

export default {
  data() {
    return {
      customHeaders: []
    };
  },

  computed: {
    ...mapGetters([
      'activeDocument',
      'activeDocumentErrors',
      'documentJson',
      'remediationChanges',
      'errorInfo'
      ])
  },

  methods: {
    validateInputs(repoId, docId, action, modalName) {
      this.setActiveDocumentErrors({});
      this.resetErrorMessage();
      ErrorService.processError(
        {
          repoId: repoId,
          docId: docId,
          action: action
        },
        {
          action: action,
          attributes: this.remediationChanges.attributes
        }).then((response) => {
          if (response.ok) {
            this.closeModal(modalName);
          }
        }, (error) => {
          if (error.statusCode = 409) {
            if (error.body.attributes.ERROR.includes('{')) {
              this.setActiveDocumentErrors(JSON.parse(error.body.attributes.ERROR));
            } else {
              this.setActiveDocumentErrors({});
            }
            this.closeModal(modalName);
          }
        })
    },

    closeModal(modalName) {
      this.isLoadComplete = true;
      if (modalName == 'createModal') {
        this.$refs.createModal.close();
      } else {
        this.closeEditModal();
      }
    },

    ...mapActions([
      'setActiveDocumentErrors',
      'resetErrorMessage'
    ])
  }

};