<template>
  <ba-data-table :tableData="recordData" :paginationChoices="paginationChoices"></ba-data-table>
</template>

<script>
  export default {
    props: ['record'],

    computed: {
      recordData () {
        let recordData = []
        if (this.record) {
          Object.keys(this.record).forEach((key) => {
            recordData.push({
              field: key,
              value: this.record[key]
            })
          })
        }
        return recordData
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
