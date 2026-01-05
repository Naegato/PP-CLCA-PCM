# Guide de Création d'un Use Case avec Tests

Ce guide décrit la méthodologie pour créer un nouveau use case dans le projet PP-CLCA-PCM, en suivant les patterns Clean Architecture et DDD établis.

---

## 1. Analyse du besoin

### 1.1 Définir le scope
- Identifier le **rôle utilisateur** concerné (Client, Advisor, Director)
- Déterminer le **domaine fonctionnel** (auth, accounts, loans, transactions, etc.)
- Clarifier le **flow complet** (étapes, inputs, outputs, cas d'erreur)

### 1.2 Questions à se poser
- Quelles données en entrée (Request) ?
- Quelles données en sortie (Response) ?
- Quels services existants réutiliser ?
- Quels nouveaux services créer ?
- Quelles erreurs peuvent survenir ?
- Le repository a-t-il toutes les méthodes nécessaires ?

---

## 2. Créer les erreurs

**Emplacement:** `application/errors/`

**Pattern:**
```typescript
export class NomDeLErreurError extends Error {
  public readonly name = 'NomDeLErreurError';

  constructor(message?: string) {
    super(message);
  }
}
```

**Convention de nommage:** `<description>-error.ts` (kebab-case)

**Exemples d'erreurs courantes:**
- `user-not-found-by-email.ts`
- `invalid-reset-token.ts`
- `login-invalid-credentials.ts`

---

## 3. Créer les Request/Response

### 3.1 Request
**Emplacement:** `application/requests/`

```typescript
export class NomDuUseCaseRequest {
  public readonly champ1: string;
  public readonly champ2: number;
}
```

### 3.2 Response
**Emplacement:** `application/responses/`

```typescript
export class NomDuUseCaseResponse {
  public constructor(
    public readonly resultat: string,
  ) {}
}
```

---

## 4. Étendre les interfaces (si nécessaire)

### 4.1 Services
**Emplacement:** `application/services/`

- Ajouter les nouvelles méthodes à l'interface
- Documenter les types de retour (inclure les erreurs possibles)

**Exemple:**
```typescript
export interface TokenService {
  generateToken(userId: string): Promise<string | TokenSecretNotDefinedError>;
  generateResetToken(userId: string): Promise<string | TokenSecretNotDefinedError>;
  verifyResetToken(token: string): Promise<string | InvalidResetTokenError | TokenSecretNotDefinedError>;
}
```

### 4.2 Repositories
**Emplacement:** `application/repositories/`

- Ajouter les nouvelles méthodes de requête (findBy*, etc.)
- Importer les nouvelles erreurs

**Exemple:**
```typescript
export interface UserRepository {
  save(user: User): Promise<User | EmailAlreadyExistError>;
  findByEmail(email: string): Promise<User | UserNotFoundByEmailError>;
  findById(id: string): Promise<User | UserNotFoundByIdError>;
  update(user: User): Promise<User | UserUpdateError>;
}
```

---

## 5. Implémenter les adaptateurs

### 5.1 Services
**Emplacement:** `infrastructure/adapters/services/`

- Implémenter les nouvelles méthodes de l'interface
- Respecter le pattern Error-as-Value (retourner les erreurs, pas les throw)

**Exemple:**
```typescript
export class JwtTokenService implements TokenService {
  public async generateResetToken(userId: string) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return new TokenSecretNotDefinedError();
    }

    return jwt.sign({ userId, type: 'reset' }, secret, { expiresIn: '15m' });
  }

  public async verifyResetToken(token: string) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return new TokenSecretNotDefinedError();
    }

    try {
      const decoded = jwt.verify(token, secret) as { userId: string; type: string };

      if (decoded.type !== 'reset') {
        return new InvalidResetTokenError();
      }

      return decoded.userId;
    } catch {
      return new InvalidResetTokenError();
    }
  }
}
```

### 5.2 Repositories (Memory pour les tests)
**Emplacement:** `infrastructure/adapters/repositories/memory/`

- Implémenter les nouvelles méthodes
- L'implémentation memory suffit pour les tests

**Exemple:**
```typescript
findById(id: string): Promise<User | UserNotFoundByIdError> {
  const foundUser = this.inMemoryUsers.find((u) => u.identifier === id);
  if (!foundUser) {
    return Promise.resolve(new UserNotFoundByIdError());
  }
  return Promise.resolve(foundUser);
}
```

---

## 6. Implémenter le Use Case

**Emplacement:** `application/usecases/<role>/<domaine>/`

**Structure type:**
```typescript
import { SomeError } from '@pp-clca-pcm/application/errors/some-error';
import { Repository } from '@pp-clca-pcm/application/repositories/repository';
import { Request } from '@pp-clca-pcm/application/requests/request';
import { Response } from '@pp-clca-pcm/application/responses/response';
import { Service } from '@pp-clca-pcm/application/services/service';

export class NomDuUseCase {
  public constructor(
    public readonly repository: Repository,
    public readonly service: Service,
  ) {}

  public async execute(request: Request) {
    // 1. Validation/récupération des données
    const data = await this.repository.find(...);
    if (data instanceof Error) return data;

    // 2. Vérifications métier (rôle, permissions, etc.)
    if (!data.isClient()) {
      return new SomeError();
    }

    // 3. Opération principale
    const result = await this.service.doSomething(...);
    if (result instanceof Error) return result;

    // 4. Persistance si nécessaire
    const saved = await this.repository.save(...);
    if (saved instanceof Error) return saved;

    // 5. Retour de la réponse
    return new Response(result);
  }
}
```

**Règles importantes:**
- Toujours vérifier `instanceof Error` après chaque appel async
- Vérifier le rôle utilisateur (`user.isClient()`, `user.isAdvisor()`, etc.)
- Ne jamais `throw`, toujours `return` les erreurs
- Utiliser les Value Objects du domaine pour la validation

---

## 7. Écrire les tests

**Emplacement:** `infrastructure/tests/usecase/<role>/<domaine>/`

### 7.1 Structure du fichier test
```typescript
import { Response } from '@pp-clca-pcm/application/responses/response';
import { describe, expect, test } from 'vitest';

import { Entity } from '@pp-clca-pcm/domain/entities/entity';
import { UseCase } from '@pp-clca-pcm/application/usecases/<role>/<domaine>/use-case';
import { InMemoryRepository } from '@pp-clca-pcm/adapters/repositories/memory/repository';
import { ServiceImpl } from '@pp-clca-pcm/adapters/services/service-impl';
import { SomeError } from '@pp-clca-pcm/application/errors/some-error';

describe('Nom du Use Case', () => {
  // Factory pour les dépendances
  const getData = () => {
    const repository = new InMemoryRepository();
    const service = new ServiceImpl();
    const useCase = new UseCase(repository, service);

    return { useCase, repository, service };
  };

  test('Should succeed when ...', async () => { ... });
  test('Should fail when ...', async () => { ... });
});
```

### 7.2 Cas de test à couvrir

| Type | Description | Exemple |
|------|-------------|---------|
| **Succès** | Le cas nominal fonctionne | Login avec bons identifiants |
| **Données invalides** | Email inexistant, ID invalide | Email non trouvé en base |
| **Mauvais rôle** | L'utilisateur n'a pas le bon rôle | Client essaie d'accéder à une fonction Advisor |
| **Validation métier** | Règles de validation | Mot de passe trop court |
| **Erreurs service** | Token invalide, expiré | Token JWT expiré |
| **Erreurs persistance** | Update/save échoue | Utilisateur n'existe plus |

### 7.3 Pattern de test - Cas de succès
```typescript
test('Should do something successfully', async () => {
  const { useCase, repository, service } = getData();

  // 1. Préparer les données
  const hashedPassword = await service.hashPassword('ValidPassword123!');
  const entity = Entity.fromPrimitives({
    identifier: 'entity-123',
    email: 'test@example.com',
    password: hashedPassword,
    clientProps: new ClientProps(),
  });
  await repository.save(entity);

  // 2. Exécuter
  const result = await useCase.execute({
    email: 'test@example.com',
    password: 'ValidPassword123!',
  });

  // 3. Vérifier le succès
  expect(result).not.instanceof(Error);
  expect(result).(ExpectedResponse);

  // 4. Vérifier les propriétés
  const response = result as ExpectedResponse;
  expect(response.property).toBe(expectedValue);
});
```

### 7.4 Pattern de test - Cas d'erreur
```typescript
test('Should fail when email does not exist', async () => {
  const { useCase } = getData();

  const result = await useCase.execute({
    email: 'unknown@example.com',
  });

  expect(result).(UserNotFoundByEmailError);
});

test('Should fail when user is not a client', async () => {
  const { useCase, repository, service } = getData();

  const advisor = Entity.fromPrimitives({
    identifier: 'advisor-123',
    email: 'advisor@example.com',
    password: await service.hashPassword('Password123!'),
    advisorProps: new AdvisorProps(),
  });
  await repository.save(advisor);

  const result = await useCase.execute({
    email: 'advisor@example.com',
  });

  expect(result).instanceof(ExpectedError);
});
```

---

## 8. Exécuter et valider

```bash
# Lancer tous les tests
npm test

# Lancer un test spécifique (par nom)
npm test -- --filter "Nom du Use Case"

# Lancer les tests d'un fichier
npm test -- client-reset-password
```

---

## Checklist récapitulative

```
[ ] 1. Besoin clarifié (inputs, outputs, erreurs possibles)
[ ] 2. Erreurs créées dans application/errors/
[ ] 3. Request créée dans application/requests/
[ ] 4. Response créée dans application/responses/
[ ] 5. Interfaces étendues (services, repositories) si nécessaire
[ ] 6. Adaptateurs implémentés (services, repositories memory)
[ ] 7. Use case implémenté dans application/usecases/<role>/<domaine>/
[ ] 8. Tests écrits couvrant:
    [ ] Cas de succès
    [ ] Erreurs de données (not found, invalid)
    [ ] Erreurs de rôle (mauvais type d'utilisateur)
    [ ] Erreurs de validation métier
    [ ] Erreurs de service externe
[ ] 9. Tous les tests passent (npm test)
```

---

## Arborescence des fichiers

```
application/
├── errors/
│   └── <nom>-error.ts
├── requests/
│   └── <nom>.ts
├── responses/
│   └── <nom>.ts
├── services/
│   └── <service>.ts              # Interface
├── repositories/
│   └── <entity>.ts               # Interface
└── usecases/
    ├── client/
    │   ├── auth/
    │   │   ├── client-login.ts
    │   │   ├── client-registration.ts
    │   │   ├── client-request-password-reset.ts
    │   │   └── client-reset-password.ts
    │   ├── accounts/
    │   └── loans/
    ├── advisor/
    │   ├── auth/
    │   └── loans/
    ├── director/
    │   └── auth/
    └── shared/

infrastructure/
├── adapters/
│   ├── services/
│   │   ├── argon2-password.ts
│   │   └── jwt-token.ts
│   └── repositories/
│       ├── memory/
│       │   └── <entity>.ts
│       ├── prisma/
│       └── redis/
└── tests/
    └── usecase/
        ├── client/
        │   ├── auth/
        │   │   ├── client-jwt-login.test.ts
        │   │   ├── client-registration.test.ts
        │   │   ├── client-request-password-reset.test.ts
        │   │   └── client-reset-password.test.ts
        │   └── accounts/
        ├── advisor/
        └── director/
```

---

## Exemple complet: Reset Password

Voir l'implémentation de référence:
- `application/usecases/client/auth/client-request-password-reset.ts`
- `application/usecases/client/auth/client-reset-password.ts`
- `infrastructure/tests/usecase/client/auth/client-request-password-reset.test.ts`
- `infrastructure/tests/usecase/client/auth/client-reset-password.test.ts`
