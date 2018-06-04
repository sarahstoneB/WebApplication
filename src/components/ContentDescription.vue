<template>
  <div :class="['flexed', 'font']" v-ba-tooltip="toolTip + ': ' + value">
    <span>
      <span v-if="value.toLowerCase() === 'valid' || value.toLowerCase() === 'active'">
        <svg style="width:20px;height:20px" viewBox="0 0 24 24">
          <path fill="#13CE66" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" />
        </svg>
      </span>
      <span v-else-if="value.toLowerCase() === 'false' || value.toLowerCase() === 'inactive' || value.toLowerCase() === 'deleted'">
        <svg style="width:20px;height:20px" viewBox="0 0 24 24">
          <path fill="#BBCBCB" d="M17,13H7V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        </svg>
      </span>
      <span v-else-if="value.toLowerCase() === 'organization'">
        <svg style="width:20px;height:20px" viewBox="0 0 24 24">
          <path :fill="isPartyCard ? '#EEEEEE' : '#000000'" d="M18,15H16V17H18M18,11H16V13H18M20,19H12V17H14V15H12V13H14V11H12V9H20M10,7H8V5H10M10,11H8V9H10M10,15H8V13H10M10,19H8V17H10M6,7H4V5H6M6,11H4V9H6M6,15H4V13H6M6,19H4V17H6M12,7V3H2V21H22V7H12Z" />
        </svg>
      </span>
      <span v-else-if="value.toLowerCase() === 'individual' || value.toLowerCase() === 'person'">
        <svg style="width:20px;height:20px" viewBox="0 0 24 24">
          <path :fill="isPartyCard ? '#EEEEEE' : '#000000'" d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" />
        </svg>
      </span>
      <span :class="{'font-white' : isPartyCard}" v-else>
        {{ truncatedValue }}
      </span>
    </span>
  </div>
</template>

<script>
  import contentValue from './mixins/contentValue';
  import _ from 'lodash';

  export default {
    mixins: [contentValue],

    props: ['name', 'item', 'toolTip', 'isPartyCard', 'template'],

    computed: {
      value() {
        return this.template ? this.template : this.getValue(this.item, this.name);
      },

      truncatedValue() {
        return this.value ? _.truncate(this.value, {'length': 40}) : ''; 
      }
    }
  }
</script>

<style lang="less" scoped>
.flexed {
  float: left;
  margin-right: 10px;
}

.font {
  font-size: 14px;
  color: #565656;
  font-weight: 600;
  .font-white {
    color: #FFFFFF;
  }
}
</style>
