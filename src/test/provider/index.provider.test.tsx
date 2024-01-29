import { render, waitFor, screen } from '@testing-library/react';
import {
  NumeratorClient,
  NumeratorProvider,
  useNumeratorContext,
  FeatureFlag,
  FlagStatusEnum,
  FlagValueTypeEnum,
  ConfigClient,
} from '../../main';

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

  it('fetches featureFlagsConfig on mount', async () => {
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlags: FeatureFlag[] = [
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

    (NumeratorClient.prototype.featureFlags as jest.Mock).mockResolvedValueOnce({ data: mockFeatureFlags });

    // Render NumeratorProvider with a component that consumes the context
    const ConsumerComponent = () => {
      const { featureFlagsConfig, fetchFeatureFlagsConfig } = useNumeratorContext();

      return (
        <div>
          <h1>Feature Flags:</h1>
          <ul>
            {Object.values(featureFlagsConfig).map((flag) => (
              <li data-testid={flag.key}>{flag.name}</li>
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
      expect(NumeratorClient.prototype.featureFlags).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('feature1')).toBeDefined();
      expect(screen.getByTestId('feature2')).toBeDefined();
    });
  });
});
