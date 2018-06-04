<template>
  <div>
    <ba-idle timeout="600" @timedout="redirect" ref="timeoutModal" >
      <div slot="buttons">
        <ba-button class="ba-default flat" @click="redirect"> Log Out </ba-button>
        <ba-button class="ba-primary" @click="closeModal"> Continue </ba-button>
      </div>
      <ba-nav class="nav-bar" ref="navBar" :show-apps="false" :signOutLink="'/logout'" :myAccountLink="'/#/myaccount'" :logo="'something'" :name="name" sidebarToggle>
        <span id="signOut" slot="sign-out" @click="clearSessionStorage">{{ 'SIGN_OUT' | translate }}</span>
        <span slot="my-account" @click="goToMyAccount">{{ 'MY_ACCOUNT' | translate }}</span>
        <img :src="logo" slot="brand" alt="Alloy Application">
      </ba-nav>
      <div>
        <router-view></router-view>
      </div>
    </ba-idle>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import Store from './vuex';

  export default {
    store: Store,

    data() {
      return {
        logo: this.$root.appCustomer.logo,
        user: JSON.parse(atob(this.$cookie.get('user')))
      };
    },

    computed: {
      features() {
        return this.$root.features ? this.$root.features : {}
      },

      username() {
        return this.user.name;
      },

      name() {
        return `${this.user.first} ${this.user.last}`;
      }
    },

    created() {
      if (this.features) {
        this.filterLinks(this.features);
      }
    },

    methods: {
      clearSessionStorage() {
        window.sessionStorage.clear();
      },

      goToMyAccount() {
        this.$router.push('/myAccount');
      },

      redirect() {
        this.$http.get('/logout').then((response) => {
          this.clearSessionStorage();
          location.reload();
        });
      },

      closeModal() {
        this.$refs.timeoutModal.resetCountdown();
        this.$refs.timeoutModal.close();
      },

      ...mapActions([
        'filterLinks',
      ])
    }
  };
</script>

<style lang="less">

.dropdown-content {
  z-index: 100 !important;
}
html {
  min-width : 700px;
  overflow-x: hidden;
}
.partitions .pagination-container, .match-merge-table .pagination-container, .error-remediation-table .pagination-container {
  min-height : 9%;
}
</style>
