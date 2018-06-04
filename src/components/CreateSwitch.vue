<template>
  <div>
    <create-field class="field" :randomDocId="randomDocId" :document-id="documentId" :document-type="documentType" :is-nested="isNested" :name="c.name" :display-name="c.displayName" :editor-type="c.editorType" :no-selection-label="c.noSelectionLabel" :choices="c.choices" v-for="c in content"/>
  </div>
</template>
<script>
  import _ from 'lodash';
  import { mapGetters } from 'vuex';
  import CreateField from './CreateField';

  export default {
    props: ['documentId', 'documentType', 'name', 'cases', 'isNested', 'randomDocId'],
    components: {
      CreateField
    },
    computed: {
      content() {
        let selectedCase = null;
        if (this.isNested) {
          selectedCase = this.newDocument ? _.find(this.cases, c => c.equals && c.equals.value === _.find(this.newDocument[this.documentType], d => d.DOCUMENTID === this.documentId).ATTRIBUTES[this.name]) : null;
        } else {
          selectedCase = this.newDocument ? _.find(this.cases, c => c.equals && c.equals.value === this.newDocument[this.name]) : null;
        }
        return selectedCase ? selectedCase.equals.content : [];
      },

      ...mapGetters(['newDocument'])
    }
  }
</script>

<style lang="less" scoped>
  .field {
    margin-bottom: 1.0rem;
  }
</style>
