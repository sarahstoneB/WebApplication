<template>
  <div :class="['expandable-content', {open: isOpen}]">
    <div @click="onClicked" class="expandable-header">{{ title }}
      <i :class="['ba-icon', {'ba-chevron-down': !isOpen, 'ba-chevron-up': isOpen}]"></i>
      <span>{{ isOpen? $t('COLLAPSE') : $t('EXPAND') }}</span>
    </div>
    <transition v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:leave="leave" :css="false" name="expand">
      <div class="content-container" v-show="isOpen">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: "expandable-content",
  inject: ['itemClicked'],

  props: {
    title: {
      type: String,
      default: ''
    },
    openByDefault: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isOpen: false
    };
  },

  mounted() {
    this.isOpen = this.openByDefault;
  },

  methods: {
    onClicked() {
      const open = this.isOpen;
      this.itemClicked();
      this.toggle(!open);
    },

    toggle(open) {
      const opened = this.isOpen;
      if (open == undefined) {
        this.isOpen = !opened;
      } else {
        this.isOpen = open;
      }
    },

    beforeEnter: function (el) {
      el.style.height = 'auto';
    },

    enter: function (el, done) {
      this.once(el, 'transitionend', done);
      let h = el.offsetHeight;
      el.style.height = 0;
      setTimeout(() => {
        el.style.height = h + 'px';
      }, 10)
    },

    leave: function (el, done) {
      this.once(el, 'transitionend', done);
      el.style.height = 0;
    },

    once(el, name, done) {
      const callback = () => {
        el.removeEventListener(name, callback);
        done();
      }
      el.addEventListener('transitionend', callback);
    }
  }
}
</script>

<style lang="less" scoped>
.expandable-content {
  margin-top: -1px;
  border: solid 1px #BACBCB;

  overflow: hidden;
  transition: margin .4s;

  .expandable-header {
    background-color: #FFFFFF;
    font-weight: bold;
    padding: 15px 23px;
    cursor: pointer;

    &:not(:first-child) {
      border-top: solid 1px #BACBCB;
    }

    span,
    i {
      letter-spacing: 1px;
      float: right;
      padding: 0 5px 0 0;
    }
  }

  > .content-container {
    transition: height .4s cubic-bezier(0.23, 1, 0.32, 1);
  }

  &.open {
    margin: 20px 0;
  }
}
</style>
