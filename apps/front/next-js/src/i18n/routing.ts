import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
  pathnames: {
    '/': {
      en: '/',
      fr: '/'
    },
    // Client routes
    '/account': {
      en: '/account',
      fr: '/compte'
    },
    '/account/[id]': {
      en: '/account/[id]',
      fr: '/compte/[id]'
    },
    '/account/create': {
      en: '/account/create',
      fr: '/compte/creer'
    },
    '/account/savings/create': {
      en: '/account/savings/create',
      fr: '/compte/epargne/creer'
    },
    '/loans': {
      en: '/loans',
      fr: '/emprunts'
    },
    '/loans/[id]': {
      en: '/loans/[id]',
      fr: '/emprunts/[id]'
    },
    '/messages': {
      en: '/messages',
      fr: '/messages'
    },
    '/notifications': {
      en: '/notifications',
      fr: '/notifications'
    },
    '/stocks': {
      en: '/stocks',
      fr: '/actions'
    },
    '/stocks/[id]': {
      en: '/stocks/[id]',
      fr: '/actions/[id]'
    },
    '/portfolio': {
      en: '/portfolio',
      fr: '/portefeuille'
    },
    '/orders': {
      en: '/orders',
      fr: '/ordres'
    },
    // Auth routes
    '/login': {
      en: '/login',
      fr: '/connexion'
    },
    '/register': {
      en: '/register',
      fr: '/inscription'
    },
    '/forgot-password': {
      en: '/forgot-password',
      fr: '/mot-de-passe-oublie'
    },
    '/reset-password': {
      en: '/reset-password',
      fr: '/reinitialiser-mot-de-passe'
    },
    // Advisor routes
    '/advisor/login': {
      en: '/advisor/login',
      fr: '/conseiller/connexion'
    },
    '/advisor/register': {
      en: '/advisor/register',
      fr: '/conseiller/inscription'
    },
    '/advisor/loans': {
      en: '/advisor/loans',
      fr: '/conseiller/emprunts'
    },
    '/advisor/messages': {
      en: '/advisor/messages',
      fr: '/conseiller/messages'
    },
    // Director/Admin routes
    '/admin': {
      en: '/admin',
      fr: '/admin'
    },
    '/admin/login': {
      en: '/admin/login',
      fr: '/admin/connexion'
    },
    '/admin/register': {
      en: '/admin/register',
      fr: '/admin/inscription'
    },
    '/admin/users': {
      en: '/admin/users',
      fr: '/admin/utilisateurs'
    },
    '/admin/users/[id]': {
      en: '/admin/users/[id]',
      fr: '/admin/utilisateurs/[id]'
    },
    '/admin/companies': {
      en: '/admin/companies',
      fr: '/admin/entreprises'
    },
    '/admin/companies/[id]': {
      en: '/admin/companies/[id]',
      fr: '/admin/entreprises/[id]'
    },
    '/admin/stocks': {
      en: '/admin/stocks',
      fr: '/admin/actions'
    },
    '/admin/stocks/[id]': {
      en: '/admin/stocks/[id]',
      fr: '/admin/actions/[id]'
    },
    '/admin/settings': {
      en: '/admin/settings',
      fr: '/admin/parametres'
    },
    '/admin/loans': {
      en: '/admin/loans',
      fr: '/admin/emprunts'
    },
    '/admin/messages': {
      en: '/admin/messages',
      fr: '/admin/messages'
    }
  }
});