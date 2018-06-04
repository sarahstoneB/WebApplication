<template>
  <div :class="['cell', 'attribute-row-value', { match, different, overwritten }]">
    <i class="ba-icon" v-if="(different || overwritten) && !readOnly" @click="overwriteOrRevert()" :tooltip="toolTipText">
      <svg viewBox="0 0 24 24" @click.stop="overwriteOrRevert()">
        <path fill="#000000" d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z" v-if="overwritten"/>
        <path fill="#000000" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" v-else/>
      </svg>
    </i>
    <span v-ba-tooltip="value">{{ value }}</span>
    <div class="inserted" v-if="overwritten">
      <span v-ba-tooltip="sourceDocument.ATTRIBUTES[name]">{{ sourceDocument.ATTRIBUTES[name] }}</span>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import { mapGetters, mapActions } from 'vuex';

  export default {
    props: {
      name: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      },
      matched: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        overwritten: false
      };
    },

    computed: {
      match() {
        return this.value === this.sourceDocument.ATTRIBUTES[this.name] && this.matched || this.overwritten;
      },

      different() {
        return this.value !== this.sourceDocument.ATTRIBUTES[this.name] && !this.overwritten && this.matched;
      },

      readOnly() {
        let read = _.filter(this.mergeForm.form.gridContent, c => c.name === this.name);
        return read[0].readOnly;
      },

      toolTipText() {
        return this.overwritten ? 'Undo' : 'Merge';
      },

      ...mapGetters([
        'sourceDocument',
        'mergeForm'
      ])
    },

    methods: {
      overwriteOrRevert() {
        if (this.overwritten) {
          this.undoSetDocumentAttribute(this.name);
        } else {
          this.setDocumentAttribute(this.name);
        }
        this.overwritten = !this.overwritten;
      },

      ...mapActions([
        'setDocumentAttribute',
        'undoSetDocumentAttribute'
      ])
    }
  };
</script>

<style lang="less" scoped>
  .attribute-row-value {
    border-bottom: 1px solid #C8D5D5;

    .inserted {
      margin-left: 12px;
      display: inline-block;
    }
  }

  .match {
    border-left: 5px solid #31D177;
  }

  .ba-icon {
    &[tooltip]:hover:after {
      content: attr(tooltip);
      background: #2D3745;
      color: #FFFFFF;
      font-size: 10px;
      font-weight: 700;
      font-style: normal;
      padding: 1px 4px;
      position: absolute;
      left: 100%;
      top: 100%;
      line-height: 21px;
      transform: translate(-50%, 2px);
    }
  }
</style>
