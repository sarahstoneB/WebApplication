<template>
  <div class="edit-field">
    <ba-input v-model="value" :name="displayName" v-if="type === 'textbox'" @change="resetErrorMessage" :disabled="fieldDisabled && validEntry">
      <span v-if="['EMAIL'].includes(name.toUpperCase()) && !validateEmail(value)" slot="error">{{ 'PLEASE_INPUT_VALID_EMAIL_ADDRESS' | translate }}.</span>
      <span v-if="(hasError && isRequired && showErrorMessage) || (validatePartyCard && showErrorMessage )" slot="error"></span>
    </ba-input>
    <span class="has-error" v-if="(validatePartyCard && type !== 'selection' && showErrorMessage)">{{ errorInfo }}</span>
    <span class="has-error" v-else-if="(type !== 'selection' && showErrorMessage && hasError)">{{ errorInfo }}</span>
    <ba-select :class="[{'error-edit-field': hasError && showErrorMessage},'error-card']" v-model="value" :options="options" v-if="type === 'selection'" @change="resetErrorMessage" :disabled="fieldDisabled && validEntry" :tabindex="enableTab">
      <span :class="[{'error-label': hasError && showErrorMessage}]" slot="name">{{ displayName }}</span>
      <span v-if="hasError && isRequired" slot="error"></span>
    </ba-select>
    <span class="has-error" v-if="hasError && type === 'selection' && showErrorMessage">{{ errorInfo }}</span>
    <ba-datepicker :name="displayName" :class="['calendar-icon',{'disable-date': fieldDisabled }]" v-if="type === 'calendar'" :language="language" :disablePast="['EXPIRATIONDATE', 'ALTEXPIRATIONDATE'].includes(name)" />
    <span v-if="hasError && isRequired" slot="error"></span>
  </div>
</template>

<script>
  import _ from 'lodash';
  import { mapGetters, mapActions } from 'vuex';

  const emailRegExp = /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/;

  export default {
    props: ['documentId', 'documentType', 'name', 'displayName', 'editorType', 'noSelectionLabel', 'choices', 'isNested', 'randomDocId', 'isRequired', 'editable'],

    data() {
      return {
        showErrorMessage: false,
        validEntry: true,
      }
    },

    computed: {
      isErrorView() {
        return this.$route.path.includes('errorcardview');
      },

      type() {
        return this.editorType ? this.editorType.toLowerCase() : '';
      },

      fieldDisabled() {
        return !((!this.validatePartyCard && this.hasError) || (this.validatePartyCard && !this.hasError));
      },

      enableTab() {
        return this.fieldDisabled && this.validEntry ? -1 : 1;
      },

      validatePartyCard() {
        let error = false;
        let labelName = this.name;
        let partyErrorList;
        _.each(this.activeDocumentErrors, (key,val) => {
          if (key['ERROR']) {
            this.errorInfo = key['ERROR'].split(':')[1];           
          } else if (key['error']) {
            this.errorInfo = key['error'].split(':')[1];         
          }
          partyErrorList = val;
          if (partyErrorList == labelName) {
            error = true;
            this.showErrorMessage = true;
          } 
          if (partyErrorList == labelName) {
            error = true;
            this.showErrorMessage = true;
          }
        })
        return error;
      },

      hasError() {
        let hasError = false;
        let errorId; 
        if(this.isErrorView && this.activeDocumentErrors) {
          let errorDocument = this.activeDocumentErrors[this.documentType];
          let activeDocument = _.find(this.activeDocument[this.documentType], (val) => {
            if(val.DOCUMENTID === this.documentId) {
              errorId = this.documentId;
            }
            return val.DOCUMENTID === this.documentId
          });
          let attribute = activeDocument && activeDocument[this.name] ? activeDocument[this.name] : '';
          if(errorDocument && errorDocument[this.documentId]) {
            let errorCard = errorDocument[this.documentId];
            if (errorCard[this.name] && (attribute === this.value || !this.value)) {
              this.showErrorMessage = true;
              hasError = true;
              this.errorInfo = errorCard[this.name].ERROR ? errorCard[this.name].ERROR.split(':')[1] : errorCard[this.name].error.split(':')[1];
              this.setErrorMessage(this.errorInfo);
            } else if(errorCard['DATA'] && this.displayName != 'Type' && this.displayName != 'Status') {
              this.validEntry = false;
            } else if(errorCard['data'] && this.displayName != 'Type' && this.displayName != 'Status') {
              this.validEntry = false;
            } else if(errorCard[this.name]) {
              this.showErrorMessage = true;
              hasError = true;
              this.errorInfo = errorCard[this.name].ERROR ? errorCard[this.name].ERROR.split(':')[1] : errorCard[this.name].error.split(':')[1];
              this.setErrorMessage(errorId);
            }

          }
          let emptyListsHeader = ['ADDRESSES','SPECIALTIES'];
          if(this.activeDocumentErrors[emptyListsHeader[0]] || this.activeDocumentErrors[emptyListsHeader[1]]) {
            if (this.activeDocumentErrors[emptyListsHeader[0]]) {
              let errorCards = this.activeDocumentErrors[emptyListsHeader[0]]['ERROR'] ?  this.activeDocumentErrors[emptyListsHeader[0]]['ERROR'] : this.activeDocumentErrors[emptyListsHeader[0]]['error'];
              if (errorCards) {
                this.setErrorMessage(errorCards);
              }
            } else {
              let errorCards = this.activeDocumentErrors[emptyListsHeader[1]]['ERROR'] ?  this.activeDocumentErrors[emptyListsHeader[1]]['ERROR'] : this.activeDocumentErrors[emptyListsHeader[1]]['error'];
              if (errorCards) {
                this.setErrorMessage(errorCards);
              }
            }

          }
        }
        return hasError;
      },

      value: {
        cache: false,
        get() {
          var value = '';
          if (this.isNested) {
            value = this.stagedChanges ? _.find(this.stagedChanges[this.documentType], d => d.DOCUMENTID === (this.documentId ? this.documentId : this.randomDocId)).ATTRIBUTES[this.name]
                    : ''
          } else {
            value = this.stagedChanges[this.name];
          }
          return value;
        },

        set(value) {
          this.stageDocumentValueChange({
            documentType: this.documentType,
            documentId: this.documentId,
            name: this.name,
            value,
            isNested: this.isNested
          })
        }
      },

      options() {
        return this.choices;
      },

      language() {
        let language = JSON.parse(window.localStorage.userProfile).language;
        return language;
      },

      ...mapGetters([
        'stagedChanges',
        'activeDocumentErrors',
        'activeDocument'
        ])
    },

    methods: {
      validateEmail(email) {
        this.setErrorMessages((typeof email === 'undefined' || emailRegExp.test(email))? true : false);
        return typeof email === 'undefined' || emailRegExp.test(email);
      },

      resetErrorMessage() {
        this.validEntry = false;
        this.showErrorMessage = false;
      },

      ...mapActions([
        'stageDocumentValueChange',
        'setErrorMessages',
        'setErrorMessage'])
    }
  }
</script>
<style lang="less">
  .edit-field {
    .calendar-icon{
      i {
        font-size: 150%;
      }
    }
  }
</style>
<style lang="less" scoped>
  .edit-field {
    flex: 1;
    padding: 7px 4px 4px 4px;
  }
  .has-error {
    text-align: left;
    color: #DB4439;
  }
</style>

<style lang="less">
.disable-date {
  pointer-events: none;
  .datepicker-container {
    display: none;
  }
  .ba-input {
    pointer-events: none;
  }
}
.error-edit-field .ba-select-input {
  border-bottom: 2px solid #DB4439;
  padding: 3px;
}

.error-edit-field .ba-select-input::before {
  color: #DB4439;
}

.error-label {
  color: #DB4439;
}

.error-card .ba-select-menu{
    max-height: 10em;
}

</style>
