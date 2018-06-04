import Vue from 'vue';
import VueLocalStorage from 'vue-localstorage';
import _ from 'lodash';
import { mapActions } from 'vuex';
import RepositoriesService from '../../services/repositories';
import relationshipFormDE from '../../../utils/relationshipForm_DE.json';
import relationshipFormES from '../../../utils/relationshipForm_ES.json';
import relationshipFormFR from '../../../utils/relationshipForm_FR.json';
import relationshipFormEN from '../../../utils/relationshipForm_EN.json';

Vue.use(VueLocalStorage);

const locale = JSON.parse(Vue.localStorage.get('userProfile')).language;

let relationshipForm;

switch (locale) {
  case 'de':
    relationshipForm = relationshipFormDE;
    break;
  case 'fr':
    relationshipForm = relationshipFormFR;
    break;
  case 'es':
    relationshipForm = relationshipFormES;
    break;
  default:
    relationshipForm = relationshipFormEN;
}

const parentForm = relationshipForm[0];
const childForm = relationshipForm[1];

export default {
  data() {
    return {
      relationships: []
    };
  },

  methods: {
    getDataViewDocument() {
      this.showSpinner = true;
      RepositoriesService.getDocument({
        repoId: this.repositoryId,
        documentId: this.documentId,
        nested: true,
        locale: `${locale.toUpperCase()}`
      }, {}).then((data) => {
        const newDocument = _.cloneDeep(data.body);
        const query = {
          attribute: 'attributes.RELATEDMDMPARTYID',
          query: newDocument.attributes.MDMPARTYID
        };
        const payload = {
          repoId: this.$root.features.relationshipRepoId,
          pageSize: 0,
          nested: true,
          locale: `${locale.toUpperCase()}`
        };
        payload[query.attribute] = query.query;
        this.checkForRelationships(payload, newDocument);
      }, (error) => {
        let errMessage = error.body.serviceError;
        errMessage = errMessage || 'This document does not exist';
        this.generalErrors.push(errMessage);
        this.showSpinner = false;
        this.$refs.errorToast.toggle();
      });
    },

    checkForRelationships(payload, document) {
      const newDocument = document;

      if (payload.repoId !== 1620307) {
        RepositoriesService.getDocuments(payload, {}).then((data) => {
          const childDocuments = _.map(data.body.documents, (doc) => {
            return {
              documentId: doc.attributes.MASTERPARTY[0].documentId,
              category: doc.attributes.MASTERPARTY[0].category,
              ATTRIBUTES: doc.attributes.MASTERPARTY[0].attributes
            };
          });
          let clonedRelationships = [];
          if (newDocument.attributes.RELATIONSHIPS) {
            clonedRelationships = _.orderBy(newDocument.attributes.RELATIONSHIPS, [(r) => {
              return r.attributes.RELATEDNAME;
            }], ['asc']);
          }
          newDocument.attributes.PARENTRELATIONSHIPS = clonedRelationships;
          newDocument.attributes.CHILDRELATIONSHIPS = _.flatten(_.orderBy(childDocuments, [(cd) => {
            return cd.ATTRIBUTES.NAME.toLowerCase();
          }], ['asc']));
          delete newDocument.attributes.RELATIONSHIPS;
          const newDocRelPartition = newDocument.form.pagedContent[0].partitions[2].cards;
<<<<<<< HEAD
          const i = newDocRelPartition.indexOf('RELATIONSHIPS');
          newDocRelPartition.splice(i, 1);
=======
          const i = _.findIndex(newDocRelPartition, p => p.name === 'RELATIONSHIPS');
          if (i !== -1) {
            newDocRelPartition.splice(i, 1);
          }
>>>>>>> CICD/CI_CD
          newDocRelPartition.push(parentForm);
          newDocRelPartition.push(childForm);
          this.showRelationshipCard = !!((newDocument.attributes.CHILDRELATIONSHIPS.length > 0 || newDocument.attributes.PARENTRELATIONSHIPS.length > 0));
          this.relationships.push(newDocument.attributes.PARENTRELATIONSHIPS);
          this.relationships.push(newDocument.attributes.CHILDRELATIONSHIPS);

          this.setActiveDocument({
            doc: newDocument
          }).then(() => {
            const path = {
              name: this.$route.params.name,
              params: {
                repoId: this.$route.params.repoId,
                docId: this.$route.params.docId
              }
            };
            const crumbs = _.map(this.breadCrumbs, _.property('id'));
            if (crumbs.includes(newDocument.documentId)) {
              const currentCrumbIndex = _.indexOf(crumbs, newDocument.documentId);
              this.removeBreadCrumbs(currentCrumbIndex + 1);
            } else {
              this.addBreadCrumb({
                path: this.$route.name === 'Card View' ? this.$route.path.replace('cardview', 'relationships') : this.$route.path,
                name: newDocument.attributes.NAME,
                id: newDocument.documentId
              });
            }
            this.$router.push(path);
            this.showSpinner = false;
          });
        });
      } else {
        this.setActiveDocument({
          doc: newDocument
        }).then(() => {
          const path = {
            name: this.$route.params.name,
            params: {
              repoId: this.$route.params.repoId,
              docId: this.$route.params.docId
            }
          };
          const crumbs = _.map(this.breadCrumbs, _.property('id'));
          if (crumbs.includes(newDocument.documentId)) {
            const currentCrumbIndex = _.indexOf(crumbs, newDocument.documentId);
            this.removeBreadCrumbs(currentCrumbIndex + 1);
          } else {
            this.addBreadCrumb({
              path: this.$route.name === 'Card View' ? this.$route.path.replace('cardview', 'relationships') : this.$route.path,
              name: newDocument.attributes.NAME,
              id: newDocument.documentId
            });
          }
          this.$router.push(path);
          this.showSpinner = false;
        });
      }
      this.previousScrollValue = 1;
      this.isScrollRight = false;
    },

    ...mapActions([
      'setActiveDocument',
      'addBreadCrumb',
      'removeBreadCrumbs'
    ])
  }
};
