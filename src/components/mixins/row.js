
import _ from 'lodash';

export default {
  computed: {
    isArray (item) {
      return _.isArray(this.sourceDocument.ATTRIBUTES[this.rowKey.name]) || _.isArray(this.masterDocument.ATTRIBUTES[this.rowKey.name]);
    },

    nestedKeys: {
      cache: false,
      get() {
        if (this.isArray) {
          return this.mergeForm && this.mergeForm.form ? _.find(this.mergeForm.form.gridContent, gc => gc.name === this.rowKey.name).gridContent : [];
        } else {
          return null
        }
      }
    },

    nestedSourceDocuments() {
      return this.isArray ? this.sourceDocument.ATTRIBUTES[this.rowKey.name] ? this.sourceDocument.ATTRIBUTES[this.rowKey.name] : [] : [];
    },

    nestedMatchedDocuments() {
      if (this.masterIndex > 0) {
        return this.isArray && this.matchedDocuments[this.masterIndex].ATTRIBUTES[this.rowKey.name] ? this.matchedDocuments[this.masterIndex].ATTRIBUTES[this.rowKey.name] : [];
      }
      return this.isArray && this.masterDocument.ATTRIBUTES[this.rowKey.name] ? this.masterDocument.ATTRIBUTES[this.rowKey.name] : [];
    },

    currentNestedMatchedDocuments() {
      return this.isArray && this.$store.getters.activeMaster.ATTRIBUTES[this.rowKey.name] ? this.$store.getters.activeMaster.ATTRIBUTES[this.rowKey.name] : [];
    },

    tabTitle() {
      let activeGrid = [];

      if (_.isArray(this.mergeForm.form.gridContent)) {
        activeGrid = _.filter(this.mergeForm.form.gridContent, (content) => {
          return content.name === this.rowKey.name;
        });
      }
      return activeGrid.length > 0 ? activeGrid[0].tabTitle : '';
    }
  },

  created() {
    if (this.isArray) {
      if (this.nestedSourceDocuments.length) {
        this.setActiveSourceDocId(this.nestedSourceDocuments[0].DOCUMENTID);
      }

      if (this.nestedMatchedDocuments.length) {
        this.setActiveMatchedDocId(this.nestedMatchedDocuments[0].DOCUMENTID);
      }
    }
  },

  methods: {

    getTabTitle(docId, documents) {
      let count = _.findIndex(documents, { DOCUMENTID: docId });
      return this.tabTitle.type === 'counter' ? _.replace(this.tabTitle.template, '%count%', count + 1) : '';
    },

    checkMatchingMatchedDocuments(sourceDoc, docsToCompare = []) {
      if (typeof sourceDoc === 'undefined') {
        return false;
      }

      const nestedKeysName = _.map(this.nestedKeys, (key) => {
        return key.name;
      });
      const keysToCompare = _.intersection(nestedKeysName, Object.keys(sourceDoc.ATTRIBUTES)) || [];
      const matchedDoc = docsToCompare.find((doc) => {
        let matched = true;

        keysToCompare.forEach((key) => {
          if (sourceDoc.ATTRIBUTES[key] !== doc.ATTRIBUTES[key]) {
            matched = false;
          }
        });

        return matched === true;
      });
      return typeof matchedDoc !== 'undefined' ? matchedDoc.DOCUMENTID : false;
    },

    setActiveSourceDocId(newId) {
      this.activeSourceDocId = newId;
      this.activeNestedSourceDocument = _.find(this.nestedSourceDocuments, { DOCUMENTID: newId });

      const matching = this.checkMatchingMatchedDocuments(this.activeNestedSourceDocument, this.nestedMatchedDocuments);
      if (matching) {
        this.setActiveMatchedDocId(matching);
      }
    },

    setActiveMatchedDocId(newId) {
      this.activeMatchedDocId = newId;

      if (this.isMerge) {
        this.master.activeSlot = 0;
        this.activeNestedMatchedDocument = _.find(this.currentNestedMatchedDocuments, { DOCUMENTID: this.activeMatchedDocId });
      } else {
        this.activeSlot = 0;
        this.activeNestedMatchedDocument = _.find(this.nestedMatchedDocuments, { DOCUMENTID: this.activeMatchedDocId });
      }
    }

  }
};
