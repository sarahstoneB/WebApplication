<template>
  <div class="chart-wrapper">
    <div class="title">
      {{ title }}
    </div>
    <div class="donut-chart" id="donut-chart">
      <vue-c3 :handler="handler" class="donut"></vue-c3>
      <div class="count">
        <span v-if="chartLoaded" > {{ pendingAmount }} </span>
        <span v-else> 0 </span>
      </div>
    </div>
    <div class="legend">
      {{ legend }}
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import Vue from 'vue';
import VueC3 from 'vue-c3';

const todayColorTheme = {
  todo: '#C6E1F5',
  closed: '#3B99D8'
};

const yesterdayColorTheme = {
  todo: "#27CC6B",
  closed: "#BBEFD3"
};

export default {
  name: 'DonutChart',

  components: {
    VueC3
  },

  data () {
    return {
      handler: new Vue(),
      chartLoaded : false,
    }
  },

  props: {
    title: {
      type: String,
      required: true,
      default: ''
    },
    legend: {
      type: String,
      required: true,
      default: ''
    },
    closedAmount:{
      type: [ String, Number],
      required: false,
      default: ''
    },
    pendingAmount:{
      type: [ String, Number],
      required: false,
      default: ''
    }
  },

  methods: {
    getColorTheme(chartTitle) {
      if (~chartTitle.indexOf('TODAY')) {
        return todayColorTheme;
      } else if (~chartTitle.indexOf('YESTERDAY')) {
        return yesterdayColorTheme;
      }
    }
  },

  watch: {
    closedAmount: function(newVal, oldVal) {
      var vm =  this;
      this.handler.$emit('dispatch', (chart) => chart.load({
        columns: [
          ["closed", newVal],
          ["todo", this.pendingAmount]
        ],
        done: function() {
          if(vm.pendingAmount){
            vm.chartLoaded = true;
          }
         }
        })
      );
    },

    pendingAmount: function(newVal, oldVal) {
      var vm =  this;
      this.handler.$emit('dispatch', (chart) => chart.load({
        columns: [
          ["closed", this.closedAmount],
          ["todo", newVal]
        ],
        done: function() {
           if(vm.closedAmount){
             vm.chartLoaded = true;
           }
         }
        })
      );
    }
  },

  mounted () {
    const options = {
      data: {
          type: 'donut',
          columns: [
              ["closed", this.closedAmount],
              ["todo", this.pendingAmount]
         ],
          colors: this.getColorTheme(this.title),
      },
      donut: {
        label: {
          show: false
        },
        width: 10
      },
      legend: {
        show: false
      },
      tooltip: {
        show: false
      }
    }
    this.handler.$emit('init', options);
    this.handler.$emit('dispatch', (chart) => chart.resize({
        height: document.getElementById('donut-chart').offsetHeight - 20
      })
    );
  }
}
</script>

<style lang="less">
.c3-chart-arcs-title {
  fill: black;
  font-size: 20px;
  font-weight: bold;
}

.chart-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 46%;

  &:last-child {
    float: right;
  }

  .title {
    font-size: 12px;
    font-weight: bolder;
    margin-bottom: 5px;
    color: #354A5C;
  }

  .donut-chart {
    background-color: #fff;
    border-top: 1px solid #E5E9E9;
    border-right: 1px solid #E5E9E9;
    border-left: 1px solid #E5E9E9;
    display: flex;
    flex: 1 auto;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding-top: 10px;
    position: relative;

    .donut {
      height: 100%;
    }

    .count {
      font-size: 18px;
      font-weight: bold;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .legend {
    font-size: 12px;
    font-weight: bolder;
    padding-bottom: 10px;
    background-color: #fff;
    border-bottom: 1px solid #E5E9E9;
    border-right: 1px solid #E5E9E9;
    border-left: 1px solid #E5E9E9;
    text-align: center;
    width: 100%;
  }

}
</style>
