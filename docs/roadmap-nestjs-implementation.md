# Roadmap NestJS - Implémentation Complète des Use Cases

## Vue d'ensemble

Ce document décrit la roadmap pour implémenter **56 use cases** dans l'API NestJS avec architecture modulaire, système de mapping dynamique des repositories (Prisma/Redis), et respect de la Clean Architecture.

## Objectifs du projet

1. ✅ Créer un système de mapping de repositories dynamique basé sur `DB_PROVIDER`
2. ✅ Implémenter tous les 56 use cases dans NestJS
3. ✅ Utiliser les services/adapters existants quand possible
4. ✅ Respecter la Clean Architecture
5. ✅ Focus sur Prisma (TODO pour Redis manquants)
6. ✅ Rebuild automatique avant relance API

## État actuel vs État cible

### État actuel
- **Application Layer**: 56 use cases bien structurés
- **Adapters**: Repositories implémentés (Prisma, Redis, Memory, MariaDB)
- **NestJS API**: Structure minimale (app.module, app.controller basique)
- **Problèmes**: Pas de DI, pas de guards, pas de controllers

### État cible
- **API complète**: Tous les 56 use cases exposés via REST
- **Architecture modulaire**: Modules par rôle (Client, Advisor, Director, Engine)
- **Système de mapping**: Repositories dynamiques selon DB_PROVIDER
- **Authentication/Authorization**: JWT + Guards
- **Gestion des erreurs**: Error-as-Value → HTTP exceptions

## Statistiques

### Use Cases par rôle
- **Client**: 26 use cases (46% du total)
- **Director**: 19 use cases (34% du total)
- **Advisor**: 8 use cases (14% du total)
- **Engine**: 2 use cases (4% du total)
- **Shared**: 2 use cases (4% du total)

### Endpoints à créer
- **Client**: ~30 endpoints (auth, accounts, loans, stocks, portfolio, messages, notifications)
- **Advisor**: ~8 endpoints (auth, loans, messages)
- **Director**: ~24 endpoints (auth, clients, companies, stocks, savings)
- **Total**: ~62 endpoints REST

### Repositories
- **15 interfaces** de repositories
- **Prisma**: 10 implémentations
- **Redis**: 11 implémentations
- **Stratégie de fallback** pour combler les gaps

## Timeline et priorités

### Phase 1: Infrastructure Foundation (Semaine 1) ⭐ PRIORITÉ CRITIQUE
**Objectif**: Créer la base technique

**Livrables**:
- [ ] DatabaseModule (PrismaClient/RedisClient)
- [ ] RepositoriesModule (mapping dynamique)
- [ ] ServicesModule (PasswordService, TokenService, etc.)
- [ ] AuthGuard (JWT verification)
- [ ] RolesGuard (Client/Advisor/Director)
- [ ] ErrorInterceptor (Error-as-Value → HTTP)
- [ ] Decorators (@CurrentUser, @Roles)
- [ ] Interfaces (RequestWithUser)

**Tests de validation**:
- Endpoint de test protégé par AuthGuard
- JWT fonctionne
- Repositories s'injectent correctement

### Phase 2: Authentication (Semaine 1-2) ⭐ PRIORITÉ HAUTE
**Objectif**: Implémenter l'authentification pour les 3 rôles

**Livrables**:
- [ ] Client Auth (5 endpoints: login, register, logout, password-reset)
- [ ] Advisor Auth (2 endpoints: login, register)
- [ ] Director Auth (2 endpoints: login, register)

**Tests de validation**:
- Inscription et login pour chaque rôle
- Login invalide (401)
- Reset password flow

### Phase 3: Client Core Features (Semaine 2-3) 🔵 PRIORITÉ MOYENNE
**Objectif**: Fonctionnalités principales du client

**Livrables**:
- [ ] Accounts (6 endpoints)
- [ ] Transactions (1 endpoint)
- [ ] Notifications (1 endpoint)

**Tests de validation**:
- Créer/modifier/supprimer compte
- Envoyer transaction
- Consulter notifications

### Phase 4: Client Loans (Semaine 3) 🔵 PRIORITÉ MOYENNE
**Objectif**: Système de prêts côté client

**Livrables**:
- [ ] Loans (4 endpoints: list, request, simulate, repay)

**Tests de validation**:
- Simuler un prêt
- Demander un prêt
- Rembourser un prêt

### Phase 5: Stock Trading System (Semaine 4) 🟢 PRIORITÉ BASSE
**Objectif**: Système de trading d'actions

**Livrables**:
- [ ] Stocks (2 endpoints)
- [ ] Stock Orders (4 endpoints)
- [ ] Portfolio (2 endpoints)

**Tests de validation**:
- Consulter actions
- Créer/annuler ordre
- Consulter portfolio

### Phase 6: Client Messages (Semaine 4) 🟢 PRIORITÉ BASSE
**Objectif**: Communication client-advisor

**Livrables**:
- [ ] Messages (1 endpoint)

### Phase 7: Advisor Features (Semaine 5) 🔵 PRIORITÉ MOYENNE
**Objectif**: Fonctionnalités advisor

**Livrables**:
- [ ] Loans (3 endpoints: pending, grant, reject)
- [ ] Messages (3 endpoints: reply, close, transfer)

**Tests de validation**:
- Approuver/rejeter prêt
- Répondre/transférer message

### Phase 8: Director Features (Semaine 5-6) 🔵 PRIORITÉ MOYENNE
**Objectif**: Fonctionnalités director

**Livrables**:
- [ ] Clients Management (6 endpoints)
- [ ] Companies (5 endpoints)
- [ ] Stocks Management (4 endpoints)
- [ ] Savings (1 endpoint)

**Tests de validation**:
- CRUD clients
- CRUD companies
- CRUD stocks

### Phase 9: Engine & Background Jobs (Semaine 7) 🟢 PRIORITÉ BASSE
**Objectif**: Tâches planifiées

**Livrables**:
- [ ] Daily Interest Cron Job
- [ ] Loan Notification Cron Job

### Phase 10: Shared Features (Semaine 7) 🟢 PRIORITÉ BASSE
**Objectif**: Fonctionnalités partagées

**Livrables**:
- [ ] Notification utilities (2 use cases)

### Phase 11: Testing & Documentation (Semaine 8) 📝
**Objectif**: Tests et documentation

**Livrables**:
- [ ] E2E tests pour authentication
- [ ] E2E tests pour features principales
- [ ] Swagger/OpenAPI documentation
- [ ] README avec instructions

## Métriques de progression

### Par module
- [ ] Infrastructure: 0/9 fichiers
- [ ] Client Module: 0/26 use cases
- [ ] Advisor Module: 0/8 use cases
- [ ] Director Module: 0/19 use cases
- [ ] Engine Module: 0/2 use cases
- [ ] Shared Module: 0/2 use cases

### Par phase
- [ ] Phase 1 (Infrastructure): 0/9 tâches
- [ ] Phase 2 (Authentication): 0/9 endpoints
- [ ] Phase 3 (Client Core): 0/8 endpoints
- [ ] Phase 4 (Client Loans): 0/4 endpoints
- [ ] Phase 5 (Stock Trading): 0/8 endpoints
- [ ] Phase 6 (Client Messages): 0/1 endpoint
- [ ] Phase 7 (Advisor): 0/6 endpoints
- [ ] Phase 8 (Director): 0/16 endpoints
- [ ] Phase 9 (Engine): 0/2 cron jobs
- [ ] Phase 10 (Shared): 0/2 use cases

### Total
**Progression globale**: 0/56 use cases (0%)

## Dépendances entre phases

```
Phase 1 (Infrastructure)
    ↓
Phase 2 (Authentication)
    ↓
Phase 3-10 (Features) - peuvent être faites en parallèle
    ↓
Phase 11 (Tests & Docs)
```

**Bloquants**:
- Phase 2-10 dépendent de Phase 1
- Toutes les features nécessitent l'authentication

## Risques et mitigation

### Risques identifiés

1. **Repository gaps (Prisma/Redis)**
   - **Impact**: Certains use cases ne peuvent pas s'exécuter
   - **Mitigation**: Stratégie de fallback automatique
   - **Statut**: ✅ Planifié dans Phase 1

2. **Complexité du mapping dynamique**
   - **Impact**: Bugs difficiles à débugger
   - **Mitigation**: Tests unitaires du RepositoriesModule
   - **Statut**: ⚠️ À surveiller

3. **Error-as-Value → HTTP exceptions**
   - **Impact**: Mapping incomplet = 500 errors
   - **Mitigation**: ErrorInterceptor avec mapping exhaustif
   - **Statut**: ✅ Planifié dans Phase 1

4. **Rebuild oublié après changement packages**
   - **Impact**: Erreurs runtime obscures
   - **Mitigation**: Script prebuild dans package.json
   - **Statut**: ✅ Planifié

## Documents associés

- [Architecture NestJS](./architecture-nestjs.md) - Architecture détaillée avec exemples
- [Use Cases Inventory](./use-cases-inventory.md) - Inventaire complet des 56 use cases
- [Repositories Mapping](./repositories-mapping.md) - Système de mapping et gaps
- [Implementation Phases](./implementation-phases.md) - Phases détaillées par semaine

## Notes importantes

### Build process
⚠️ **IMPORTANT**: Toujours faire `pnpm build` à la racine avant de relancer l'API si les packages domain/application/adapters ont changé.

### Environment variables requis
```env
DB_PROVIDER=prisma          # ou 'redis'
DB_URL=postgresql://...     # Prisma connection
REDIS_URL=redis://...       # Redis connection (si utilisé)
JWT_SECRET=your-secret-key
```

### Dépendances NPM à ajouter
```bash
npm install --save @nestjs/config class-validator class-transformer
npm install --save redis jsonwebtoken argon2
npm install --save @nestjs/schedule  # Pour cron jobs
```

## Prochaines actions

1. ✅ **Plan créé** - Roadmap complète établie
2. ⏳ **Phase 1** - Commencer l'infrastructure
3. ⏳ **Phase 2** - Implémenter l'authentication
4. ⏳ **Phases 3-10** - Features par priorité
5. ⏳ **Phase 11** - Tests et documentation

---

**Dernière mise à jour**: 2026-01-06
**Statut global**: 🔴 Planning - Implémentation non commencée
