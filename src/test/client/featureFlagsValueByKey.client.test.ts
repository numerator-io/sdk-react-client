import { NumeratorClient } from '@/client';
import { FlagVariationValue, FlagStatusEnum, FlagValueTypeEnum, VariationValue } from '@/client/type.client';

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

  describe('featureFlagValueByKey', () => {
    it('should fetch featureFlagValueByKey successfully', async () => {
      // Mock ApiClient's request method to resolve with mock data
      const data: FlagVariationValue = {
        key: 'feature1',
        status: FlagStatusEnum.ON,
        value: { longValue: 555 },
        valueType: FlagValueTypeEnum.LONG,
      };

      const response: FlagVariationValue = {
        key: 'feature1',
        status: FlagStatusEnum.ON,
        value: { longValue: 555 },
        valueType: FlagValueTypeEnum.LONG,
      };

      (ApiClient.prototype.request as jest.Mock).mockResolvedValueOnce({
        data,
        error: undefined,
      });

      const numeratorClient = new NumeratorClient(mockConfig);
      const result = await numeratorClient.getFeatureFlagByKey({
        key: 'feature1',
        context: {
          userId: 'user123',
        },
      });

      expect(result).toEqual(response);
    });

    it('should handle error while fetching featureFlagValueByKey', async () => {
      // Mock ApiClient's request method to reject with an error
      const error = { message: 'Error fetching featureFlagValueByKey', errorCode: 'fetch_error', errorStatus: 500 };
      (ApiClient.prototype.request as jest.Mock).mockResolvedValueOnce({
        data: undefined,
        error,
      });

      const numeratorClient = new NumeratorClient(mockConfig);

      // Assert that the error is thrown
      await expect(
        numeratorClient.getFeatureFlagByKey({
          key: 'feature1',
          context: {
            userId: 'user123',
          },
        }),
      ).rejects.toMatchObject(error);
    });

    it('should handle "Feature Flag not found" error', async () => {
      // Mock ApiClient's request method to resolve with no data
      (ApiClient.prototype.request as jest.Mock).mockResolvedValueOnce({
        data: undefined,
        error: undefined,
      });

      const numeratorClient = new NumeratorClient(mockConfig);

      // Assert that the "Feature Flag not found" error is thrown
      await expect(
        numeratorClient.getFeatureFlagByKey({
          key: 'feature1',
          context: {
            userId: 'user123',
          },
        }),
      ).rejects.toMatchObject({
        message: 'Feature Flag not found',
        errorCode: 'FEATURE_FLAG_NOT_FOUND',
        errorStatus: 404,
      });
    });
  });
});
