<template>
  <div>
    <edit-field class="field" :document-id="documentId" :document-type="documentType" :is-nested="isNested" :name="c.name" :display-name="c.displayName" :editor-type="c.editorType" :no-selection-label="c.noSelectionLabel" :choices="c.choices" v-for="c in content" :editable="c.editable" />
  </div>
</template>
<script>
  import _ from 'lodash';
  import { mapGetters } from 'vuex';
  import EditField from './EditField';

  export default {
    props: ['documentId', 'documentType', 'name', 'cases', 'isNested'],
    components: {
      EditField
    },
    computed: {
      content() {
        let selectedCase = null;
        if (this.isNested) {
          selectedCase = this.activeDocument ? _.find(this.cases, c => c.equals && c.equals.value === _.find(this.activeDocument[this.documentType], d => d.DOCUMENTID === this.documentId).ATTRIBUTES[this.name]) : null;
        } else {
          selectedCase = this.activeDocument ? _.find(this.cases, c => c.equals && c.equals.value === this.activeDocument[this.name]) : null;
        }
        return selectedCase ? selectedCase.equals.content : [];
      },

      ...mapGetters(['activeDocument'])
    }
  }
</script>

<style lang="less" scoped>
  .field {
    margin-bottom: 1.0rem;
  }
</style>
