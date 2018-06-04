<template>
  <div>
    <ba-toolbar :showSideNavIcons="true" @open="minimizeTable" @close="maximizeTable" :side-nav-start-open="sideNavOpen" :links="links" sticky>
      <span id="myAccount" slot="page-name">{{ 'MY_ACCOUNT' | translate }}</span>
      <div class="spacer"></div>
      <div class="option" id="back" v-ba-tooltip="$t('BACK_TO')" @click="redirect">
          <i class="ba-icon">
            <svg style="padding:5px 5px; width:24px; height:24px; max-width: 2em; margin: 9px;" viewBox="0 0 24 24">
              <path fill="#FFFFFF" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
            </svg>
          </i>
      </div>
    </ba-toolbar>
    <div :class="['partitions', { maximized }]">
      <div class="header">
        <span class="header-text">Username and Password</span>
      </div>
      <div class="body">
        <ba-content class="wrapper">
          <div class="content-body">
            <ba-input id="userName" class="input" :name="$t('USERNAME')" v-model="userName" disabled>
              <slot name="disabled"></slot>
            </ba-input>
            <change-credentials ref="credentials" @enter="saveCredentials" :passwordRules="passwordRules" @saveEnabled="enableChangePassword" @saveDisabled="disableChangePassword"></change-credentials>
          </div>
          <div class="content-footer">
<<<<<<< HEAD
<<<<<<< HEAD
            <ba-loader-button @click="saveCredentials" :done="done" :class="['loader-button', { 'block-access' : !validPassword }]">{{ 'SAVE' | translate }}</ba-loader-button>
            <ba-button class="button cancel" @click="redirect">{{ 'CANCEL' | translate }}</ba-button>
=======
            <ba-loader-button id="save" @click="saveCredentials" :done="done" :class="['loader-button', { 'block-access' : !validPassword }]">{{ 'SAVE' | translate }}</ba-loader-button>
            <ba-button id="cancel" class="button cancel" @click="redirect">{{ 'CANCEL' | translate }}</ba-button>
>>>>>>> DSUI/master_vue
=======
            <ba-loader-button id="save" @click="saveCredentials" :done="done" :class="['loader-button', { 'block-access' : !validPassword }]">{{ 'SAVE' | translate }}</ba-loader-button>
            <ba-button id="cancel" class="button cancel" @click="redirect">{{ 'CANCEL' | translate }}</ba-button>
>>>>>>> CICD/CI_CD
          </div>
        </ba-content>
      </div>
    </div>

    <!-- Toast Messages -->
    <ba-toast ref="successToast" position="top" @close="redirect">
      <i class="ba-icon ba-check" slot="icon"></i>
      <div slot="body">{{ successMessage }}</div>
    </ba-toast>

    <ba-toast ref="errorToast" position="top">
      <i class="ba-icon ba-alert-circle" slot="icon"></i>
      <div slot="body">{{ errorMessage }}</div>
    </ba-toast>
  </div>
</template>

<script>
import Vue from 'vue';
import sideNav from './mixins/sideNav';
import loader from './mixins/loader'
<<<<<<< HEAD
<<<<<<< HEAD
import {mapGetters} from 'vuex';
=======
import { mapGetters } from 'vuex';
>>>>>>> DSUI/master_vue
=======
import { mapGetters } from 'vuex';
>>>>>>> CICD/CI_CD

import ChangeCredentials from './ChangeCredentials';
import AccountService from '../services/account.js';

export default {
  mixins: [sideNav, loader],

  components: {
    ChangeCredentials
  },

  data() {
    return {
      user: JSON.parse(atob(this.$cookie.get('user'))),
      errorMessage: '',
      successMessage: '',
      passwordRules: '',
      validPassword: false
    };
  },

  mounted() {
    this.getPasswordRules();
  },

  computed: {
    userName() {
      return this.user ? this.user.name : '';
    },

    ...mapGetters([
      'links'
    ])
  },

  methods: {
    saveCredentials() {
      this.isLoadComplete = false;
      let payload = this.$refs.credentials.getCredentialAsPayload();
      AccountService.changePassword(payload).then(
        (response) => {
          this.isLoadComplete = true;
          this.successMessage = response.body.message;
          this.$refs.successToast.toggle();
        },
        (error) => {
          this.isLoadComplete = true;
          this.errorMessage = error.body.message;
          this.$refs.errorToast.toggle();
        }
      );
    },

    enableChangePassword() {
      this.validPassword = true;
    },

    disableChangePassword() {
      this.validPassword = false;
    },

    getPasswordRules() {
      const payload = {
        locale: this.$root.locale.toUpperCase()
      }
      AccountService.getPasswordRules(payload).then(
        (response) => {
          this.passwordRules = response.body.rules.join(' ');
        },
        (error) => {
          console.log(error);
        }
      )
    },

    redirect() {
      this.$router.push('/dataview');
    }
  }
};
</script>

<style lang="less" scoped>

.partitions {
  margin-left: 250px;
  transition: all .25s;
  width: auto;
  height: ~"calc(100vh - 110px)";
  overflow-y: auto;
  background-color: #F5F6F8;
  &.maximized {
    margin-left: 40px;
  }
}

.content-body {
  padding: 50px 100px 50px 100px;
}

.wrapper {
  padding: 0;
  margin: 15px;
  border: 2px solid #DEE0DF;
  background-color: #FFF;
}

.header {
  padding: 10px 15px;
  font-weight: 700;
  letter-spacing: .5px;
  background-color: #FFF;
  display: none;
}

.body {
  margin-top: 15px;
}

.content-footer {
  border-top: 1px solid #DEE0DF;
  padding: 25px;
  overflow: auto;
}

.input {
  margin-bottom: 30px;
  font-size: 20px;
  letter-spacing: .5px;
}

.disabled {
  border-bottom: 2px dotted #BACBCB;
}

.sub-text {
  font-size: 12px;
  color: #868B8B;
}

.button {
  width: 120px;
  color: #FFF;
  margin: 5px 10px 0 0;
  border: 0px;
  float: right;
  font-weight: 100;
  line-height: 0px;
  &.save {
    background-color: #3598DB;
  }
  &.cancel {
    background-color: #FFF;
    color: #000;
  }
}

.options {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  min-width: 100px !important;
}

<<<<<<< HEAD
<<<<<<< HEAD
.block-access{
=======
.block-access {
>>>>>>> DSUI/master_vue
=======
.block-access {
>>>>>>> CICD/CI_CD
    opacity: .38;
    pointer-events: none;
}

<<<<<<< HEAD
<<<<<<< HEAD
.loader-button{
=======
.loader-button {
>>>>>>> DSUI/master_vue
=======
.loader-button {
>>>>>>> CICD/CI_CD
    height: 3em;
    padding-top: 18px;
    margin-top: 8px;
}

.option {
  color: #FFFFFF;
  cursor: pointer;
  margin-right: 10px;
  svg {
    &:hover {
      width: 30px;
      height: 30px;
      margin-bottom: 10px;
      background-color: #5298C5;
      border-radius: 250px;
    }
  }
}

</style>
