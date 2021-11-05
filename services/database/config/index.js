const bunyan = require('bunyan');
// Load package.json
const pjs = require('../package.json');

// Get some meta info from the package.json
const { name, version } = pjs;

// Set up a logger
const getLogger = (serviceName, serviceVersion, level) => bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level });

// Configuration options for different environments
module.exports = {
  development: {
    name,
    version,
    serviceTimeout: 30,
    log: () => getLogger(name, version, 'debug'),
    mongodburl: "mongodb://localhost:27017/"
  },
  production: {
    name,
    version,
    serviceTimeout: 30,
    log: () => getLogger(name, version, 'info'),
    mongodburl: "mongodb://localhost:27017/"
  },
  test: {
    name,
    version,
    serviceTimeout: 30,
    log: () => getLogger(name, version, 'fatal'),
    mongodburl: "mongodb://localhost:27017/"
  },
};
