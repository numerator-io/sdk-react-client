import { render, waitFor, screen } from '@testing-library/react';
import {
  NumeratorClient,
  NumeratorProvider,
  useNumeratorContext,
  FeatureFlagConfig,
  FlagStatusEnum,
  FlagValueTypeEnum,
  ConfigClient,
  FlagVariationValue,
} from '../../main';
import { useEffect } from 'react';

// Mock NumeratorClient
jest.mock('../../main/client');

describe('NumeratorProvider', () => {
  const mockConfig: ConfigClient = {
    apiKey: 'test-api-key',
    baseUrl: 'https://example.com/api',
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  // Add this test within the same 'describe' block
  it('fetches featureFlagValue by key', async () => {
    const mockFeatureFlagValue: FlagVariationValue = {
      key: 'feature1',
      status: FlagStatusEnum.ON,
      value: { booleanValue: true },
      valueType: FlagValueTypeEnum.BOOLEAN,
    };
    (NumeratorClient.prototype.allFeatureFlagsConfig as jest.Mock).mockResolvedValueOnce([]);
    (NumeratorClient.prototype.getFeatureFlagByKey as jest.Mock).mockResolvedValueOnce(mockFeatureFlagValue);

    // Render NumeratorProvider with a component that consumes the context
    const ConsumerComponent = () => {
      const { featureFlagsValue, fetchFeatureFlagValue } = useNumeratorContext();

      useEffect(() => {
        fetchFeatureFlagValue({ context: { userId: 123 }, key: 'feature1' });
      }, []);

      return (
        <div>
          <h1>Feature Flags Value:</h1>
          <ul>
            {Object.values(featureFlagsValue).map((flag) => (
              <li key={flag.key} data-testid={flag.key}>
                {flag.key}
              </li>
            ))}
          </ul>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.getFeatureFlagByKey).toHaveBeenCalledWith({
        context: { userId: 123 },
        key: 'feature1',
      });
      expect(screen.getByTestId('feature1')).toBeDefined();
    });
  });
});
