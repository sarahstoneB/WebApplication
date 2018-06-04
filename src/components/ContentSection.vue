<template>
  <div class="section">
    <div class="partition" v-for="p in partitions" >
      <template v-for="c in getSectionPartitionContent(p)">
        <content-section :partitions="c.partitions" :content="c.content" :showLabel="showLabel" :data-set="dataSet" v-if="c.type === 'section'" :isPartyCard="isPartyCard" />
        <content-atomic :partitions="c.partitions" :content="c.atomicContent" :showLabel="showLabel" :alignment="c.alignment" :data-set="dataSet" v-if="c.type === 'atomic'" :isPartyCard="isPartyCard"/>
      </template>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import ContentSection from './ContentSection';
  import ContentAtomic from './ContentAtomic';

  export default {
    props: ['partitions', 'content', 'dataSet', 'showLabel', 'isPartyCard'],
    components: {
      ContentSection,
      ContentAtomic
    },

    methods: {
      getSectionPartitionContent(partition) {
        return this.content ? _.filter(this.content, (c) => {
          if (c.partition === undefined) {
            c.partition = 1
          }
          return c.partition ===  partition && ['value', 'entity', undefined].includes(c.slot);
        }) : []
      }
    }
  }
</script>

<style lang="less" scoped></style>
