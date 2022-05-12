const { resolve, relative } = require('path');
const { writeFileSync } = require('fs-extra');

const tstamp = new Date().toLocaleString('th-TH');

const file = resolve(__dirname, '.', 'src', 'environments', 'version.ts');
writeFileSync(file,
    `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
    /* tslint:disable */
    export default { VERSION : '${tstamp}' } ;
    /* tslint:enable */
    `, { encoding: 'utf-8' });