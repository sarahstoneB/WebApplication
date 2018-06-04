<template>
  <div :class="['section', { horizontal: orientation === 'horizontal' }]">
    <template v-for="c in content">
      <create-section :randomDocId="randomDocId" :document-id="documentId" :content="c.content" :is-nested="isNested" :orientation="c.orientation" :document-type="documentType" v-if="c.type === 'section'"/>
      <create-field :randomDocId="randomDocId" :document-id="documentId" :document-type="documentType" :is-nested="isNested" :name="c.name" :display-name="c.displayName" :editor-type="c.editorType" :no-selection-label="c.noSelectionLabel" :choices="c.choices" v-if="c.type === 'attribute'"/>
      <create-switch :randomDocId="randomDocId" :document-id="documentId" :document-type="documentType" :is-nested="isNested" :name="c.name" :cases="c.cases" v-if="c.type === 'switch'"/>
    </template>
  </div>
</template>

<script>
  import CreateSection from './CreateSection';
  import CreateField from './CreateField';
  import CreateSwitch from './CreateSwitch';

  export default {
    props: ['documentId', 'content', 'documentType', 'orientation', 'isNested', 'randomDocId'],
    components: {
      CreateSection,
      CreateField,
      CreateSwitch
    },
    beforeCreate() {
      this.$options.components.CreateSection = require('./CreateSection.vue');
    }
  }
</script>

<style lang="less" scoped>
  .horizontal {
    display: flex;
  }
</style>
