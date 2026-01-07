import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
  pathnames: {
    '/': {
      en: '/',
      fr: '/'
    },
    '/account': {
      en: '/account',
      fr: '/compte'
    },
    '/account/settings': {
      en: '/account/settings',
      fr: '/compte/parametres'
    },
    '/admin': {
      en: '/admin',
      fr: '/admin'
    },
    '/admin/users': {
      en: '/admin/users',
      fr: '/admin/utilisateurs'
    },
    '/admin/loans': {
      en: '/admin/loans',
      fr: '/admin/emprunts'
    },
    '/admin/messages': {
      en: '/admin/messages',
      fr: '/admin/messages'
    },
    '/login': {
      en: '/login',
      fr: '/connexion'
    },
    '/register': {
      en: '/register',
      fr: '/inscription'
    },
    '/loans': {
      en: '/loans',
      fr: '/emprunts'
    },
    '/messages': {
      en: '/messages',
      fr: '/messages'
    },
    '/notifications': {
      en: '/notifications',
      fr: '/notifications'
    }
  }
});