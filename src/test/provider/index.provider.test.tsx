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
  FlagEvaluationDetail,
} from '../../main';
import { useEffect, useState } from 'react';

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

  it('fetch all flags on mount', async () => {
    // Mock featureFlags response from NumeratorClient
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

    // Render NumeratorProvider with a component that consumes the context
    const ConsumerComponent = () => {
      const { featureFlags } = useNumeratorContext();
      const [flags, setFlags] = useState<FeatureFlagConfig[]>()

      useEffect(() => {
          const fetchData = async () => {
            let res = await  featureFlags()
            setFlags(res)
          }
          fetchData()
      }, [])

      return (
        <div>
          <h1>Feature Flags:</h1>
          <ul>
            {!!flags && Object.values(flags).map((flag) => (
              <li key={flag.key} data-testid={flag.key}>{flag.name}</li>
            ))}
          </ul>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{platform: 'ios'}}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.allFeatureFlagsConfig).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('feature1')).toBeDefined();
      expect(screen.getByTestId('feature2')).toBeDefined();
    });
  });


  it('fetch boolean flag variation', async () => {
    // Mock featureFlags response from NumeratorClient
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
      const { booleanFlagVariationDetail } = useNumeratorContext();
      const [flag, setFlag] = useState<FlagEvaluationDetail<boolean>>()

      useEffect(() => {
          const fetchData = async () => {
            let res = await  booleanFlagVariationDetail('feature1', false, {platform: 'android'})
            setFlag(res)
          }
          fetchData()
      }, [])

      return (
        <div>
          <h1>Feature Flags:</h1>
          <p key={flag?.key} data-testid={flag?.key}>{String(flag?.value)}</p>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{platform: 'ios'}}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.getFeatureFlagByKey).toHaveBeenCalledWith({
        key: 'feature1',
        context: {platform: 'android'}
      })
      expect(screen.getByTestId('feature1').textContent).toBe('true')
    });
  });

  it('fetch string flag variation', async () => {
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagValue: FlagVariationValue = {
      key: 'feature1',
      status: FlagStatusEnum.ON,
      value: { stringValue: 'test value' },
      valueType: FlagValueTypeEnum.STRING,
    };
    (NumeratorClient.prototype.allFeatureFlagsConfig as jest.Mock).mockResolvedValueOnce([]);
    (NumeratorClient.prototype.getFeatureFlagByKey as jest.Mock).mockResolvedValueOnce(mockFeatureFlagValue);

    // Render NumeratorProvider with a component that consumes the context
    const ConsumerComponent = () => {
      const { stringFlagVariationDetail } = useNumeratorContext();
      const [flag, setFlag] = useState<FlagEvaluationDetail<string>>()

      useEffect(() => {
          const fetchData = async () => {
            let res = await  stringFlagVariationDetail('feature1', 'demo', {platform: 'android'})
            setFlag(res)
          }
          fetchData()
      }, [])

      return (
        <div>
          <h1>Feature Flags:</h1>
          <p key={flag?.key} data-testid={flag?.key}>{flag?.value}</p>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{platform: 'ios'}}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.getFeatureFlagByKey).toHaveBeenCalledWith({
        key: 'feature1',
        context: {platform: 'android'}
      })
      expect(screen.getByTestId('feature1').textContent).toBe('test value')
    });
  });

  it('fetch long flag variation', async () => {
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagValue: FlagVariationValue = {
      key: 'feature1',
      status: FlagStatusEnum.ON,
      value: { longValue: 555 },
      valueType: FlagValueTypeEnum.LONG,
    };
    (NumeratorClient.prototype.allFeatureFlagsConfig as jest.Mock).mockResolvedValueOnce([]);
    (NumeratorClient.prototype.getFeatureFlagByKey as jest.Mock).mockResolvedValueOnce(mockFeatureFlagValue);

    // Render NumeratorProvider with a component that consumes the context
    const ConsumerComponent = () => {
      const { numberFlagVariationDetail: numberFlagVariation } = useNumeratorContext();
      const [flag, setFlag] = useState<FlagEvaluationDetail<number>>()

      useEffect(() => {
          const fetchData = async () => {
            let res = await  numberFlagVariation('feature1', 123, {platform: 'android'})
            setFlag(res)
          }
          fetchData()
      }, [])

      return (
        <div>
          <h1>Feature Flags:</h1>
          <p key={flag?.key} data-testid={flag?.key}>{String(flag?.value)}</p>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{platform: 'ios'}}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.getFeatureFlagByKey).toHaveBeenCalledWith({
        key: 'feature1',
        context: {platform: 'android'}
      })
      expect(screen.getByTestId('feature1').textContent).toBe('555')
    });
  });


  it('fetch double flag variation', async () => {
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagValue: FlagVariationValue = {
      key: 'feature1',
      status: FlagStatusEnum.ON,
      value: { doubleValue: 10.73 },
      valueType: FlagValueTypeEnum.DOUBLE,
    };
    (NumeratorClient.prototype.allFeatureFlagsConfig as jest.Mock).mockResolvedValueOnce([]);
    (NumeratorClient.prototype.getFeatureFlagByKey as jest.Mock).mockResolvedValueOnce(mockFeatureFlagValue);

    // Render NumeratorProvider with a component that consumes the context
    const ConsumerComponent = () => {
      const { numberFlagVariationDetail } = useNumeratorContext();
      const [flag, setFlag] = useState<FlagEvaluationDetail<number>>()

      useEffect(() => {
          const fetchData = async () => {
            let res = await  numberFlagVariationDetail('feature1', 1.23, {platform: 'android'})
            setFlag(res)
          }
          fetchData()
      }, [])

      return (
        <div>
          <h1>Feature Flags:</h1>
          <p key={flag?.key} data-testid={flag?.key}>{String(flag?.value)}</p>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{platform: 'ios'}}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.getFeatureFlagByKey).toHaveBeenCalledWith({
        key: 'feature1',
        context: {platform: 'android'}
      })
      expect(screen.getByTestId('feature1').textContent).toBe('10.73')
    });
  });


  it('fetch string flag value', async () => {
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagValue: FlagVariationValue = {
      key: 'feature1',
      status: FlagStatusEnum.ON,
      value: { stringValue: 'test value' },
      valueType: FlagValueTypeEnum.STRING,
    };
    (NumeratorClient.prototype.allFeatureFlagsConfig as jest.Mock).mockResolvedValueOnce([]);
    (NumeratorClient.prototype.getFeatureFlagByKey as jest.Mock).mockResolvedValueOnce(mockFeatureFlagValue);

    // Render NumeratorProvider with a component that consumes the context
    const ConsumerComponent = () => {
      const { initFeatureFlag, getFeatureFlag } = useNumeratorContext();
      const [flagValue, setFlagValue] = useState<any>()

      useEffect(() => {
          const fetchData = async () => {
            initFeatureFlag('feature1', 'demo')
            const res = await getFeatureFlag('feature1')
            setFlagValue(res)
          }
          fetchData()
      }, [])

      return (
        <div>
          <h1>Feature Flags:</h1>
          <p key='demo' data-testid='demo'>{String(flagValue)}</p>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{platform: 'ios'}}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.getFeatureFlagByKey).toHaveBeenCalledWith({
        key: 'feature1',
        context: {platform: 'ios'}
      })
      expect(screen.getByTestId('demo').textContent).toBe('test value')
    });
  });
  
});
