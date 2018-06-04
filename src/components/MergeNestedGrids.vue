<template>
  <div>
    <div v-for="nestedGrid in nestedGrids" :key="nestedGrid.name">
      <div>
        <div class="grid-caption">{{ nestedGrid.displayName }}</div>
        <div class="grid-container">
          <div class="grid-column" :key="content.name" v-for="content in nestedGrid.gridContent">
            <div class="grid-column-name">{{ content.displayName }}</div>
            <div :class="['grid-column-value', { inserted: value.inserted }]" :key="value.value" v-for="value in composeGrid(nestedGrid, content.name)">
              <span>{{ value.value }}</span>
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
      nestedGrids: {
        type: Array,
        default: () => []
      },
      document: {
        type: Object,
        default: () => {}
      },
      ceilings: {
        type: Object,
        default: () => {}
      },
      matched: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      composeGrid(nestedGrid, contentName) {
        let values;

        if (this.matched) {
          const comparisonKeys = _.map(nestedGrid.gridContent, 'name');
          const sharedDocuments = _.map(_.reduce(this.sourceDocument.ATTRIBUTES[nestedGrid.name], (result, sd) => {
            const sharedDocument = _.find(this.document.ATTRIBUTES[nestedGrid.name], dd => _.isEqual(_.pick(dd.ATTRIBUTES, comparisonKeys), _.pick(sd.ATTRIBUTES, comparisonKeys)));
            if (sharedDocument) {
              result.push(sharedDocument);
            }
            return result;
          }, []), (d) => {
            d.insertedDocument = false;
            return d;
          });
          let newDocuments = _.map(_.differenceWith(this.sourceDocument.ATTRIBUTES[nestedGrid.name],  this.document.ATTRIBUTES[nestedGrid.name], (i, o) => {
              if (i.ATTRIBUTES.ADDRESSID && o.ATTRIBUTES.ADDRESSID) {
                return _.filter(_.isEqual(_.pick(i.ATTRIBUTES, comparisonKeys), _.pick(o.ATTRIBUTES, comparisonKeys)), d => d.ATTRIBUTES.ADDRESSID !== i.ATTRIBUTES.ADDRESSID);
              } else {
                return _.isEqual(_.pick(i.ATTRIBUTES, comparisonKeys), _.pick(o.ATTRIBUTES, comparisonKeys))
              }
            }), (d) => {
            d.insertedDocument = true;
            return d;
          });
          const oldDocuments = _.map(_.differenceWith(this.document.ATTRIBUTES[nestedGrid.name], this.sourceDocument.ATTRIBUTES[nestedGrid.name], (i, o) => _.isEqual(_.pick(i.ATTRIBUTES, comparisonKeys), _.pick(o.ATTRIBUTES, comparisonKeys))), (d) => {
            d.insertedDocument = false;
            return d;
          });
          values = _.map(_.concat(newDocuments, sharedDocuments, oldDocuments), (i) => {
            return {
              inserted: i.insertedDocument,
              value: i.ATTRIBUTES[contentName.toUpperCase()]
            };
          });
        } else {
          values = _.map(this.document.ATTRIBUTES[nestedGrid.name], (i) => {
            return {
              inserted: false,
              value: i.ATTRIBUTES[contentName.toUpperCase()]
            };
          });
        }

        if (values.length < this.ceilings[nestedGrid.name]) {
          values = _.concat(values, Array(this.ceilings[nestedGrid.name] - values.length).fill({}));
        }

        return values;
      }
    },

    computed: mapGetters(['sourceDocument'])
  };
</script>

<style lang="less" scoped>
  .grid-caption {
    height: 45px;
    line-height: 60px;
    padding-left: 20px;
    font-size: 13px;
    font-weight: bold;
    background-color: #FFF;
    border-bottom: 3px solid #C8D5D5;
  }

  .grid-container {
<<<<<<< HEAD
    display: flex;   
=======
    display: flex;
>>>>>>> CICD/CI_CD
    max-height: 300px;
    overflow-x: auto;
    overflow-y: auto;
    -ms-overflow-style: -ms-autohiding-scrollbar;
    }

  .grid-column {
    flex: auto;
    border-right: 1px solid #C8D5D5;

    &:last-child {
      border-right: none;
    }

    &-name, &-value {
      height: 50px;
      line-height: 40px;
      border-bottom: 1px solid #C8D5D5;
      padding: 0 20px;
      white-space: nowrap;
    }

    &-name {
      font-weight: bolder;
    }

    &-value {
      height: 50px;
      line-height: 40px;
      overflow-y: hidden;

      &:nth-of-type(even) {
        background-color: #FFF;
      }
    }
  }
</style>
