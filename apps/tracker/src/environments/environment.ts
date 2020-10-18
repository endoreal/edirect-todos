
import { Routes } from './../config/routes.constant'

export const environment = {
  production: false,
  serviceworker: false,
  serverUrl: '/api',
  defaultLanguage: 'en-GB',
  locale: 'en-GB',
  supportedLanguages: [
    {
      code: 'en-GB',
      label: 'English',
      orientation: 'ltr',
    },
    {
      code: 'pt-PT',
      label: 'Português',
      orientation: 'ltr',
    },
  ],
  routes: Routes
};
