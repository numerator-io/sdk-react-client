import { useMockNumeratorProvider, mockFlags, resetNumeratorMocks, addMockedFlag, removeMockedFlag } from '@/jest-mock';

describe('main', () => {
  beforeEach(() => {
    resetNumeratorMocks();
  });

  test('mock correctly', async () => {
    // Mocking flags
    const mockFlag = {
      key: 'dev-test-flag',
      value: true,
      context: {},
    };
    mockFlags([mockFlag]);

    // Mocking NumeratorProvider
    const { getFeatureFlag } = useMockNumeratorProvider();

    // Calling booleanFlagVariationDetail to check if the flag is mocked correctly
    const devTestFlagValue = await getFeatureFlag('dev-test-flag', false);

    // Assertion
    expect(devTestFlagValue).toBe(true);
  });

  test('reset mock correctly', async () => {
    // Mocking flags
    const mockFlag = {
      key: 'dev-test-flag',
      value: true,
      context: {},
    };
    mockFlags([mockFlag]);

    // Mocking NumeratorProvider
    const { getFeatureFlag } = useMockNumeratorProvider();

    // Calling booleanFlagVariationDetail to check if the flag is mocked correctly
    let devTestFlagValue = await getFeatureFlag('dev-test-flag', false);

    // Assertion
    expect(devTestFlagValue).toBe(true);

    resetNumeratorMocks();
    devTestFlagValue = await getFeatureFlag('dev-test-flag', false);

    expect(devTestFlagValue).toBe(false);
  });

  test('mock correctly with different context - mockFlag', async () => {
    // Mocking flags
    const mockFlag1 = {
      key: 'dev-test-flag',
      value: 'one',
      context: { env: 'dev' },
    };
    const mockFlag2 = {
      key: 'dev-test-flag',
      value: 'two',
      context: { env: 'prod' },
    };
    mockFlags([mockFlag1, mockFlag2]);

    // Mocking NumeratorProvider
    const { getFeatureFlag } = useMockNumeratorProvider({ defaultContext: { env: 'dev' } });

    // Calling booleanFlagVariationDetail to check if the flag is mocked correctly
    let devTestFlagValue = await getFeatureFlag('dev-test-flag', 'default');

    // Assertion
    expect(devTestFlagValue).toEqual('one');

    devTestFlagValue = await getFeatureFlag('dev-test-flag', 'default', { env: 'prod' });

    // Assertion
    expect(devTestFlagValue).toEqual('two');
  });

  test('mock correctly with different context - Add mock flag', async () => {
    // Mocking flags
    const mockFlag1 = {
      key: 'dev-test-flag',
      value: 'one',
      context: { env: 'dev' },
    };

    mockFlags([mockFlag1]);

    // Mocking NumeratorProvider
    const { getFeatureFlag } = useMockNumeratorProvider({ defaultContext: { env: 'dev' } });

    // Calling booleanFlagVariationDetail to check if the flag is mocked correctly
    let devTestFlagValue = await getFeatureFlag('dev-test-flag', 'default');

    // Assertion
    expect(devTestFlagValue).toEqual('one');

    const mockFlag2 = {
      key: 'dev-test-flag',
      value: 'two',
      context: { env: 'prod' },
    };

    addMockedFlag(mockFlag2);

    devTestFlagValue = await getFeatureFlag('dev-test-flag', 'default', { env: 'prod' });

    // Assertion
    expect(devTestFlagValue).toEqual('two');
  });

  test('mock correctly with different context - Remove mock flag', async () => {
    // Mocking flags
    const mockFlag1 = {
      key: 'dev-test-flag',
      value: 'one',
      context: { env: 'dev' },
    };
    const mockFlag2 = {
      key: 'dev-test-flag',
      value: 'two',
      context: { env: 'prod' },
    };
    mockFlags([mockFlag1, mockFlag2]);

    // Mocking NumeratorProvider
    const { getFeatureFlag } = useMockNumeratorProvider({ defaultContext: { env: 'dev' } });

    // Calling booleanFlagVariationDetail to check if the flag is mocked correctly
    let devTestFlagValue = await getFeatureFlag('dev-test-flag', 'default');

    // Assertion
    expect(devTestFlagValue).toEqual('one');

    removeMockedFlag('dev-test-flag', { env: 'prod' });

    devTestFlagValue = await getFeatureFlag('dev-test-flag', 'default', { env: 'prod' });

    // Assertion
    expect(devTestFlagValue).toEqual('default');
  });

  test('mock correctly - booleanFlagVariationDetail', async () => {
    // Mocking flags
    const mockFlag = {
      key: 'dev-test-flag',
      value: true,
      context: {},
    };
    mockFlags([mockFlag]);

    // Mocking NumeratorProvider
    const { booleanFlagVariationDetail } = useMockNumeratorProvider();

    // Calling booleanFlagVariationDetail to check if the flag is mocked correctly
    const devTestFlag = await booleanFlagVariationDetail('dev-test-flag', false);

    // Assertion
    expect(devTestFlag.value).toBe(true);
  });
});
