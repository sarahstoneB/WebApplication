<template>
  <div :class="['section', { horizontal: orientation === 'horizontal' }]">
    <template v-for="c in content">
      <edit-section :randomDocId="randomDocId" :isRequired="c.required" :document-id="documentId" :content="c.content" :is-nested="isNested" :orientation="c.orientation" :document-type="documentType" v-if="c.type === 'section'" :editable="c.editable" />
      <edit-field :randomDocId="randomDocId" :isRequired="c.required" :document-id="documentId" :document-type="documentType" :is-nested="isNested" :name="c.name" :display-name="c.displayName" :editor-type="c.editorType" :no-selection-label="c.noSelectionLabel" :choices="c.choices" v-if="c.type === 'attribute'" :editable="c.editable" />
      <edit-switch :randomDocId="randomDocId" :isRequired="c.required" :document-id="documentId" :document-type="documentType" :is-nested="isNested" :name="c.name" :cases="c.cases" v-if="c.type === 'switch'"   :editable="c.editable" />
    </template>
  </div>
</template>

<script>
  import EditSection from './EditSection';
  import EditField from './EditField';
  import EditSwitch from './EditSwitch';

  export default {
    props: ['documentId', 'content', 'documentType', 'orientation', 'isNested', 'randomDocId'],
    components: {
      EditSection,
      EditField,
      EditSwitch
    },
    beforeCreate() {
      this.$options.components.EditSection = require('./EditSection.vue');
    }
  }
</script>

<style lang="less" scoped>
  .horizontal {
    display: flex;
  }
</style>
