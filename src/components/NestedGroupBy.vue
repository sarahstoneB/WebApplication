<template>
  <div class="nested-groups">
    <nested-group class="nested-group" :title="group" :items="getGroupItems(group)" :form="form" :content = "content" :name="name" v-for="group in groups">
      <template v-for="c in content">
        <template v-if="c.type === 'attribute'">
          <content-attribute :name="c.name" :item="item" v-for="item in getGroupItems(group)" />
        </template>
        <template v-if="c.type === 'template'">
          <content-template :template="c.template" :values="c.values" :item="item" :label="getLabel(c, item)" v-for="item in getGroupItems(group)" />
        </template>
        <template v-if="c.type === 'switch'">
          <content-switch :name="c.name" :groupName="name" :cases="c.cases" :item="item"  :form="form" v-for="item in getGroupItems(group)" />
        </template>
        <template v-if="c.type === 'description'">
          <content-description :name="c.name" :item="item" :toolTip="c.toolTip" />
        </template>
      </template>
    </nested-group>
  </div>
</template>

<script>
  import _ from 'lodash';
  import NestedGroup from './NestedGroup';
  import ContentAttribute from './ContentAttribute';
  import ContentDescription from './ContentDescription';
  import ContentTemplate from './ContentTemplate';
  import ContentSwitch from './ContentSwitch';
  import contentLabel from './mixins/contentLabel';

  export default {
    mixins: [contentLabel],
    props: ['dataSet', 'content', 'groupBy', 'form', 'name'],

    components: {
      NestedGroup,
      ContentAttribute,
      ContentTemplate,
      ContentSwitch,
      ContentDescription
    },

    computed: {
      groups() {
        return this.dataSet ? _.uniq(_.reduce(this.dataSet, (result, i) => {
          result.push(i.ATTRIBUTES[this.groupBy]);
          return result;
        }, [])) : [];
      }
    },

    methods: {
      getGroupItems(group) {
        return _.filter(this.dataSet, i => i.ATTRIBUTES[this.groupBy] === group);
      }
    }
  }
</script>

<style lang="less">
  .nested-group {
    display: flex;
    padding: 15px 10px 15px 15px;
    border-top: 1px solid #BACBCB;
  }
</style>