// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import * as lang from './languages';
import ver from 'external/version.json';

export const environment = {
  production: true,
  authUrl : 'http://pico.ssweb.ga/identity',
  apiUrl : 'http://pico.ssweb.ga:90/api/',
  clientUrl : 'http://pico.ssweb.ga',
  defaultLanguage: lang.languages.thai,
  languages: [
    lang.languages.thai,
    lang.languages.eng
  ],
  version : ver.hash
};
