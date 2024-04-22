import { NumeratorClient } from '@/client';
import { FeatureFlagConfig, FlagStatusEnum, FlagValueTypeEnum } from '@/client/type.client';

// Mock ApiClient
jest.mock('@/client/api.client');

describe('NumeratorClient', () => {
  // Mock config
  const mockConfig = {
    apiKey: 'testApiKey',
    baseUrl: 'https://testBaseUrl',
  };

  // Mock ApiClient
  jest.mock('@/client/api.client');
  const ApiClient = require('@/client/api.client').ApiClient;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('featureFlagConfigByKey', () => {
    it('should fetch featureFlagConfigByKey successfully', async () => {
      // Mock ApiClient's request method to resolve with mock data
      const data: FeatureFlagConfig = {
        id: '839cf222-1dc2-4aea-ad1a-46567862b3ab',
        name: 'Feature 1',
        key: 'feature1',
        organizationId: 'org123',
        projectId: 'proj123',
        status: FlagStatusEnum.ON,
        description: 'Feature description',
        defaultOnVariationId: 'on123',
        defaultOffVariationId: 'off123',
        valueType: FlagValueTypeEnum.BOOLEAN,
        createdAt: new Date(),
      };
      (ApiClient.prototype.request as jest.Mock).mockResolvedValueOnce({
        data,
        error: undefined,
      });

      const numeratorClient = new NumeratorClient(mockConfig);
      const result = await numeratorClient.featureFlagConfigByKey('feature1');

      expect(result).toEqual(data);
    });

    it('should handle error while fetching featureFlagConfigByKey', async () => {
      // Mock ApiClient's request method to reject with an error
      const error = { message: 'Error fetching featureFlagConfigByKey', errorCode: 'fetch_error', errorStatus: 500 };
      (ApiClient.prototype.request as jest.Mock).mockResolvedValueOnce({
        data: undefined,
        error,
      });

      const numeratorClient = new NumeratorClient(mockConfig);

      // Assert that the error is thrown
      await expect(numeratorClient.featureFlagConfigByKey('feature1')).rejects.toMatchObject(error);
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
});
