<template>
  <div>
    <div v-for="nestedGroup in nestedGroups" :key="nestedGroup.name">
      <div class="group-caption">{{ nestedGroup.displayName }}</div>
      <div class="group">
        <div class="group-row" :key="key" v-for="key in sorting[nestedGroup.name]">
          <div class="group-row-name" v-if="!matched">{{ key }}</div>
          <div :class="{ 'matched-values': matched, 'values': !matched }">
            <div class="group-row-value" :key="index" v-for="(value, index) in getValues(key, nestedGroup)">
              <span>{{ value }}</span>
            </div>
            <div class="group-row-value inserted" :key="index" v-for="(value, index) in getInserted(key, nestedGroup)">
              <span>{{ value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import _ from 'lodash';
  import { mapGetters } from 'vuex';

  export default {
    props: {
      nestedGroups: {
        type: Array,
        default: () => []
      },
      document: {
        type: Object,
        default: () => {}
      },
      sorting: {
        type: Object,
        default: () => []
      },
      matched: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      getValues(key, group) {
        const values = [];
        _.each(_.map(this.document.ATTRIBUTES[group.name], 'ATTRIBUTES'), (v) => {
          if (v[group.groupByContents.groupBy.name] === key) {
            values.push(v[group.groupByContents.value.name]);
          }
        });
        if ((_.isEmpty(values) && !this.matched) || (this.matched && this.getSourceValues(key, group).length === 0)) {
          values.push(' ');
        }
        return values;
      },

      getInserted(key, nestedGroup) {
        const sourceValues = this.getSourceValues(key, nestedGroup);
        const matchedValues = this.getValues(key, nestedGroup);
        return _.difference(sourceValues, matchedValues);
      },

      getSourceValues(key, nestedGroup) {
        return _.map(_.filter(this.sourceDocument.ATTRIBUTES[nestedGroup.name], i => i.ATTRIBUTES[nestedGroup.groupByContents.groupBy.name] === key), i => i.ATTRIBUTES[nestedGroup.groupByContents.value.name]);
      }
    },

    computed: mapGetters(['sourceDocument'])
  };
</script>

<style lang="less" scoped>
  .group-caption {
    height: 45px;
    line-height: 60px;
    padding-left: 20px;
    font-size: 13px;
    font-weight: bold;
    background-color: #FFF;
    border-bottom: 3px solid #C8D5D5;
  }

  .group {
    display: table;
    width: 100%;

    .group-row {
      display: flex;
      border-bottom: 1px solid #C8D5D5;

      &:nth-of-type(even) {
        background-color: #FFF;
      }

      &-name, &-value {
        height: 40px;
        line-height: 35px;
        padding-left: 20px;
        white-space: nowrap;
      }

      &-name {
        font-weight: bold;
        border-right: 1px solid #C8D5D5;
        flex: 2;
      }

      .values {
        display: flex;
        flex: 4;
        max-width: ~"calc(37vw - 8px)";
        overflow-x: scroll;
        overflow-y: hidden;
      }

      .matched-values {
        display: flex;
        flex: 4;
        max-width:~"calc(42vw - 8px)";
        overflow-x: scroll;
        overflow-y: hidden;
        -ms-overflow-style: -ms-autohiding-scrollbar;
      }
    }
  }

</style>
