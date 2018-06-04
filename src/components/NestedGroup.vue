<template>
	<div>
		<div class="title">{{ title }}</div>
		<div class="group-content">
			<slot></slot>
			<i v-if="(cardActions.edit && editForm.allowModifyExisting) && showEdit" class="ba-icon ba-dots-vertical" @click="openOptionsMenu"></i>
<<<<<<< HEAD
			<div v-if="(cardActions.edit && editForm.allowModifyExisting)  && showEdit" ref="optionsMenu" class="options-menu" tabindex="-1" @blur="closeOptionsMenu" v-show="showOptionMenu">
=======
			<div ref="optionsMenu" class="options-menu" tabindex="-1" @blur="closeOptionsMenu" v-show="showOptionMenu">
>>>>>>> CICD/CI_CD
				<ul>
					<li v-if="editForm.allowModifyExisting && cardActions.edit" @click="openEditModal">
						<i class="ba-icon">
							<svg style="width:15px;height:15px" viewBox="0 0 24 24">
								<path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
							</svg>
						</i>
						<span>{{ 'EDIT' | translate }}</span>
					</li>
					<li v-if="editForm.allowDeleteExisting && cardActions.delete" @click="openRemoveModal">
						<i class="ba-icon ba-delete"></i>
						<span>{{ 'REMOVE' | translate }}</span>
					</li>
				</ul>
			</div>
		</div>
		<ba-modal v-if="(cardActions.edit && editForm.allowDeleteExisting)  && showEdit" class="edit-form" ref="editModal" @cancel="resetStagedChanges" @ok="mergeStagedChanges" footer :language="language">
			<span slot="header">{{ 'EDIT' | translate }}</span>
			<div class="modal-min-height">
				<edit-section :is-nested="true" :document-id="items[0].DOCUMENTID" :partitions="f.partitions" :content="f.content" :document-type="name" v-for="f in editForm.content" />
			</div>
		</ba-modal>
    <ba-modal ref="removeModal"
              @cancel="resetStagedChanges"
              @ok="removeItem(name, items.DOCUMENTID)"
              :header="false"
              footer
              :language="language">
      <div class="modal-remove-confirm">
        {{ 'REMOVE_CARD_VIEW_CONF_PREFIX' | translate }} {{ name }} {{ 'REMOVE_CARD_VIEW_CONF_SUFFIX' | translate }}
      </div>
    </ba-modal>		
	</div>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions } from 'vuex';
import contentPartition from './mixins/contentPartition';
import card from './mixins/card';
import contentLabel from './mixins/contentLabel';
import EditSection from './EditSection';

export default {
	mixins: [contentPartition, contentLabel, card],
	props: ['title', 'items', 'form', 'name', 'content'],

	components: {
		EditSection
	},

	data() {
		return {
			showOptionMenu: false
		};
	},

<<<<<<< HEAD
	computed: {
=======
 	computed: {
>>>>>>> CICD/CI_CD

		showEdit() {
			return (this.content && this.content[0] && this.content[0].type == 'switch') ? false : true;
		},

		...mapGetters([
			'documentJson',
			'edit'
		])
	},

	methods: {
<<<<<<< HEAD
=======
		openRemoveModal() {
			this.$refs.removeModal.open();
		},

>>>>>>> CICD/CI_CD
		openEditModal() {
			this.$refs.editModal.open();
		},

		openOptionsMenu() {
			this.showOptionMenu = true;
			this.$nextTick(() => {
				this.$refs.optionsMenu.focus();
			});
		},

		closeOptionsMenu() {
			this.showOptionMenu = false;
		},

		...mapActions([
			'resetStagedChanges',
			'mergeStagedChanges'
		])
	}
}
</script>

<style lang="less" scoped>
.title {
	flex: 1;
	font-weight: bold;
}

.group-content {
	flex: 2;
	display: flex;
	position: relative;

	& > i {
		cursor: pointer;
	}

	.options-menu {
		position: absolute;
		right: 0;
		top: 0;
		background: #FFFFFF;
		border: 1px solid #BACBCB;
		cursor: pointer;
		z-index: 9;

		ul {
			list-style: none;
			margin-bottom: 0;

			li {
				margin-bottom: 0;
				padding: 4px 16px 4px 4px;

				i {
					color: #E5E9E9;
					margin-right: 5px;

					svg {
						fill: #E5E9E9;
					}
				}

				&:hover {
					background: #F4F6F8;
				}
			}
		}
	}
}

.modal-min-height {
	min-height: 200px;
}
</style>