import { mockNumeratorProvider, mockFlags } from '@/jest-mock';

describe('main', () => {
  test('mock correctly', async () => {
    // Mocking flags
    const mockFlag = {
      key: 'dev-test-flag',
      value: true,
      context: {},
    };
    mockFlags([mockFlag]);

    // Mocking NumeratorProvider
    const { booleanFlagVariationDetail } = mockNumeratorProvider();

    // Calling booleanFlagVariationDetail to check if the flag is mocked correctly
    const devTestFlag = await booleanFlagVariationDetail('dev-test-flag', false, {}, true);

    // Assertion
    expect(devTestFlag.value).toBe(true);
  });
});
