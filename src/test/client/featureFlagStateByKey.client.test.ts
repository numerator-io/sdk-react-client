import { NumeratorClient } from '../../main';
import { FeatureFlagValue, FlagStatusEnum, FlagValueTypeEnum } from '../../main/client/type.client';

// Mock ApiClient
jest.mock('../../main/client/api.client');

describe('NumeratorClient', () => {
  // Mock config
  const mockConfig = {
    apiKey: 'testApiKey',
    baseUrl: 'https://testBaseUrl',
  };

  // Mock ApiClient
  jest.mock('../../main/client/api.client');
  const ApiClient = require('../../main/client/api.client').ApiClient;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('featureFlagValueByKey', () => {
    it('should fetch featureFlagValueByKey successfully', async () => {
      // Mock ApiClient's request method to resolve with mock data
      const data: FeatureFlagValue<boolean> = {
        key: 'feature1',
        status: FlagStatusEnum.ON,
        value: true,
        valueType: FlagValueTypeEnum.BOOLEAN,
      };
      (ApiClient.prototype.request as jest.Mock).mockResolvedValueOnce({
        data,
        error: undefined,
      });

      const numeratorClient = new NumeratorClient(mockConfig);
      const result = await numeratorClient.featureFlagValueByKey({
        key: 'feature1',
        context: {
          userId: 'user123',
        },
      });

      expect(result).toEqual(data);
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
        numeratorClient.featureFlagValueByKey({
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
        numeratorClient.featureFlagValueByKey({
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
