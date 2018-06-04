import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    maximized() {
      return !this.sideNavOpen;
    },

    ...mapGetters(['sideNavOpen'])
  },

  methods: {
    maximizeTable() {
      this.closeSideNav();
    },

    minimizeTable() {
      this.openSideNav();
    },

    ...mapActions([
      'closeSideNav',
      'openSideNav'
    ])
  }
}
