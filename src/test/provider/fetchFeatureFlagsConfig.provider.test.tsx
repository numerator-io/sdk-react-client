import { render, waitFor, screen } from '@testing-library/react';
import {
  NumeratorClient,
  NumeratorProvider,
  useNumeratorContext,
  FlagStatusEnum,
  FlagValueTypeEnum,
  ConfigClient,
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
  it('fetches featureFlagConfig by key', async () => {
    const mockFeatureFlag = {
      id: '1',
      name: 'Feature 1',
      key: 'feature1',
      organizationId: 'org1',
      projectId: 'proj1',
      status: FlagStatusEnum.ON,
      defaultOnVariationId: 'var1',
      defaultOffVariationId: 'var2',
      valueType: FlagValueTypeEnum.BOOLEAN,
      createdAt: new Date(),
    };
    (NumeratorClient.prototype.featureFlags as jest.Mock).mockResolvedValueOnce({ data: [mockFeatureFlag] });
    (NumeratorClient.prototype.featureFlagByKey as jest.Mock).mockResolvedValueOnce(mockFeatureFlag);

    // Render NumeratorProvider with a component that consumes the context
    const ConsumerComponent = () => {
      const { featureFlagsConfig, fetchFeatureFlagsConfigBy } = useNumeratorContext();

      useEffect(() => {
        fetchFeatureFlagsConfigBy({ key: mockFeatureFlag.key });
      }, []);

      return (
        <div>
          <h1>Feature Flags:</h1>
          <ul>
            {Object.values(featureFlagsConfig).map((flag) => (
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
      expect(NumeratorClient.prototype.featureFlagByKey).toHaveBeenCalledWith('feature1');
      expect(screen.getByTestId('feature1')).toBeDefined();
    });
  });
});
