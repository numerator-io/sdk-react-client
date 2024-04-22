import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    verbose: true,
    transform: {
      '\\.[jt]sx?$': 'ts-jest',
    },
    setupFiles: ['<rootDir>/setup.jest.ts'],
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/main/$1',
    },
  };
};
