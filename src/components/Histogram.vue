<template>
	<div class="chart-main">
		<div class="chart-header">
			<span class="chart-name"> {{chartName}} </span>
			<span class="chart-header-value"> Top 15 </span>
		</div>
		<div id="chart"></div>
	</div>
</template>

<script>
import c3 from 'c3'
import _ from 'lodash'

export default {
	props: {
		chartName: {
			type: String,
			default: 'Histogram'
		}
	},

	data() {
		return {
			histogramData: []
		};
	},

	methods: {
		populate(histogramData, isRotated) {
			let xAxisName = Object.keys(histogramData[0])[0];
			let yAxisName = Object.keys(histogramData[0])[1];
			let maxValue = Math.max(...histogramData.map(o => _.get(o, yAxisName)));

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

			let xAxisValueArr = histogramData.map(function (object) {
				return _.get(object, xAxisName);
			});

			function topValues() {
				let topValues = xAxisValueArr.slice(0, 15);
				return topValues;
			}

			function xAxisValues() {
				let xAxisValueArr = topValues().map(function (object) {
					return _.truncate(object, {'length': 14});
				});
				return xAxisValueArr;
			}

			function yAxisValues() {
				let yAxisValueArr = histogramData.map(function (object) {
					let count = _.get(object, yAxisName);
					if (maxValue > 100000) {
						return _.ceil(count/100000, 2);
					} else if (maxValue > 10000) {
						return _.ceil(count/10000, 2);
					} else if (maxValue >= 1000) {
						return _.ceil(count/1000, 2);
					} else if (maxValue > 100 && maxValue < 1000) {
						return _.ceil(count/100, 2);
					}
					return count;
				});
				return yAxisValueArr;
			}

			var chart = c3.generate({
				bindto: '#chart',

				size: {
					height: 250,
					width: 400
				},

				data: {
					x: 'x',
					columns: [
						['x'].concat(xAxisValues()),
						[yAxisName].concat(yAxisValues()),
					],
					type: 'bar',
				},

				tooltip: {
					format: {
						title: function (index) {
							return topValues()[index];
						}
					}
				},

				axis: {
					x: {
						type: 'category',
					},
					y: {
						label: {
							text:  getLabelText(),
							position: 'center'
						},
					},
					rotated: isRotated,
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

.chart-header-value {
	padding-left: 50px;
	position: fixed;
}

.chart-name, .chart-header-value {
	font-size: 12px;
	font-weight: bold;
}
</style>
