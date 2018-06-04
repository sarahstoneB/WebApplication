import _ from 'lodash';
import RepositoryService from '../../services/repositories';

export default {
  data() {
    return {
      customHeaders: []
    };
  },

  methods: {
    repoHeaders(form, repoId, language) {
      return RepositoryService.getColHeaders({
        repoId,
<<<<<<< HEAD
        formName: `${form}_${repoId}_${language}`,
=======
        formName: `${form}_${repoId}_${language}`
>>>>>>> CICD/CI_CD
      }).then((response) => {
        const filteredResponse = _.filter(response.body.form.gridContent, (header) => {
          if (header) {
            return header.valueType !== 'nested' && header.name !== 'repositoryId' && header.name !== 'documentKey' && header.name !== 'category' && header.name !== 'documentId' && header.name !== 'ONTOLOGYCATEGORY';
          }
        });
        const headers = _.map(filteredResponse, (v, i) => {
          return {
            name: v.displayName,
            value: v.name
          };
        });

        if (this.$route.name === 'MATCH_AND_MERGE') {
          headers.splice(headers.length - 1, 0, {
            name: this.$t('MATCH_SCORE'),
            value: 'MATCHSCORE'
          });
        }
        this.customHeaders = headers;
        return _.map(filteredResponse, _.property('name'));
      });
    },

    getAllColHeaderDetails(repoId) {
      return RepositoryService.getDetailedColHeaders({
        repoId
      }).then((response) => {
        response.body.container.contents = _.filter(response.body.container.contents, c => (c.componentType === 'attribute' || c.componentType === 'metadata') && c.valueType !== 'nestedRepository' && c.name !== 'repositoryId' && c.name !== 'documentKey' && c.name !== 'category' && c.name !== 'documentId' && c.name !== 'ONTOLOGYCATEGORY');
        return response.body;
      });
    },

    createNewColForm(repoId, form) {
      return RepositoryService.createNewForm({ repoId }, { form });
    }
  }
};
