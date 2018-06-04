import _ from 'lodash'

const deepMapKeys = (obj, fn) => {
  const x = {};
  _.forOwn(obj, (v, k) => {
    if(_.isPlainObject(v)) {
      v = deepMapKeys(v, fn);
    } else if (_.isArray(v)) {
      v = _.map(v, v => deepMapKeys(v, fn));
    }
    x[fn(v, k)] = v;
  });
  return x;
}

export default {
  deepMapKeys
}
