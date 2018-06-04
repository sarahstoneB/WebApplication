<template>
  <div class="expansion-panel" id="expansion-panel">
    <ba-button class="toggle-all-btn" @click="toggleAll()" type="button" name="button">{{allOpen ? 'COLLAPSE_ALL' : 'EXPAND_ALL' | translate }}</ba-button>
    <div>
      <slot></slot>
    </div>
  </div>
</template>
<script>
import ExpandableContent from './ExpandableContent'

export default {
  name: "expansion-panel",

  provide() {
    return {
      itemClicked: this.itemClicked
    };
  },

  data() {
    return {
      allOpen: false
    };
  },

  methods: {
    getChildren() {
      return this.$children.filter(c => {
        if (!c.$options) {
          return;
        }
        return c.$options._componentTag === 'expandable-content';
      })
    },

    toggleAll(open) {
      if (open == undefined) {
        this.allOpen = !this.allOpen;
      } else {
        this.allOpen = open;
      }
      this.getChildren().forEach(e => {
        e.toggle(this.allOpen);
      })
    },

    itemClicked() {
      this.toggleAll(false);
    }
  }
}
</script>

<style lang="less" scoped>
.expansion-panel {
  display: flex; flex-direction: column;
  padding: 0;

  .toggle-all-btn {
    height: 14px; line-height: 14px;
    margin-left: auto; margin-right: 2px; padding: 0; text-align: right;
    background: none; border: 0;
    text-transform: capitalize;
    color: #24272B; font-size: 12px;
  }
}
</style>
