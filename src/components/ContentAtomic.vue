<template>
  <div class="atomic">
    <div :style="{ textAlign : alignment ? alignment : ''}" class="partition party-card-partition" v-for="p in partitions">
      <template v-for="c in getPartitionContent(p)">
        <template v-if="c.type === 'attribute'">
          <content-attribute :name="c.name" :showLabel="showLabel" :displayName="c.displayName" :toolTip="c.toolTip" :format="c.format" :item="dataSet" />
        </template>
        <template v-if="c.type === 'template'">
          <content-template :template="c.template" :showLabel="showLabel" :displayName="c.displayName" :values="c.values" :format="c.format" :toolTip="c.toolTip" :item="dataSet" :label="getLabel(c, dataSet)" class="party-card-template" />
        </template>
        <template v-if="c.type === 'switch'">
          <content-switch :name="c.name" :showLabel="showLabel" :displayName="c.displayName" :cases="c.cases" :item="dataSet" :isPartyCard="isPartyCard" />
        </template>
        <template v-if="c.type === 'description'">
          <content-description :name="c.name" :toolTip="c.toolTip" :item="dataSet" :isPartyCard="true" />
        </template>
        <template v-if="c.type === 'description'">
          <content-description :name="c.name" :toolTip="c.toolTip" :item="dataSet" :isPartyCard="true" />
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import ContentAttribute from './ContentAttribute';
import ContentTemplate from './ContentTemplate';
import ContentSwitch from './ContentSwitch';
import ContentDescription from './ContentDescription';
import contentLabel from './mixins/contentLabel';
import contentPartition from './mixins/contentPartition';


export default {
  mixins: [contentLabel, contentPartition],
  props: ['partitions', 'content', 'dataSet', 'alignment', 'showLabel', 'isPartyCard'],
  components: {
    ContentAttribute,
    ContentTemplate,
    ContentSwitch,
    ContentDescription
  },

  methods: {
    getPartitionAtomicContent(partition) {
      return this.content ? _.filter(this.content, (c) => {
        if (c.partition === undefined) {
          c.partition = 1
        }
        return c.partition === partition && ['value', 'entity', undefined].includes(c.slot);
      }) : []
    },

    getGroupItems(group) {
      return _.filter(this.dataSet, i => i.ATTRIBUTES[this.groupBy] === group);
    }
  }
}
</script>

<style lang="less" scoped>
.atomic {
  display: flex;
}

.party-card-partition {
  flex-direction: row;
  flex: 1;
  text-align: center;
}

.party-card-attribute {
  text-align: center;
  font-size: 12px;
}

// .party-card-template {
//   background-color: #24272C;
//   color: #FFF;
//   font-weight: bold;
//   font-size: 18px;
//   width: 100%;
//   padding: 10px 0;
// }
</style>
