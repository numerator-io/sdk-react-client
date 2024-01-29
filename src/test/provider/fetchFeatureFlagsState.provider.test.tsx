import { render, waitFor, screen } from '@testing-library/react';
import {
  NumeratorClient,
  NumeratorProvider,
  useNumeratorContext,
  FeatureFlag,
  FlagStatusEnum,
  FlagValueTypeEnum,
  ConfigClient,
  FeatureFlagState,
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
  it('fetches featureFlagState by key', async () => {
    const mockFeatureFlagState: FeatureFlagState<boolean> = {
      key: 'feature1',
      status: FlagStatusEnum.ON,
      value: true,
      valueType: FlagValueTypeEnum.BOOLEAN,
    };
    (NumeratorClient.prototype.featureFlags as jest.Mock).mockResolvedValueOnce({ data: [] });
    (NumeratorClient.prototype.featureFlagStateByKey as jest.Mock).mockResolvedValueOnce(mockFeatureFlagState);

    // Render NumeratorProvider with a component that consumes the context
    const ConsumerComponent = () => {
      const { featureFlagsState, fetchFeatureFlagState } = useNumeratorContext();

      useEffect(() => {
        fetchFeatureFlagState({ context: { userId: 123 }, key: 'feature1' });
      }, []);

      return (
        <div>
          <h1>Feature Flags State:</h1>
          <ul>
            {Object.values(featureFlagsState).map((flag) => (
              <li data-testid={flag.key}>{flag.key}</li>
            ))}
          </ul>
        </div>
      );
    };

    render(
      <NumeratorProvider>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.featureFlagStateByKey).toHaveBeenCalledWith({ context: { userId: 123 }, key: 'feature1' });
      expect(screen.getByTestId('feature1')).toBeDefined();
    });
  });
});
