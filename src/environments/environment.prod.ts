import ver from 'external/version.json';
import { languages } from './languages';

export const environment = {
  production: true,
  // name: 'Prod',
  // name: 'UAT',
  name: 'Test',

  //---------------------------PROD---------------------------------------
  // authUrl : 'https://pico.pueantae-ngernduan.com/identity',
  // apiUrl : 'https://pico.pueantae-ngernduan.com/api/',
  // clientUrl : 'https://pico.pueantae-ngernduan.com',
   //---------------------------UAT (AWS)---------------------------------------
  //  authUrl : 'https://picouat.pueantae-ngernduan.com/identity',
  //  apiUrl : 'https://picouat.pueantae-ngernduan.com/api/',
  //  clientUrl : 'https://picouat.pueantae-ngernduan.com',
  //---------------------------TEST---------------------------------------
  authUrl: 'https://picotest.pueantae-ngernduan.com/identity',
  apiUrl: 'https://picotest.pueantae-ngernduan.com/api/',
  clientUrl: 'https://picotest.pueantae-ngernduan.com',
  //------------------------------------------------------------------
  defaultLanguage: languages.thai,
  languages: [
    languages.thai,
    languages.eng
  ],
  version: ver.hash
};
