// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import {languages} from './languages';
import ver from 'external/version.json';


export const environment = {
  production: false,
  name: 'Dev',
  authUrl : 'http://localhost:5000',
  apiUrl : 'http://localhost:7000/api/',
  clientUrl : 'http://localhost:4200',
  defaultLanguage: languages.thai,
  languages: [
    languages.thai,
    languages.eng
  ],
  version : ver.hash
};
