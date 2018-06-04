<template>
  <table class="profile-col-table">
    <thead>
      <th class="profile-col-table-header" colspan="2"> {{title}} </th>
    </thead>
    <tbody class="profile-col-table-body">
      <tr v-for="val in attrs">
        <td> {{val[Object.keys(val)[0]]}} </td>
        <td class="right-align">  {{val[Object.keys(val)[1]]}} </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      attrs: {}
    };
  },

  props: {
    title: {
      type: String,
      default: 'Top 100'
    },
    sort: {
      type: String,
      default: 'asc'
    }
  },

  methods: {
    populate(data) {
      let array = _.orderBy(data, [function(obj) {
        return obj[Object.keys(obj)[1]];
      }], this.sort);
      this.attrs = _.filter(array, function(value, index) {
        if (index < 100) { return value; }
      })
    },
  }
}

</script>

<style lang="less" scoped>
.profile-col-table-header {
  padding: 2px;
  background-color: #F5F6F8;
  border: 2px solid #DEE0DF;
}

.profile-col-table-body {
  border: 2px solid #DEE0DF;
  font-size: 10px;
  display: block;
  height: 470px;
  width: 98%;
  overflow: auto;
  tr {
    border: none;
    td {
      padding: 5px;
      &:last-child {
        width:1%;
      }
    }
  }
}
</style>
