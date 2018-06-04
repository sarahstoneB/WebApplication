<template>
	<div>
		<div class="chart-header">
			<span class="chart-name"> {{chartName}} </span>
			<span class="interval">
				<span class="chart-name"> SELECT INTERVAL </span>
				<select class="select-interval" id="selectInterval" v-model="selectedInterval" @change="populateGraph">
					<option class="options" v-for="(value, index) in intervals"> {{value}} </option>
				</select>
			</span>
		</div>
		<div id="chart"></div>
	</div>
</template>

<script>
import c3 from 'c3'
import _  from 'lodash'

export default {
	props: {
		chartName: {
			type: String,
			default: 'Histogram'
		}
	},

	data() {
		return {
			histogramData: [],
			selectedInterval: 5,
			intervals: [5, 10, 15]
		};
	},

	methods: {
		populateGraph() {
			this.$emit('intervalSelected', this.selectedInterval);
			this.populate(this.histogramData);
		},

		init(histogramData) {
			this.histogramData = histogramData;
			this.populate(histogramData);
		},

		populate(histogramData) {
			let labelText;
			let xAxisName = Object.keys(histogramData[0])[0];
			let yAxisName = Object.keys(histogramData[0])[1];
			let maxValue = Math.max(...histogramData.map(o => _.get(o, xAxisName)));
			let minValue = Math.min(...histogramData.map(o => _.get(o, xAxisName)));

			function getLabelText() {
				if (maxValue > 100000) {
					return 'IN HUNDRED THOUSANDS';
				} else if (maxValue > 10000) {
					return 'IN TEN THOUSANDS';
				} else if (maxValue >= 1000) {
					return 'IN THOUSANDS';
				} else if (maxValue > 100 && maxValue < 1000) {
					return 'IN HUNDREDS';
				}
			}

			function xAxisValue() {
				var xAxisValueArr = histogramData.map(function (object) {
					return _.get(object, xAxisName);
				});
				return xAxisValueArr;
			}

			function yAxisValue() {
				let yAxisValueArr = histogramData.map(function (object) {
					return _.get(object, yAxisName);
				});
				return yAxisValueArr;
			}

			let chart = c3.generate({
				bindto: '#chart',
				size: {
					height: 250,
					width: 400
				},

				tooltip: {
					format: {
						title: function (value) {
							return value;
						}
					}
				},

				data: {
					x: 'x',
					columns: [
						['x'].concat(xAxisValue()),
						[yAxisName].concat(yAxisValue()),
					],
					type: 'bar',
				},

				axis: {
					x: {
						tick: {
							values: xAxisValue(),
							format: function (x) {
								if (maxValue > 100000) {
									return _.ceil(x/10000, 1)
								} else if (maxValue > 10000) {
									return _.ceil(x/10000, 1)
								} else if (maxValue >= 1000) {
									return _.ceil(x/1000, 1)
								} else if (maxValue > 100 && maxValue < 1000) {
									return _.ceil(x/100, 1)
								}
								return x
 							}
						},
						label: {
							text: getLabelText(),
							position: 'center'
						}
					},
					y: {
						label: {
							text: 'FREQUENCY',
							position: 'outer-middle'
						}
					}
				},
				legend: {
					show: false
				}
			});
		}
	}
}
</script>

<style lang="less" scoped>
svg, path.domain {
	width: 95%;
}

.chart-header {
	background-color: #F6F6F8;
	border-bottom: 2px solid #DEE0DF;
}

.chart-name {
	font-size: 12px;
	font-weight: bold;
	padding-left: 10px;
}

.chart-value {
	font-size: 12px;
	font-weight: bold;
	padding-right: 100px;
}

.interval {
	float: right;
	cursor: hand;
}

.select-interval {
	height: 20px;
	padding: 0px;
	background-color: inherit;
	margin-bottom: 0rem;
	border: none;
}

.options, .select-interval {
	cursor: pointer;
}
</style>
