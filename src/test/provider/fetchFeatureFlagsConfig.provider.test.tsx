import { render, waitFor, screen } from '@testing-library/react';
import {
  NumeratorClient,
  NumeratorProvider,
  useNumeratorContext,
  FlagStatusEnum,
  FlagValueTypeEnum,
  ConfigClient,
  FeatureFlagConfig,
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
    const mockFeatureFlags: FeatureFlagConfig[] = [
      {
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
      },
      {
        id: '2',
        name: 'Feature 2',
        key: 'feature2',
        organizationId: 'org1',
        projectId: 'proj1',
        status: FlagStatusEnum.OFF,
        defaultOnVariationId: 'var3',
        defaultOffVariationId: 'var4',
        valueType: FlagValueTypeEnum.STRING,
        createdAt: new Date(),
      },
    ];
    (NumeratorClient.prototype.allFeatureFlagsConfig as jest.Mock).mockResolvedValueOnce(mockFeatureFlags);
    (NumeratorClient.prototype.featureFlagConfigByKey as jest.Mock).mockResolvedValueOnce(mockFeatureFlags[0]);

    // Render NumeratorProvider with a component that consumes the context
    const ConsumerComponent = () => {
      const { featureFlagsConfig, fetchFeatureFlagConfig } = useNumeratorContext();

      useEffect(() => {
        fetchFeatureFlagConfig({ key: mockFeatureFlags[0].key });
      }, []);

      return (
        <div>
          <h1>Feature Flags:</h1>
          <ul>
            {Object.values(featureFlagsConfig).map((flag) => (
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
      expect(NumeratorClient.prototype.featureFlagConfigByKey).toHaveBeenCalledWith('feature1');
      expect(screen.getByTestId('feature1')).toBeDefined();
    });
  });
});
