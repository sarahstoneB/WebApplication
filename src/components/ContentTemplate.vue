<template>
  <div v-if="values[0].type === 'description'">
    <content-description :toolTip="toolTip" :template="value" :isPartyCard="true"></content-description>
  </div>
  <div v-else>
    <div class="label-text" v-if="showLabel">{{ displayName }}</div>
    <span :class="[{ 'value-text': showLabel}]">
      <div :class="['value', { 'has-error': hasError }, { 'h2' : style && (style.tag === 'h2') }]" v-ba-tooltip="toolTip">{{ value }}</div>
    </span>
  </div>
</template>

<script>
  import _ from 'lodash';
  import { mapGetters } from 'vuex';

  import ContentDescription from './ContentDescription.vue'

  export default {
    props: ['template', 'values', 'item', 'toolTip', 'format', 'showLabel', 'displayName'],

    components: { ContentDescription },

    computed: {
      value() {
        return this.resolveTemplate(this.template, _.reduce(this.values, (result, v) => {
          result[`v${_.keysIn(result).length + 1}`] = this.item.ATTRIBUTES[v.name] || '';
          return result;
        }, {}));
      },

      hasError() {
        return _.reduce(_.keys(this.activeDocumentErrors), (result, de) => {
          if (_.map(this.values, _.property('name')).includes(de)) {
            result = true;
          }
          return result;
        }, false);
      },

      style() {
        return this.format ? this.format : undefined;
      },

      ...mapGetters(['activeDocumentErrors'])
    },

    methods: {
      resolveTemplate(template, params) {
        return _.values(params).join(' ');
      }
    }
  }
</script>

<style lang="less" scoped>
  .label {
    font-size: 0.85rem;
    color: #ABABAB;
    margin-top: 5px;
  }

  .has-error {
    color: #DB4439;
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

  .value-text {
    width: 60%;
    text-align: left;
    float: right;
  }

  .label-text {
    float: left;
    font-weight: 600;
  }

</style>
