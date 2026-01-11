# Fixes pour les tests

## Problème identifié
Les tests `client-cancel-stock-order.test.ts` et `director-manage-update.test.ts` utilisent `JwtSecurityService` sans authentifier d'utilisateur. `getCurrentUser()` retourne `null`, causant l'erreur "User has no identifier."

## Solution
Remplacer `JwtSecurityService` par un `MockSecurity` simple (pattern utilisé dans `client-get-accounts.test.ts`).

---

## Fix 1: client-cancel-stock-order.test.ts

### Modifications:

1. **Remplacer l'import** (ligne 1):
```ts
// AVANT:
import { InMemoryUserRepository, JwtSecurityService, JwtTokenService } from '@pp-clca-pcm/adapters';

// APRES:
import { InMemoryStockOrderRepository } from '@pp-clca-pcm/adapters';
```

2. **Ajouter l'import Security** après les imports domain (vers ligne 15):
```ts
import { Security } from '@pp-clca-pcm/application';
```

3. **Ajouter la classe MockSecurity** après les imports (avant le describe):
```ts
class MockSecurity implements Security {
  constructor(private currentUser: User | null) {}
  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }
}
```

4. **Modifier getData()** pour accepter l'utilisateur courant et utiliser MockSecurity:
```ts
const getData = (currentUser: User | null = null) => {
  const stockOrderRepository = new InMemoryStockOrderRepository();
  const security = new MockSecurity(currentUser);
  const useCase = new ClientCancelStockOrder(stockOrderRepository, security);

  return {
    useCase,
    stockOrderRepository,
  };
};
```

5. **Modifier chaque test** pour passer l'utilisateur à getData():
- Test "Should cancel order successfully" (ligne 65): `getData(user)` au lieu de `getData()`
- Test "Should return error when order not found" (ligne 86): passer un user avec `getData(createTestUser())`
- Test "Should return error when user is not the owner" (ligne 97): `getData(otherUser)`
- Test "Should return error when order is already executed" (ligne 117): `getData(user)`
- Test "Should return error when user has no identifier" (ligne 138): `getData(userWithoutId)` (créer userWithoutId AVANT getData)
- Test "Should keep other orders when cancelling one" (ligne 174): `getData(user)`

---

## Fix 2: director-manage-update.test.ts

### Modifications:

1. **Remplacer l'import** (ligne 8):
```ts
// AVANT:
import { InMemoryUserRepository, JwtSecurityService, JwtTokenService } from '@pp-clca-pcm/adapters';

// APRES:
import { InMemoryUserRepository } from '@pp-clca-pcm/adapters';
```

2. **Ajouter l'import Security**:
```ts
import { Security } from '@pp-clca-pcm/application';
```

3. **Ajouter la classe MockSecurity** après les imports:
```ts
class MockSecurity implements Security {
  constructor(private currentUser: User | null) {}
  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }
}
```

4. **Modifier getData()** pour utiliser MockSecurity:
```ts
const getData = (currentUser: User | null) => {
  const userRepository = new InMemoryUserRepository();
  const security = new MockSecurity(currentUser);
  const useCase = new DirectorManageUpdate(userRepository, security);

  return {
    useCase,
    userRepository,
  };
};
```

5. **Modifier les tests**:
- Test "Should update client successfully": créer d'abord director et client, puis `getData(director)`
- Test "Should return NotDirector error": `getData(client)` avec un client non-director
