	<template>
	<div>
		<ba-modal ref="profilecol" size="large">
			<span slot="header">
				<span>{{ 'PROFILE_COLUMN' | translate }} ' {{ profileColName }} '</span>
				<ba-button class="ba-primary modal-button" @click="exportToCSV">{{ 'EXPORT_ALL_VALUES' | translate }}</ba-button>
			</span>

			<span slot="body">
				<div class="profile-col-main">
					<div class="col1">
						<div class="col1-inner">
							<numeric-attrs ref="attrs"></numeric-attrs>
						</div>

						<div class="col1-inner">
							<div class="text-attr-table">
								<numeric-histogram v-if="hasStatistics" @intervalSelected="setSelectedinterval" ref="numerichistogram" :chartName="profileColName"></numeric-histogram>
								<histogram v-if="!hasStatistics" ref="histogram" :chartName="profileColName"></histogram>
							</div>
						</div>
					</div>

					<div class="col2">
						<div  class="col2-inner">
							<attrs-order-list ref="attrslisttop" sort="desc"></attrs-order-list>
						</div>
						<div class="col2-inner">
							<attrs-order-list ref="attrslistbottom" title="Bottom 100" sort="asc"></attrs-order-list>
						</div>
					</div>
				</div>
			</span>
		</ba-modal>

		<ba-toast ref="errorToast" position="top">
			<i class="ba-icon ba-alert-circle" slot="icon"></i>
			<div slot="body"> {{generalErrors}}</div>
		</ba-toast>
	</div>
</template>

<script>
import RepositoryService from '../services/repositories'
import _ from 'lodash'
import VueResource from 'vue-resource'

import Histogram from './Histogram'
import NumericAttrs from './NumericAttrs'
import AttrsOrderList from './AttrsOrderList'
import NumericHistogram from './NumericHistogram'

export default {

	components: {
		Histogram,
		NumericAttrs,
		AttrsOrderList,
		NumericHistogram
	},

	props: {
		selectedColumnName: {
			type: String,
			default: ''
		}
	},

	data() {
		return {
			activeRepo: null,
			interval: 5,
			bucketSize: 5,
			generalErrors: null,
			profileColName: null,
			attrs: {},
			histogramData: [],
			hasStatistics: false,
			errors: {
				noDataErr: this.$t('NO_DATA_TO_PROFILE'),
				uniqueErr: this.$t('ALL_RECORDS_UNIQUE')
			},
			payload: {
				"class" : "com.liaison.mdm.dto.search.RepositoryDocumentMatchCriteria"
			},
		};
	},

	methods: {
		init(repoId, columnName, isNumeric) {
			this.profileColName = columnName;
			this.isNumeric = isNumeric;
			this.activeRepo = repoId;
			if (this.isNumeric) {
				this.getStatistics(repoId, columnName);
			}	else {
				this.hasStatistics = false;
				this.getFrequency(repoId, columnName);
			}
		},

		populateModal() {
			this.$refs.attrslisttop.populate(this.histogramData);
			this.$refs.attrslistbottom.populate(this.histogramData);
			this.$refs.attrs.populate(this.attrs);
		},

		isUniqueColumn() {
			return (this.attrs.approximateDistinctValueCount === this.attrs.totalCount) ? true : false;
		},

		setSelectedinterval(interval) {
			this.interval = interval;
			this.getHistogram(this.activeRepo, this.profileColName, this.attrs);
		},

		getFrequency(repoId, name) {
			let queryParams = {
				repoId: repoId,
				attributeName: name,
				outliers: false,
				size: 500
			};
			RepositoryService.getFrequency(queryParams, this.payload).then(
				(data) => {
					this.histogramData = this.filterHistogram(data.body);
					this.attrs = this.filterAttrs(data.body);
					if (!this.isUniqueColumn() && this.histogramData) {
						this.$refs.histogram.populate(this.histogramData, true);
						this.populateModal();
						this.openModal();
					} else if (this.isUniqueColumn()) {
						this.generalErrors = this.errors.uniqueErr;
						this.$refs.errorToast.toggle();
					} else {
						this.generalErrors = this.errors.noDataErr;
						this.$refs.errorToast.toggle();
					}
				}, (error) => {
					console.log(error)
				}
			)
		},

		getHistogram(repoId, name, attributes) {
			let bucketSize = Math.ceil((attributes.max - attributes.min) / this.interval);
			if (bucketSize !== 0) {
				let queryParams = {
					repoId: repoId,
					interval: bucketSize,
					attributeName: name,
					minDocCount: 1
				};
				RepositoryService.getHistogram(queryParams, this.payload).then(
					(data) => {
						this.histogramData = this.filterHistogram(data.body);
						this.$refs.numerichistogram.init(this.histogramData);
						this.populateModal(this.histogramData);
						this.openModal();
					}, (error) => {
						console.log(error)
					}
				)
			} else {
				this.generalErrors = this.errors.noDataErr;
				this.$refs.errorToast.toggle();
			}
		},

		getStatistics(repoId, name) {
			let queryParams = {
				repoId: repoId,
				attributeName: name,
				detailed: false,
				sigma: 2
			};
			RepositoryService.getStatistics(queryParams, this.payload).then(
				(data) => {
					if (data.status === 200) {
						this.hasStatistics = true;
						this.attrs = data.body;
						this.getHistogram(repoId, name, this.attrs);
					} else if (data.status === 204) {
						this.getFrequency(repoId, name);
					} else {
						this.generalErrors = this.errors.noDataErr;
						this.$refs.errorToast.toggle();
					}
				}, (error) => {
					console.log(error)
				});
		},

		filterHistogram(data) {
			let attrsObject = _.pickBy(data, _.isArray);
			return attrsObject[Object.keys(attrsObject)[0]];
		},

		filterAttrs(data) {
			return _.omitBy(data, _.isArray);
		},

		parseObjectAsCSV(JSONData) {
			let header = '';
			let values = '';
			_.forOwn(JSONData, function(value, key) {
				header += key + ',';
				values += value + ',';
			});
			return header + '\r\n' + values;
		},

		parseArrayOfObjectsAsCSV(JSONData) {
			let header = Object.keys(JSONData[0]);
			let values = '';
			_.forEach(JSONData, function(value, index) {
				values += Object.values(value) + ',\r\n';
			});
			return header + '\r\n' + values;
		},

		exportToCSV() {
			let fileName = this.profileColName + '_' + 'PROFILEDATA.csv';
			this.exportJSONToCSV(this.histogramData, this.attrs, fileName);
		},

		exportJSONToCSV(dataArray, object, fileName) {
			let CSVData = this.parseObjectAsCSV(object);
			CSVData += '\r\n\n' + this.parseArrayOfObjectsAsCSV(dataArray);

			//Based on quick research. The following is to ensure browser compatibility. Must look for an alternative if possible
			var blob = new Blob([CSVData], {type: "text/csv;charset=utf-8;"});

			if (navigator.msSaveBlob) { // For IE 10+
				navigator.msSaveBlob(blob, fileName)
			} else {
				let url = URL.createObjectURL(blob);
				let link = document.createElement("a");
				link.href = url;
				link.style.visibility = "hidden";
				link.download = fileName;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		},

		openModal() {
			this.$refs.profilecol.open();
		}
	}
}
</script>

<style lang="less" scoped>

.profile-col-main {
	margin-top: 0;
	&:after {
	content: "";
	display: block;
	clear: both;
	}
}

.modal-button {
	float: right;
}

.col1 {
	margin-bottom: 10px;
	width: 45%;
	border: 1px solid white;
	float: left;
	max-height: 500px;
}

.col1-inner {
	font-size: 11px;
	display: block;
	width: 100%;
	max-height: 50%;
}

.col2 {
	float: left;
	width: 54%;
}

.col2-inner {
	float: left;
	width: 47%;
	margin-left: 3%;
	max-height: 500px;
	overflow-y: hidden;
	&:after {
		content: "";
		display: block;
		clear: both;
	}
}

.text-attr-table {
	border: 2px solid #DEE0DF;
	margin-bottom: 1rem;
}

.histogram-parent:after {
	display: block;
	content: '';
	clear: both;
}
</style>
