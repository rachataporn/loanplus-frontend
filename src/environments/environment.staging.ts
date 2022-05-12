// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import {languages} from './languages';
import ver from 'external/version.json';

export const environment = {
  production: false,
  name: 'UAT',
  //---------------------------UAT---------------------------------------
  authUrl: 'https://picouat.ssweb.ga/identity',
  apiUrl: 'https://picouat.ssweb.ga/api/',
  clientUrl: 'https://picouat.ssweb.ga',
  //------------------------------------------------------------------
  defaultLanguage: languages.thai,
  languages: [
    languages.thai,
    languages.eng
  ],
  version : ver.hash
};
