# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PP-CLCA-PCM is a TypeScript banking backend application implementing Clean Architecture with Domain-Driven Design (DDD). It supports loan management, account operations, transactions, and multi-role user management (Client, Advisor, Director).

## Commands

```bash
# Run all tests
pnpm test

# Generate Prisma client (run from infrastructure/adapters)
pnpm --filter @pp-clca-pcm/adapters p:g

# Run database migrations (run from infrastructure/adapters)
pnpm --filter @pp-clca-pcm/adapters p:m

# Start Docker services (PostgreSQL, Redis, MariaDB)
docker compose up -d
```

## Architecture

### Layer Structure (Dependency flows inward)

```
domain/           → Core business logic, entities, value objects (no external deps)
application/      → Use cases, repository interfaces, service interfaces
infrastructure/   → Adapters (Prisma, Redis, MariaDB, Memory), tests
```

### Key Patterns

**Entity Factory Methods:**
- `Entity.create()` - Creates new instance with generated UUID
- `Entity.createFromRaw()` - Hydrates from persistence layer
- `entity.update(props)` - Returns new immutable instance

**Error-as-Value Pattern:**
Factory methods return `Type | ErrorType`, not thrown exceptions:
```typescript
const emailOrError = Email.create(value);
if (emailOrError instanceof Error) {
  return emailOrError;
}
```

**Repository Pattern:**
Interfaces in `application/repositories/`, implementations in `infrastructure/adapters/repositories/` (memory, redis, prisma, mariadb).

### Use Case Organization

Use cases are organized by user role under `application/usecases/`:
- `client/` - Loans, accounts, transactions, stocks, savings, notifications, auth, messages
- `advisor/` - Loan validation, messages, auth
- `shared/` - Cross-role functionality

### User Roles

Users have role-specific properties via optional props:
- `clientProps` - Retail customer features
- `advisorProps` - Financial advisor features
- `directorProps` - Bank director features

## Database Configuration

Copy `.env.example` to `.env`. Supports PostgreSQL (default) or MariaDB via `DB_PROVIDER`.

Required environment variables:
- `JWT_SECRET` - JWT signing key
- `DB_URL` - Database connection string
- `DB_PROVIDER` - `postgresql` or `mariadb`

## Monorepo Structure

pnpm workspaces with packages:
- `domain` (`@pp-clca-pcm/domain`) - Domain entities and value objects
- `application` (`@pp-clca-pcm/application`) - Use cases and interfaces
- `infrastructure/adapters` (`@pp-clca-pcm/adapters`) - Database/service implementations
- `infrastructure/tests` (`@pp-clca-pcm/tests`) - Vitest test suite
- `infrastructure/apps/api/nest-js` (`@pp-clca-pcm/api-nestjs`) - NestJS API
- `infrastructure/apps/front/next-js` (`@pp-clca-pcm/front-nextjs`) - Next.js frontend (with server-side API)

Cross-package imports use `@pp-clca-pcm/*` paths.

## Applications (DO NOT MODIFY unless explicitly requested)

The following directories contain deployable applications. **Do not read, modify, or include these in context unless the user explicitly asks.**

- `infrastructure/apps/api/nest-js/` - NestJS backend API (`@pp-clca-pcm/api-nestjs`)
- `infrastructure/apps/front/next-js/` - Next.js frontend with server-side capabilities (`@pp-clca-pcm/front-nextjs`)