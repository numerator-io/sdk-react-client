import { render, waitFor, screen } from '@testing-library/react';
import { NumeratorProvider, useNumeratorContext, ConfigClient, NumeratorClient } from '../../main';

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

  it('loads feature flags value on mount based on loadFeatureFlagsValueOnMount prop', async () => {
    // Define the loadFeatureFlagsValueOnMount
    const loadFeatureFlagsValueOnMount = {
      featureFlagKey1: { userId: 1 },
      featureFlagKey2: { companyId: 42 },
    };

    // Mock featureFlagValue response from NumeratorClient
    const mockFeatureFlagValues = {
      featureFlagKey1: {
        key: 'featureFlagKey1',
        value: 'someValue1',
        status: 'ON',
        createdAt: new Date(),
      },
      featureFlagKey2: {
        key: 'featureFlagKey2',
        value: 'someValue2',
        status: 'OFF',
        createdAt: new Date(),
      },
    };

    (NumeratorClient.prototype.featureFlagValueByKey as jest.Mock).mockImplementation(async ({ key }) => {
      if (key === 'featureFlagKey1') {
        return mockFeatureFlagValues.featureFlagKey1;
      }
      return mockFeatureFlagValues.featureFlagKey2;
    });

    const ConsumerComponent = () => {
      const { featureFlagsValue } = useNumeratorContext();
      return (
        <div>
          <h1>Feature Flags Values:</h1>
          <ul>
            {Object.values(featureFlagsValue).map((flag) => (
              <li key={flag.key} data-testid={flag.key}>
                {flag.key}: {flag.status} - {flag.value}
              </li>
            ))}
          </ul>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} loadFeatureFlagsValueOnMount={loadFeatureFlagsValueOnMount}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    await waitFor(() => {
      expect(NumeratorClient.prototype.featureFlagValueByKey).toHaveBeenCalledTimes(2);
      expect(screen.getByTestId('featureFlagKey1')).toBeDefined();
      expect(screen.getByTestId('featureFlagKey2')).toBeDefined();
    });
  });
});
