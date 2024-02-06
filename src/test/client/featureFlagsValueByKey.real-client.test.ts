import { NumeratorClient } from '../../main';
import { FeatureFlagValue, FlagStatusEnum, FlagValueTypeEnum, VariationValue } from '../../main/client/type.client';

describe('NumeratorClient', () => {
  // config
  const config = {
    apiKey: 'NUM.2SaExBpIwLBtSf9AAxS5MA==.xZ+MEpxS6+9Sz1YoZi9xgvFUNkAvLnUraH++Pf9j75SO5mPBeq9dGFb4k60FvWVK',
    baseUrl: 'https://service-platform.dev.numerator.io',
  };

  describe('featureFlagValueByKey', () => {
    it('should fetch featureFlagValueByKey successfully', async () => {
      // Mock ApiClient's request method to resolve with mock data
      const data: FeatureFlagValue<VariationValue> = {
        key: 'feature1',
        status: FlagStatusEnum.ON,
        value: { longValue: 111 },
        valueType: FlagValueTypeEnum.LONG,
      };

      const response: FeatureFlagValue<number> = {
        key: 'feature1',
        status: FlagStatusEnum.ON,
        value: 111,
        valueType: FlagValueTypeEnum.LONG,
      };

      const numeratorClient = new NumeratorClient(config);
      const result = await numeratorClient.featureFlagValueByKey({
        key: 'feature1',
        context: {
          userId: 'user123',
        },
      });

      expect(result).toEqual(response);
    });
  });
});
