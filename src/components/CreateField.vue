<template>
  <div class="edit-field">
    <ba-input v-model="value" :name="displayName" v-if="type === 'textbox'">
      <span v-if="['EMAIL'].includes(name.toUpperCase()) && !validateEmail(value)" slot="error">{{ 'PLEASE_INPUT_VALID_EMAIL_ADDRESS' | translate }}.</span>
    </ba-input>
    <ba-select v-model="value" :options="options" v-if="type === 'selection'">
      <span slot="name">{{ displayName }}</span>
    </ba-select>
    <ba-datepicker :name="displayName" class="calendar-icon" v-if="type === 'calendar'" :language="language" :disablePast="['EXPIRATIONDATE', 'ALTEXPIRATIONDATE'].includes(name)" />
  </div>
</template>

<script>
  import _ from 'lodash';
  import { mapGetters, mapActions } from 'vuex';

  const emailRegExp = /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/;

  export default {
    props: ['documentId', 'documentType', 'name', 'displayName', 'editorType', 'noSelectionLabel', 'choices', 'isNested', 'randomDocId'],

    computed: {
      type() {
        return this.editorType ? this.editorType.toLowerCase() : '';
      },

      value: {
        cache: false,
        get() {
          return this.newDocument[this.name];
        },

        set(value) {
          this.setNewDocumentValue({
            documentType: this.documentType,
            documentId: this.documentId ? this.documentId : this.randomDocId,
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
        return JSON.parse(window.localStorage.userProfile).language;
      },

      ...mapGetters(['newDocument'])
    },

    methods: {
      validateEmail(email) {
        this.setErrorMessages((typeof email === 'undefined' || emailRegExp.test(email))? true : false);
        return typeof email === 'undefined' || emailRegExp.test(email);
      },
      ...mapActions([
        'setNewDocumentValue',
        'setErrorMessages'
        ])
    }
  }
</script>

<style lang="less" scoped>
  .edit-field {
    flex: 1;
    padding: 7px 4px 4px 4px;
  }
</style>
