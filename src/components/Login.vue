<template>
  <div class="outer-container">
    <div class="login-wrapper">
      <div class="login-container">
        <div class="logo-container">
          <a id="alloy_logo" href="https://liaison.com" alt="Liaison Technologies">
            <img id="alloy_logo" src="../assets/img/alloy_logo_small.png" alt="Liaison" />
          </a>
          <div class="error-message">{{ errorMessage }}</div>
        </div>
        <!-- <div class="login-title">
          <h6>Log In</h6>
        </div> -->
        <ba-content class="content">
          <div v-if="!isResetPassword" @keyup.enter="keyup">
            <label for="language">{{ 'LANGUAGE' | translate }}:</label>
            <ba-select class="select" v-model="languageSelected" :options="Object.values(languages)" @change="selectLanguage"></ba-select>
            <ba-input id="userName" :class="['input', {'active-password' : isAutoFill}]" v-model="username" @focus="resetValidCredentials" :name="'USERNAME' | translate">{{ 'USERNAME' | translate }}:
              <span v-if="!this.validCredentials" slot="error">{{ 'PLEASE_INPUT_VALID_USERNAME' | translate }}.</span>
            </ba-input>
            <ba-input id="password" :class="['input', { 'password-error': !this.validCredentials }, {'active-password' : isAutoFill}]" v-model="password" type="password" @focus="resetValidCredentials" :name="'PASSWORD' | translate">{{ 'PASSWORD' | translate }}:
              <span v-if="!this.validCredentials" slot="error">{{ 'PLEASE_INPUT_VALID_PASSWORD' | translate }}.</span>
            </ba-input>
          </div>
          <div v-if="isResetPassword">
            <change-credentials ref="credentials" :passwordRules="passwordRules" @enter="login" @saveEnabled="enableChangePassword" @saveDisabled="disableChangePassword"></change-credentials>
          </div>
        </ba-content>
        <div class="forgot-link-container">
          <a class="forgot-link" id="forgotPassword" href="#" @click="openModal('forgotPopup')">{{ 'FORGOT_PASSWORD' | translate }}</a>
        </div>
        <div class="forgot-login">
          <div class="login">
            <ba-loader-button id="save" @click="login" :class="['login-link', {'disabled': !canSavePassword}]" :done="done" v-if="isResetPassword">{{ 'SAVE' | translate }}</ba-loader-button>
            <ba-loader-button id="login" class="login-link" @click="login" :done="done" v-else>{{ 'LOG_IN' | translate }}</ba-loader-button>
          </div>
        </div>
        <div class="footer text-center">
          <div class="version">
            <p v-if="version">
              MDM - Data Steward: v{{ version }}
            </p>
          </div>
        </div>
      </div>
      <div class="terms">
        <p>
          {{ "LIAISON_TECH" | translate }} {{ "US_TECH_SUPPORT" | translate}}
          <b>
            <a href="mailto:support@liaison.com">{{ 'US_TECH_SUPPORT_MAIL' | translate }}</a>
          </b> {{ "EU_TECH_SUPPORT" | translate}}
          <b>
            <a href="mailto:support.europe@liaison.com">{{ 'EU_TECH_SUPPORT_MAIL' | translate }}</a>
          </b>.
        </p>
      </div>
    </div>
    <!-- Popup Modals -->
    <ba-modal ref="expiredPopup" size="sm" footer>
      <span slot="header">
        <span class="popup-header">{{ 'PASSWORD_EXPIRED' | translate }}</span>
      </span>
      <span slot="body">
        <span class="popup-text">{{ 'PASSWORD_RESET' | translate }}</span>
      </span>
      <span slot="buttons">
        <ba-button class="ba-primary" @click="goToPasswordReset">{{ 'OK' | translate }}</ba-button>
      </span>
    </ba-modal>

    <ba-modal ref="forgotPopup" size="sm" footer>
      <span slot="header">
        <span class="popup-header">{{'FORGOT_PASSWORD' | translate }}</span>
      </span>
      <span slot="body">
        <span class="popup-text">{{ 'PASSWORD_RESET_HELP' | translate }}</span>
      </span>
       <span slot="buttons">
        <ba-button class="ba-primary" @click="closeModal('forgotPopup')">{{ 'OK' | translate }}</ba-button>
      </span>
    </ba-modal>

    <ba-modal ref="lockedPopup" size="sm" footer>
      <span slot="header">
        <span class="popup-header">{{ 'PASSWORD_LOCKED' | translate }}</span>
      </span>
      <span slot="body">
        <span class="popup-text">{{ 'PASSWORD_LOCKED' | translate }} &nbsp; {{ 'PASSWORD_RESET_HELP' | translate }}</span>
      </span>
      <span slot="buttons">
        <ba-button class="ba-primary" @click="closeModal('lockedPopup')">{{ 'OK' | translate }}</ba-button>
      </span>
    </ba-modal>

    <ba-modal ref="loginAgainPopup" size="sm" footer>
      <span slot="header">
        <span class="popup-header">{{ 'PASSWORD_CHANGED' | translate }}</span>
      </span>
      <span slot="body">
        <span class="popup-text">{{ 'PASSWORD_SAVED_SUCCESS' | translate }}</span>
      </span>
      <span slot="buttons">
        <ba-button class="ba-primary" @click="goToLogin">{{ 'OK' | translate }}</ba-button>
      </span>
    </ba-modal>
  </div>
</template>

<script>
let keyup;
document.addEventListener("keyup", keyup, false);

import Vue from 'vue';
import VueLocalStorage from 'vue-localstorage';
import ChangeCredentials from './ChangeCredentials';
import loader from './mixins/loader'
import _ from 'lodash';

Vue.use(VueLocalStorage);

const languages = {
<<<<<<< HEAD
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch"
=======
  'en': "English",
  'es': "Español",
  'fr': "Français",
  'de': "Deutsch"
>>>>>>> CICD/CI_CD
};

export default {
  mixins: [loader],
  components: { ChangeCredentials },

  data() {
    return {
      username: '',
      password: '',
      languages: languages,
      languageSelected: _.get(languages, Vue.localStorage.get('userProfile').language, 'English'),
      version: version,
      validCredentials: true,
      isResetPassword: false,
      passwordRules: '',
      errorMessage: '',
      canSavePassword: false,
      isAutoFill: false
    }
  },

  created() {
    if (this.$cookie.get('user')) {
      window.location = '/logout';
    }
  },

  mounted() {
    window.addEventListener('animationstart', (e) => {
      if (e.animationName === 'onAutoFillStart')
         this.isAutoFill = true;
    });
  },

  methods: {
    enableChangePassword() {
      this.canSavePassword = true;
    },

    disableChangePassword() {
      this.canSavePassword = false;
    },

    openModal(ref) {
      this.$refs[ref].open();
    },

    closeModal(ref) {
      this.$refs[ref].close();
    },

    goToPasswordReset() {
      this.closeModal('expiredPopup');
      this.isResetPassword = true;
    },

    goToLogin() {
      this.errorMessage = '';
      this.isResetPassword = false;
      this.closeModal('loginAgainPopup');
    },

    getPasswordRules(body, options) {
      this.$http.post('/passwordrules', body, options).then((response) => {
        this.passwordRules = response.body.rules.join(' ');
      }, (error) => {
        console.log(error);
      });
    },

    navigate() {
      var historyPath = window.location.href.split('?redirect=').pop();
      if (window.location.href.includes('?redirect=')) {
        return window.location = historyPath;
      } else {
        return window.location = '/';
      }
    },

    getFeatures(response) {
      window.sessionStorage.setItem('features', JSON.stringify(response.body.config));
      this.navigate();
    },

    login() {
      this.isLoadComplete = false;
      let options = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
      let body = {
        encoded: btoa(this.username + ':' + this.password)
      }
      if (this.isResetPassword) {
        body.payload = this.$refs.credentials.getCredentialAsPayload();
        //change password service call
        this.$http.post('/changepassword', body, options).then((response) => {
          this.isLoadComplete = true;
          this.resetCredentials();
          this.openModal('loginAgainPopup');
        }, (error) => {
          this.isLoadComplete = true;
          if (error.body.errors.quality) {
            this.errorMessage = error.body.errors.quality;
          } else if (error.body.errors.repeated) {
            this.errorMessage = error.body.errors.repeated;
          } else if (error.body.message) {
            this.errorMessage = error.body.message;
          }
        });
      } else {
        this.validCredentials = this.username !== '' && this.password !== '';
        this.$http.post('/authenticate', body, options).then((response) => {
          this.isLoadComplete = true;
          this.getFeatures(response);
        }, (error) => {
          this.isLoadComplete = true;
          if (error.body.errors && error.body.errors.expired) {
            // Force password reset
            body.locale = Vue.localStorage.get('userProfile').language.toUpperCase();
            this.getPasswordRules(body, options);
            this.openModal('expiredPopup');
          } else if (error.body.errors && error.body.errors.quality) {
            this.errorMessage = error.body.errors.quality;
          } else if (error.body.errors && error.body.errors.locked) {
            this.openModal('lockedPopup');
          } else {
            this.validCredentials = false;
          }
          console.log(error)
        })
      }
    },

    keyup(e) {
      if (e.key == 'Enter') {
        this.login();
      }
    },

    selectLanguage(languageSelected) {
      let language = _.findKey(this.languages, item => (item.indexOf(languageSelected) !== -1));
      Vue.i18n.set(language);
      Vue.localStorage.set('userProfile', { 'language': language });
    },

    resetCredentials() {
      this.username = '';
      this.password = '';
    },

    resetValidCredentials() {
      this.validCredentials = true;
    }
  }
}
</script>
<style lang="less">
body {
  background: #F4F6F8;
}
@keyframes onAutoFillStart {
  from {/**/}
  to {/**/}
}
input[type='password']:-webkit-autofill {
  animation-name: onAutoFillStart;
}
.active-password label {
  color: #bacbcb;
  font-size: 10px;
  top: -10px;
  opacity: 1;
}
</style>

<style lang="less" scoped>
.login-wrapper {
  width: 100%;
  position: absolute;
  left: 50%;
  top: 55%;
  transform: translate(-50%, -50%);
}

.outer-container {
  height: 100vh;
  margin: auto;
  .terms {
    position: relative;
    bottom: 0;
    text-align: center;
    padding-top: 55px;
    a {
      text-decoration: underline;
      color: inherit;
    }
    p {
      text-align: center;
    }
  }
}

.login-container {
  align-items: center;
  position: relative;
  top: 60%;
  left: 32%;
  font-size: 12px;
  background-color: #FFFFFF;
  border: 1px solid #bbcbcb;
  width: 450px;
  .login-title {
    background-color: #24272B;
    color: #FFFFFF;
    margin-bottom: -32px;
    h6 {
      margin-left: 10px;
      font-size: 14px;
      padding: 10px 0;
    }
  }
  button {
    width: 100%;
  }
  a {
    color: #3598DB;
    text-decoration: none;
  }
  .content {
    .select {
      margin-bottom: 15px;
    }
    .input {
      margin-bottom: 15px;
      letter-spacing: 1.4px;
      height: 40px;
    }
    label {
      letter-spacing: 1.4px;
      text-transform: uppercase;
    }
    .password-error {
      margin-top: 2rem;
    }
  }
  .footer {
    height: 40px;
    text-align: center;
    letter-spacing: 0.1em;
    color: #606061;
    font-size: 11px;
    border: 1px solid #bbcbcb;
    .version {
      margin-top: 55px;
    }
  }
  .forgot-login {
    .forgot {
      background-color: #24272B;
      color: #FFFFFF;
      width: 50%;
      text-align: center;
      float: left;
      cursor: pointer;
      .forgot-link {
        display: block;
        padding: 15px 0;
        color: #FFFFFF;
      }
    }
    .forgot:hover {
      opacity: 0.9;
    }
    .login {
      position: absolute;
      bottom: 0;
      background-color: #3598DB;
      color: #24272b;
      width: 100%;
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      cursor: pointer;
      .login-link {
        display: block;
        color: #FFFFFF;
        padding: 15px 0;
        padding-top: 1px;
      }
      .disabled {
        pointer-events: none;
        background-color: #B3D8F1;
        border: #B3D8F1;
        color: #FBFDFE;
      }
    }
    .login:hover {
      opacity: 0.9;
    }
  }
  .logo-container {
    width: 100%;
    text-align: center;
    #alloy_logo {
      margin: 20px 0 30px;
      width: 156px;
    }
  }
}

.popup-text {
  font-size: 1.2em;
}

.popup-header {
  font-size: 1.5em;
}

.forgot-link-container {
  font-size: small;
  text-align: right;
  margin-right: 20px;
  margin-bottom: 20px;
}

.error-message {
  color: red;
  display: flow-root;
}
</style>
