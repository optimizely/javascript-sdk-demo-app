var optimizely = require('@optimizely/optimizely-sdk');
var logger = require('@optimizely/optimizely-sdk/lib/plugins/logger');
var enums = require('@optimizely/optimizely-sdk/lib/utils/enums');
require('es6-promise').polyfill();
require('isomorphic-fetch');

import {datafileURL} from '../../constants';


class OptimizelyManager {

  // instantiate the Optimizely client
  static async createInstance() {
    var datafile = await _getDatafile();
    return optimizely.createInstance({
      datafile: datafile,
      logger: logger.createLogger({
        logLevel: enums.LOG_LEVEL.DEBUG,
      }),
    });
  }
}

export default OptimizelyManager;

// fetch JSON datafile from CDN
async function _getDatafile() {
  return await fetch(datafileURL)
    .then(function (response) {
      if (response.status >= 400) {
        console.log('Error downloading datafile');
      }
      return response.json();
    });
}
