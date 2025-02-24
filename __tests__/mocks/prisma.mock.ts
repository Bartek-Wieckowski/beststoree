import { PrismaClient } from '@prisma/client';
import { beforeEach, vi } from 'vitest';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';

export type Context = {
  prisma: PrismaClient;
};

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>;
};

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  };
};

export let mockCtx: MockContext;
export let prismaMock: DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockCtx = createMockContext();
  prismaMock = mockCtx.prisma;
  mockReset(prismaMock);
});

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => prismaMock),
})); 