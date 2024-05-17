import { stringify } from 'querystring';
import { NumeratorClient } from '@/client';
import { FlagCollection, FlagValueTypeEnum } from '@/client/type.client';

// Mock ApiClient
jest.mock('@/client/api.client');

// Mock setInterval and clearInterval
jest.spyOn(global, 'clearInterval');
jest.spyOn(global, 'setInterval');

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

  describe('featureFlagPolling', () => {
    it('should fetch featureFlagPolling successfully', async () => {
      // Mock ApiClient's request method to resolve with mock data
      const data: FlagCollection[] = [
        {
          key: 'feature1',
          value: { stringValue: 'test value' },
          valueType: FlagValueTypeEnum.STRING,
        },
      ];

      const response = {
        data: {
          flags: [
            {
              key: 'feature1',
              value: { stringValue: 'test value' },
              valueType: FlagValueTypeEnum.STRING,
            },
          ],
        },
        headers: {
          eTag: 'someEtag',
        },
      };

      (ApiClient.prototype.request as jest.Mock).mockResolvedValueOnce(response);

      const numeratorClient = new NumeratorClient(mockConfig);
      const result = await numeratorClient.fetchPollingFlag({ userId: 'user123' });
      expect(result.flags?.toString()).toEqual(data.toString());
    });
    it('should fetch featureFlagPolling fail', async () => {
      const error = { message: 'Error fetching featureFlagCollectionPolling', errorCode: 'fetch_error', errorStatus: 500 };
      (ApiClient.prototype.request as jest.Mock).mockResolvedValueOnce({
        data: undefined,
        error,
      });

      const numeratorClient = new NumeratorClient(mockConfig);
      await expect(numeratorClient.fetchPollingFlag({ userId: 'user123' })).rejects.toMatchObject(error);
    });
  });
});
