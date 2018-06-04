<template>
  <table class="text-attr-table">
    <tbody class="text-attr-table-body">
      <tr v-for="(value, key) in attrs">
        <td class="text-bold">  {{ key }} </td>
        <td class="right-align">  {{ value }} </td>
      </tr>
    </tbody>
  </table>
</template>

<script>

export default {
  data() {
    return {
      attrs: {}
    };
  },

  methods: {
    populate(data) {
      this.attrs = data;
    }
  }
}
</script>

<style lang="less" scoped>
  .right-align {
		text-align: right;
		margin-right: 5px;
	}

	.text-bold {
		font-weight: bold;
	}

  .text-attr-table {
    border: 2px solid #DEE0DF;
  }

  .text-attr-table-body {
    tr {
      border: none;
      td {
        padding: 5px;
      }
    }
  }
</style>
