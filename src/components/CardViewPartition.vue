<template>
  <div>
    <card-view-card :card="card" v-for="card in partition.cards" />
  </div>
</template>

<script>
  import CardViewCard from './CardViewCard'

  export default {
    props: ['partition'],

    components: {
      CardViewCard
    }
  }
</script>

<style lang="less" scoped></style>
