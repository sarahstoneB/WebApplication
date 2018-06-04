<template>
  <div @keyup="handleKeyEvents">
    <div class="input">
      <ba-input id="oldPassword" :name="$t('OLD_PASSWORD')" v-model="oldPassword" @focus="resetOldPassword" @blur="validateOldPassword" type="password">
        <span v-if="isInvalidOldPwd" slot="error"> {{ "ENTER_OLD_PASSWORD" | translate }} </span>
      </ba-input>
    </div>
    <div class="input">
      <ba-input id="newPassword" ref="newPassword" :name="$t('NEW_PASSWORD')" @focus="resetNewPassword" @blur="validateNewPassword" v-model="newPassword" type="password">
        <span v-if="isInvalidNewPwd" slot="error"> {{ "ENTER_NEW_PASSWORD" | translate }} </span>
      </ba-input>
      <div :class="['sub-text', { 'confirmPasswordError' : isInvalidNewPwd }]">
        <div>{{ passwordRules }}</div>
      </div>
    </div>
    <div class="input">
      <ba-input id="confirmNewPassword" :name="$t('CONFIRM_NEW_PASSWORD')" @focus="resetConfirmedPassword" @blur="validateConfirmedPassword" v-model="confirmedPassword" type="password">
        <span v-if="isInvalidConfirmedPwd" slot="error"> {{ "PASSWORD_DO_NOT_MATCH" | translate }}</span>
      </ba-input>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    passwordRules: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmedPassword: '',
      isInvalidOldPwd: false,
      isInvalidNewPwd: false,
      isInvalidConfirmedPwd: false
    };
  },

  watch: {
    canSave: function(bool) {
      bool ? this.$emit('saveEnabled') : this.$emit('saveDisabled');
    }
  },

  computed: {
    canSave() {
      return (this.newPassword === this.confirmedPassword) && (this.oldPassword.length > 0 && this.newPassword.length > 0);
    }
  },

  methods: {
    validateOldPassword() {
      this.isInvalidOldPwd = this.oldPassword.length === 0;
    },

    validateNewPassword() {
      this.isInvalidNewPwd = this.newPassword.length === 0;
    },

    validateConfirmedPassword() {
      this.isInvalidConfirmedPwd = !(this.newPassword === this.confirmedPassword);
    },

    resetNewPassword() {
      this.isInvalidNewPwd = false;
    },

    resetOldPassword() {
      this.isInvalidOldPwd = false;
    },

    resetConfirmedPassword() {
      this.isInvalidConfirmedPwd = false;
    },

    handleKeyEvents(event) {
      if (event.key == 'Enter') {
        if(this.canSave){
          this.$emit('enter');
        }
      }
    },

    getCredentialAsPayload() {
      return {
        'current': this.oldPassword,
        'new': this.newPassword
      };
    }
  }
};
</script>

<style lang="less" scoped>
.ba-input {
  margin-bottom: 0 !important;
}

.input {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  letter-spacing: .5px;
}

.sub-text {
  top: 40px;
  font-size: 10px;
  color: #868B8B;
}

.confirmPasswordError {
  margin-top: 1rem;
}
</style>
