<template>
  <span>{{ displayValue }}</span>
</template>

<script>
  import _ from 'lodash';

  export default {
    props: ['record'],

    computed: {
      displayValue() {
        return this.record.length > 80 ? `${this.record.substr(0, 80)}...` : this.record;
      }
    }
  };
</script>

<style lang="less" scoped></style>