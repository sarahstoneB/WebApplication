<template>
  <div>
    <div class="attribute-row" :key="attr.displayName" :class="'attribute'+attr.displayName" v-for="attr in attributes">
      <div class="cell attribute-row-name" v-if="!matched">{{ attr.displayName }}</div>
      <merge-attribute :name="attr.name"  :value="document.ATTRIBUTES[attr.name]" :matched="matched" />
    </div>
  </div>
</template>

<script>
  import MergeAttribute from './MergeAttribute';

  export default {
    props: {
      attributes: {
        type: Array,
        default: () => []
      },
      document: {
        type: Object,
        default: () => {}
      },
      matched: {
        type: Boolean,
        default: false
      }
    },

    components: {
      MergeAttribute
    }
  };
</script>

<style lang="less" scoped>
  .sticky-row .attribute-row {
    background: #fff;
  }
  .attribute-row {
    display: table;
    width: 100%;

    &:nth-of-type(odd) {
      background-color: #FFF;
    }

    .cell {
      display: table-cell;
      max-height: 35px;
      line-height: 35px;
      padding-left: 20px;
      max-width: ~"calc(50vw - 138px)";
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &-name {
      width: 26%;
      font-weight: bold;
      border-right: 1px solid #C8D5D5;
      border-bottom: 1px solid #C8D5D5;
    }
  }
</style>
