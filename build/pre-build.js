const path = require('path');
const fs = require('fs');
const util = require('util');

// get application version from package.json
const appVersion = require('../package.json').version;

// promisify core API's
const readDir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

console.log('\nRunning pre-build tasks');

// our version.json will be in the dist folder
const versionFilePath = path.join(__dirname + '/../src/external/version.json');
const tstamp = new Date().toLocaleString('th-TH');
    // write current version and hash into the version.json file
const src = `{"version": "${appVersion}", "hash": "${tstamp}"}`;
return writeFile(versionFilePath, src);
  