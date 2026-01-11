import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';

/**
 * Type générique d'un delegate Prisma mocké
 */
type PrismaDelegateMock = {
  findUnique?: Mock;
  findFirst?: Mock;
  findMany?: Mock;
  create?: Mock;
  update?: Mock;
  delete?: Mock;
};

/**
 * Type public du mock Prisma
 * ✅ aucun type interne à jest-mock n'est exposé
 */
export type PrismaMock = {
  user?: PrismaDelegateMock;
  account?: PrismaDelegateMock;
  portfolio?: PrismaDelegateMock;
  transaction?: PrismaDelegateMock;
  notification?: PrismaDelegateMock;
};

/**
 * Mock minimal mais extensible du PrismaClient
 * On ne mock QUE ce que l'application utilise.
 */
export const prisma: PrismaMock = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },

  account: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },

  portfolio: {
    findMany: jest.fn(),
    create: jest.fn(),
  },

  transaction: {
    create: jest.fn(),
    findMany: jest.fn(),
  },

  notification: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

/**
 * Mock de la classe PrismaClient
 * Utile si ton code fait `new PrismaClient()`
 */
export class PrismaClient {
  constructor() {
    return prisma as any;
  }

  $connect = jest.fn();
  $disconnect = jest.fn();
  $transaction = jest.fn((cb: any) => cb(prisma));
}

/**
 * Types exportés pour compatibilité
 * (optionnel mais pratique)
 */
export const Prisma = {
  TransactionIsolationLevel: {},
};

/**
 * Enum placeholder si besoin
 */
export const $Enums = {};

export default prisma;