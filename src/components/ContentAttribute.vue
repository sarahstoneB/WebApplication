<template>
  <div>
    <span v-if="isSeperator">
      <hr class="seperator" />
    </span>
    <span v-else>
      <div v-if="label || value" :class="['value', { 'error-view' : isErrorView }]">
        <div v-if="showLabel" class="label-text">{{ label }}</div>
        <span :class="[{ 'value-text': showLabel}]">
          <span :class="[{'h2' : style && (style.tag === 'h2'),  'has-error': hasError }]" v-ba-tooltip="toolTip">{{ value }}</span>
        </span>
      </div>
    </span>
  </div>
</template>

<script>
  import _ from 'lodash';
  import { mapGetters } from 'vuex';
  import contentValue from './mixins/contentValue';

  export default {
    mixins: [contentValue],

    props: ['name', 'item', 'displayName', 'showLabel', 'toolTip', 'format'],

    computed: {

      isSeperator() {
        return this.name.toLowerCase() === 'seperator';
      },

      isErrorView() {
        return this.$route.path.includes('errorcardview');
      },

      value() {
        return this.getValue(this.item, this.name);
      },

      label() {
        return this.value ? this.displayName : '';
      },

      style() {
        return this.format ? this.format : undefined;
      },

      hasError() {
        let hasError = false;
        const errorObject = _.find(this.activeDocumentErrors, de => _.has(de, this.item.DOCUMENTID));
        if (errorObject) {
          hasError = _.has(errorObject[this.item.DOCUMENTID].DATA, this.name);
        }
        return hasError;
      },

      ...mapGetters(['activeDocumentErrors'])
    }
  }
</script>

<style lang="less" scoped>
.has-error {
  text-align: left;
  color: #000000;
  font-weight: bold;
  text-decoration: underline;
  text-decoration-color: #D0302E;
  background-color: #E9CBCA;
}

.label-text {
  float: left;
  font-weight: 600;
}

.seperator {
  border: .5px;
  border-style: dashed;
  color: #E7EDED;
  margin-top: 3em;
  margin-bottom: 1em;
  margin-left: -2em;
  margin-right: -3em;
}

.value-text {
  width: 60%;
  text-align: left;
  float: right;
}

.value {
  line-height: 1.8em;
  clear: left;
}

.error-view {
  text-align: left;
}

.h2 {
  display: block;
  font-size: 1.5em;
  margin-top: 0.83em;
  margin-bottom: 0.83em;
  margin-left: 0;
  margin-right: 0;
  font-weight: bold;
}
</style>
