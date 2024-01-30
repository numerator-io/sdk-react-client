import { ConfigClient, NumeratorClient } from '../../main';
import ApiClient from '../../main/client/api.client';

// Mocking ApiClient
jest.mock('../../main/client/api.client');

describe('NumeratorClient', () => {
  const mockConfig: ConfigClient = {
    apiKey: 'test-api-key',
    baseUrl: 'https://example.com/api',
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch featureFlags successfully', async () => {
    // Mock ApiClient's request method to resolve with mock data
    (ApiClient.prototype.request as jest.Mock).mockResolvedValueOnce({
      data: { count: 2, data: [{ key: 'feature1' }, { key: 'feature2' }] },
      error: undefined,
    });

    const numeratorClient = new NumeratorClient(mockConfig);
    const result = await numeratorClient.allFeatureFlagsConfig();

    expect(result).toEqual([{ key: 'feature1' }, { key: 'feature2' }]);
  });

  it('should handle error while fetching featureFlags', async () => {
    // Mock ApiClient's request method to reject with an error
    const error = { message: 'Error fetching featureFlags', errorCode: 'fetch_error', errorStatus: 500 };
    (ApiClient.prototype.request as jest.Mock).mockResolvedValueOnce({
      data: undefined,
      error,
    });

    const numeratorClient = new NumeratorClient(mockConfig);

    // Assert that the error is thrown
    await expect(numeratorClient.allFeatureFlagsConfig()).rejects.toMatchObject(error);
  });

  it('should handle "Feature Flag not found" error', async () => {
    // Mock ApiClient's request method to resolve with no data
    (ApiClient.prototype.request as jest.Mock).mockResolvedValueOnce({
      data: undefined,
      error: undefined,
    });

    const numeratorClient = new NumeratorClient(mockConfig);

    // Assert that the "Feature Flag not found" error is thrown
    await expect(numeratorClient.featureFlagConfigByKey('feature1')).rejects.toMatchObject({
      message: 'Feature Flag not found',
      errorCode: 'FEATURE_FLAG_NOT_FOUND',
      errorStatus: 404,
    });
  });
});
