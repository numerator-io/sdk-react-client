import { useEffect, useState } from 'react';
import { render, waitFor, screen, act, fireEvent } from '@testing-library/react';

import { NumeratorClient } from '@/client';
import {
  FlagEvaluationDetail,
  FlagValueTypeEnum,
  FlagStatusEnum,
  ConfigClient,
  ErrorResponse,
  FeatureFlagConfig,
  FlagVariationValue,
} from '@/client/type.client';
import { NumeratorProvider, useNumeratorContext } from '@/provider';

// Mock NumeratorClient
jest.mock('@/client');

jest.useFakeTimers();
jest.spyOn(global, 'setInterval');

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
      const [flags, setFlags] = useState<FeatureFlagConfig[]>();

      useEffect(() => {
        const fetchData = async () => {
          let res = await featureFlags();
          setFlags(res);
        };
        fetchData();
      }, []);

      return (
        <div>
          <h1>Feature Flags:</h1>
          <ul>
            {!!flags &&
              Object.values(flags).map((flag) => (
                <li key={flag.key} data-testid={flag.key}>
                  {flag.name}
                </li>
              ))}
          </ul>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{ platform: 'ios' }}>
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
      const [flag, setFlag] = useState<FlagEvaluationDetail<boolean>>();

      useEffect(() => {
        const fetchData = async () => {
          let res = await booleanFlagVariationDetail('feature1', false, { platform: 'android' });
          setFlag(res);
        };
        fetchData();
      }, []);

      return (
        <div>
          <h1>Feature Flags:</h1>
          <p key={flag?.key} data-testid={flag?.key}>
            {String(flag?.value)}
          </p>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{ platform: 'ios' }}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.getFeatureFlagByKey).toHaveBeenCalledWith({
        key: 'feature1',
        context: { platform: 'android' },
      });
      expect(screen.getByTestId('feature1').textContent).toBe('true');
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
      const [flag, setFlag] = useState<FlagEvaluationDetail<string>>();

      useEffect(() => {
        const fetchData = async () => {
          let res = await stringFlagVariationDetail('feature1', 'demo', { platform: 'android' });
          setFlag(res);
        };
        fetchData();
      }, []);

      return (
        <div>
          <h1>Feature Flags:</h1>
          <p key={flag?.key} data-testid={flag?.key}>
            {flag?.value}
          </p>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{ platform: 'ios' }}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.getFeatureFlagByKey).toHaveBeenCalledWith({
        key: 'feature1',
        context: { platform: 'android' },
      });
      expect(screen.getByTestId('feature1').textContent).toBe('test value');
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
      const [flag, setFlag] = useState<FlagEvaluationDetail<number>>();

      useEffect(() => {
        const fetchData = async () => {
          let res = await numberFlagVariation('feature1', 123, { platform: 'android' });
          setFlag(res);
        };
        fetchData();
      }, []);

      return (
        <div>
          <h1>Feature Flags:</h1>
          <p key={flag?.key} data-testid={flag?.key}>
            {String(flag?.value)}
          </p>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{ platform: 'ios' }}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.getFeatureFlagByKey).toHaveBeenCalledWith({
        key: 'feature1',
        context: { platform: 'android' },
      });
      expect(screen.getByTestId('feature1').textContent).toBe('555');
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
      const [flag, setFlag] = useState<FlagEvaluationDetail<number>>();

      useEffect(() => {
        const fetchData = async () => {
          let res = await numberFlagVariationDetail('feature1', 1.23, { platform: 'android' });
          setFlag(res);
        };
        fetchData();
      }, []);

      return (
        <div>
          <h1>Feature Flags:</h1>
          <p key={flag?.key} data-testid={flag?.key}>
            {String(flag?.value)}
          </p>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{ platform: 'ios' }}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.getFeatureFlagByKey).toHaveBeenCalledWith({
        key: 'feature1',
        context: { platform: 'android' },
      });
      expect(screen.getByTestId('feature1').textContent).toBe('10.73');
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
      const [flagValue, setFlagValue] = useState<any>();

      useEffect(() => {
        const fetchData = async () => {
          initFeatureFlag('feature1', 'demo');
          const res = await getFeatureFlag('feature1', 'demo');
          act(() => {
            setFlagValue(res);
          });
        };
        fetchData();
      }, []);

      return (
        <div>
          <h1>Feature Flags:</h1>
          <p key="demo" data-testid="demo">
            {String(flagValue)}
          </p>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{ platform: 'ios' }}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.getFeatureFlagByKey).toHaveBeenCalledWith({
        key: 'feature1',
        context: { platform: 'ios' },
      });
      expect(screen.getByTestId('demo').textContent).toBe('test value');
    });
  });

  it('fetch polling - return by cache - string', async () => {
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagColections = {
      flags: [
        {
          id: '1',
          key: 'feature1',
          value: { stringValue: 'test value' },
          valueType: FlagValueTypeEnum.STRING,
          createdAt: '2024-04-01',
        },
      ],

      eTag: 'someEtag',
    };
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagValue: FlagVariationValue = {
      key: 'feature1',
      status: FlagStatusEnum.ON,
      value: { stringValue: 'test value by key' },
      valueType: FlagValueTypeEnum.STRING,
    };
    (NumeratorClient.prototype.fetchPoolingFlag as jest.Mock).mockResolvedValueOnce(mockFeatureFlagColections);
    (NumeratorClient.prototype.getFeatureFlagByKey as jest.Mock).mockResolvedValueOnce(mockFeatureFlagValue);
    jest.useFakeTimers();
    // Render NumeratorProvider with a component that consumes the context
    const ConsumerComponent = () => {
      const { getFeatureFlag } = useNumeratorContext();
      const [flagValue, setFlagValue] = useState<any>();

      const getValue = async () => {
        const res = await getFeatureFlag('feature1', 'demo', { platform: 'ios' });
        act(() => {
          setFlagValue(res);
        });
      };

      return (
        <div>
          <h1>Feature Flags:</h1>
          <button key="btn" data-testid="btn" onClick={getValue}>
            btn
          </button>
          <p key="demo" data-testid="demo">
            {String(flagValue)}
          </p>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{ platform: 'ios' }}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    act(() => {
      jest.advanceTimersByTime(40000);
    });

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.fetchPoolingFlag).toHaveBeenCalledTimes(1);
      const btn = screen.getByTestId('btn');
      fireEvent.click(btn);
      expect(screen.getByTestId('demo').textContent).toBe('test value');
    });
  });

  it('fetch polling - return by detail - not match context', async () => {
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagColections = {
      flags: [
        {
          id: '1',
          key: 'feature1',
          value: { stringValue: 'test value' },
          valueType: FlagValueTypeEnum.STRING,
          createdAt: '2024-04-01',
        },
      ],

      eTag: 'someEtag',
    };
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagValue: FlagVariationValue = {
      key: 'feature1',
      status: FlagStatusEnum.ON,
      value: { stringValue: 'test value by key' },
      valueType: FlagValueTypeEnum.STRING,
    };
    (NumeratorClient.prototype.fetchPoolingFlag as jest.Mock).mockResolvedValueOnce(mockFeatureFlagColections);
    (NumeratorClient.prototype.getFeatureFlagByKey as jest.Mock).mockResolvedValueOnce(mockFeatureFlagValue);
    jest.useFakeTimers();
    // Render NumeratorProvider with a component that consumes the context
    const ConsumerComponent = () => {
      const { getFeatureFlag } = useNumeratorContext();
      const [flagValue, setFlagValue] = useState<any>();

      const getValue = async () => {
        const res = await getFeatureFlag('feature1', 'demo');
        act(() => {
          setFlagValue(res);
        });
      };

      return (
        <div>
          <h1>Feature Flags:</h1>
          <button key="btn" data-testid="btn" onClick={getValue}>
            btn
          </button>
          <p key="demo" data-testid="demo">
            {String(flagValue)}
          </p>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{ platform: 'ios' }}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    act(() => {
      jest.advanceTimersByTime(40000);
    });

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.fetchPoolingFlag).toHaveBeenCalledTimes(1);
      const btn = screen.getByTestId('btn');
      fireEvent.click(btn);
      expect(screen.getByTestId('demo').textContent).toBe('test value by key');
    });
  });

  it('fetch polling - return by detail - not match key', async () => {
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagColections = {
      flags: [
        {
          id: '1',
          key: 'feature1',
          value: { stringValue: 'test value' },
          valueType: FlagValueTypeEnum.STRING,
          createdAt: '2024-04-01',
        },
      ],

      eTag: 'someEtag',
    };
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagValue: FlagVariationValue = {
      key: 'feature1',
      status: FlagStatusEnum.ON,
      value: { stringValue: 'test value by key' },
      valueType: FlagValueTypeEnum.STRING,
    };
    (NumeratorClient.prototype.fetchPoolingFlag as jest.Mock).mockResolvedValueOnce(mockFeatureFlagColections);
    (NumeratorClient.prototype.getFeatureFlagByKey as jest.Mock).mockResolvedValueOnce(mockFeatureFlagValue);
    jest.useFakeTimers();
    // Render NumeratorProvider with a component that consumes the context
    const ConsumerComponent = () => {
      const { getFeatureFlag } = useNumeratorContext();
      const [flagValue, setFlagValue] = useState<any>();

      const getValue = async () => {
        const res = await getFeatureFlag('feature2', 'demo');
        act(() => {
          setFlagValue(res);
        });
      };

      return (
        <div>
          <h1>Feature Flags:</h1>
          <button key="btn" data-testid="btn" onClick={getValue}>
            btn
          </button>
          <p key="demo" data-testid="demo">
            {String(flagValue)}
          </p>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{ platform: 'ios' }}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    act(() => {
      jest.advanceTimersByTime(40000);
    });

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.fetchPoolingFlag).toHaveBeenCalledTimes(1);
      const btn = screen.getByTestId('btn');
      fireEvent.click(btn);
      expect(screen.getByTestId('demo').textContent).toBe('test value by key');
    });
  });

  it('fetch polling - return by cache - boolean', async () => {
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagColections = {
      flags: [
        {
          id: '1',
          key: 'feature1',
          value: { booleanValue: false },
          valueType: FlagValueTypeEnum.BOOLEAN,
          createdAt: '2024-04-01',
        },
      ],

      eTag: 'someEtag',
    };
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagValue: FlagVariationValue = {
      key: 'feature1',
      status: FlagStatusEnum.ON,
      value: { booleanValue: true },
      valueType: FlagValueTypeEnum.BOOLEAN,
    };
    (NumeratorClient.prototype.fetchPoolingFlag as jest.Mock).mockResolvedValueOnce(mockFeatureFlagColections);
    (NumeratorClient.prototype.getFeatureFlagByKey as jest.Mock).mockResolvedValueOnce(mockFeatureFlagValue);
    jest.useFakeTimers();
    // Render NumeratorProvider with a component that consumes the context
    const ConsumerComponent = () => {
      const { getFeatureFlag } = useNumeratorContext();
      const [flagValue, setFlagValue] = useState<any>();

      const getValue = async () => {
        const res = await getFeatureFlag('feature1', true, { platform: 'ios' });
        act(() => {
          setFlagValue(res);
        });
      };

      return (
        <div>
          <h1>Feature Flags:</h1>
          <button key="btn" data-testid="btn" onClick={getValue}>
            btn
          </button>
          <p key="demo" data-testid="demo">
            {String(flagValue)}
          </p>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{ platform: 'ios' }}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    act(() => {
      jest.advanceTimersByTime(40000);
    });

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.fetchPoolingFlag).toHaveBeenCalledTimes(1);
      const btn = screen.getByTestId('btn');
      fireEvent.click(btn);
      expect(screen.getByTestId('demo').textContent).toBe('false');
    });
  });

  it('fetch polling - return by cache - number', async () => {
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagColections = {
      flags: [
        {
          id: '1',
          key: 'feature1',
          value: { longValue: 22 },
          valueType: FlagValueTypeEnum.LONG,
          createdAt: '2024-04-01',
        },
      ],

      eTag: 'someEtag',
    };
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagValue: FlagVariationValue = {
      key: 'feature1',
      status: FlagStatusEnum.ON,
      value: { longValue: 11 },
      valueType: FlagValueTypeEnum.LONG,
    };
    (NumeratorClient.prototype.fetchPoolingFlag as jest.Mock).mockResolvedValueOnce(mockFeatureFlagColections);
    (NumeratorClient.prototype.getFeatureFlagByKey as jest.Mock).mockResolvedValueOnce(mockFeatureFlagValue);
    jest.useFakeTimers();
    // Render NumeratorProvider with a component that consumes the context
    const ConsumerComponent = () => {
      const { getFeatureFlag } = useNumeratorContext();
      const [flagValue, setFlagValue] = useState<any>();

      const getValue = async () => {
        const res = await getFeatureFlag('feature1', 12, { platform: 'ios' });
        act(() => {
          setFlagValue(res);
        });
      };

      return (
        <div>
          <h1>Feature Flags:</h1>
          <button key="btn" data-testid="btn" onClick={getValue}>
            btn
          </button>
          <p key="demo" data-testid="demo">
            {String(flagValue)}
          </p>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{ platform: 'ios' }}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    act(() => {
      jest.advanceTimersByTime(40000);
    });

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.fetchPoolingFlag).toHaveBeenCalledTimes(1);
      const btn = screen.getByTestId('btn');
      fireEvent.click(btn);
      expect(screen.getByTestId('demo').textContent).toBe('22');
    });
  });

  it('stop polling - return by detail', async () => {
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagColections = {
      flags: [
        {
          id: '1',
          key: 'feature1',
          value: { stringValue: 'test value' },
          valueType: FlagValueTypeEnum.STRING,
          createdAt: '2024-04-01',
        },
      ],

      eTag: 'someEtag',
    };
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagValue: FlagVariationValue = {
      key: 'feature1',
      status: FlagStatusEnum.ON,
      value: { stringValue: 'test value by key' },
      valueType: FlagValueTypeEnum.STRING,
    };
    (NumeratorClient.prototype.fetchPoolingFlag as jest.Mock).mockResolvedValueOnce(mockFeatureFlagColections);
    (NumeratorClient.prototype.getFeatureFlagByKey as jest.Mock).mockResolvedValueOnce(mockFeatureFlagValue);
    jest.useFakeTimers();
    // Render NumeratorProvider with a component that consumes the context
    const ConsumerComponent = () => {
      const { getFeatureFlag, stopPolling } = useNumeratorContext();
      const [flagValue, setFlagValue] = useState<any>();

      const getValue = async () => {
        stopPolling();
        const res = await getFeatureFlag('feature1', 'demo', { platform: 'ios' });
        act(() => {
          setFlagValue(res);
        });
      };

      return (
        <div>
          <h1>Feature Flags:</h1>
          <button key="btn" data-testid="btn" onClick={getValue}>
            btn
          </button>
          <p key="demo" data-testid="demo">
            {String(flagValue)}
          </p>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{ platform: 'ios' }}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    act(() => {
      jest.advanceTimersByTime(40000);
    });

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.fetchPoolingFlag).toHaveBeenCalledTimes(1);
      const btn = screen.getByTestId('btn');
      fireEvent.click(btn);
      expect(screen.getByTestId('demo').textContent).toBe('demo');
    });
  });

  it('start polling - return by detail', async () => {
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagColections = {
      flags: [
        {
          id: '1',
          key: 'feature1',
          value: { stringValue: 'test value' },
          valueType: FlagValueTypeEnum.STRING,
          createdAt: '2024-04-01',
        },
      ],

      eTag: 'someEtag',
    };
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagValue: FlagVariationValue = {
      key: 'feature1',
      status: FlagStatusEnum.ON,
      value: { stringValue: 'test value by key' },
      valueType: FlagValueTypeEnum.STRING,
    };
    (NumeratorClient.prototype.fetchPoolingFlag as jest.Mock).mockResolvedValueOnce(mockFeatureFlagColections);
    (NumeratorClient.prototype.getFeatureFlagByKey as jest.Mock).mockResolvedValueOnce(mockFeatureFlagValue);
    jest.useFakeTimers();
    // Render NumeratorProvider with a component that consumes the context
    const ConsumerComponent = () => {
      const { getFeatureFlag, startPolling } = useNumeratorContext();
      const [flagValue, setFlagValue] = useState<any>();

      useEffect(() => {
        startPolling();
      }, []);

      const getValue = async () => {
        const res = await getFeatureFlag('feature1', 'demo', { platform: 'ios' });
        act(() => {
          setFlagValue(res);
        });
      };

      return (
        <div>
          <h1>Feature Flags:</h1>
          <button key="btn" data-testid="btn" onClick={getValue}>
            btn
          </button>
          <p key="demo" data-testid="demo">
            {String(flagValue)}
          </p>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{ platform: 'ios' }} loadPolling={false}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    act(() => {
      jest.advanceTimersByTime(50000);
    });

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.fetchPoolingFlag).toHaveBeenCalledTimes(1);
      const btn = screen.getByTestId('btn');
      fireEvent.click(btn);
      expect(screen.getByTestId('demo').textContent).toBe('test value');
    });
  });

  it('handle event flag updated polling - return by detail', async () => {
    // Mock featureFlags response from NumeratorClient
    const firstMockFeatureFlagColections = {
      flags: [
        {
          id: '1',
          key: 'feature1',
          value: { stringValue: 'test value 1' },
          valueType: FlagValueTypeEnum.STRING,
          createdAt: '2024-04-01',
        },
      ],

      eTag: 'firstEtag',
    };
    const secondMockFeatureFlagColections = {
      flags: [
        {
          id: '1',
          key: 'feature1',
          value: { stringValue: 'test value 2' },
          valueType: FlagValueTypeEnum.STRING,
          createdAt: '2024-04-01',
        },
      ],

      eTag: 'secondEtag',
    };

    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagValue: FlagVariationValue = {
      key: 'feature1',
      status: FlagStatusEnum.ON,
      value: { stringValue: 'test value by key' },
      valueType: FlagValueTypeEnum.STRING,
    };

    (NumeratorClient.prototype.fetchPoolingFlag as jest.Mock)
      .mockResolvedValueOnce(firstMockFeatureFlagColections)
      .mockResolvedValueOnce(secondMockFeatureFlagColections);

    (NumeratorClient.prototype.getFeatureFlagByKey as jest.Mock).mockResolvedValueOnce(mockFeatureFlagValue);

    jest.useFakeTimers();

    // Render NumeratorProvider with a component that consumes the context
    const ConsumerComponent = () => {
      const { startPolling, handleFlagUpdated } = useNumeratorContext();
      const [flagValue, setFlagValue] = useState<any>();

      useEffect(() => {
        startPolling();
      }, []);

      useEffect(() => {
        handleFlagUpdated((flags) => {
          // Handle flag updated event
          const updatedFlag = flags['feature1'];
          act(() => {
            setFlagValue(updatedFlag?.value.stringValue ?? '');
          });
        });
      }, [handleFlagUpdated]);

      return (
        <div>
          <h1>Feature Flags:</h1>
          <p key="demo" data-testid="demo">
            {String(flagValue)}
          </p>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{ platform: 'ios' }} loadPolling={false}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    act(() => {
      jest.advanceTimersByTime(40000);
    });

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.fetchPoolingFlag).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('demo').textContent).toBe('test value 1');
    });

    act(() => {
      jest.advanceTimersByTime(40000);
    });

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.fetchPoolingFlag).toHaveBeenCalledTimes(2);
      expect(screen.getByTestId('demo').textContent).toBe('test value 2');
    });
  });

  it('handle event flag updated error polling - return by detail', async () => {
    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagCollections = {
      flags: [
        {
          id: '1',
          key: 'feature1',
          value: { stringValue: 'test value' },
          valueType: FlagValueTypeEnum.STRING,
          createdAt: '2024-04-01',
        },
      ],
      eTag: 'firstEtag',
    };

    const errorResponse: ErrorResponse = {
      message: 'Something wrong with server',
      errorStatus: 500,
      errorCode: '500 Internal Server Error',
    };

    // Mock featureFlags response from NumeratorClient
    const mockFeatureFlagValue: FlagVariationValue = {
      key: 'feature1',
      status: FlagStatusEnum.ON,
      value: { stringValue: 'test value by key' },
      valueType: FlagValueTypeEnum.STRING,
    };

    (NumeratorClient.prototype.fetchPoolingFlag as jest.Mock)
      .mockResolvedValueOnce(mockFeatureFlagCollections)
      .mockRejectedValueOnce(errorResponse);

    (NumeratorClient.prototype.getFeatureFlagByKey as jest.Mock).mockResolvedValueOnce(mockFeatureFlagValue);

    jest.useFakeTimers();

    // Render NumeratorProvider with a component that consumes the context
    const ConsumerComponent = () => {
      const { startPolling, handleFlagUpdated, handleFlagUpdatedError, cacheFlags } = useNumeratorContext();
      const [flagValue, setFlagValue] = useState<any>();
      const [errorOnPolling, setErrorOnPolling] = useState<any>(null);

      useEffect(() => {
        startPolling();
      }, []);

      useEffect(() => {
        handleFlagUpdated((flags) => {
          // Handle flag updated event
          const updatedFlag = flags['feature1'];
          act(() => {
            setFlagValue(updatedFlag?.value.stringValue ?? '');
          });
        });
      }, [handleFlagUpdated]);

      useEffect(() => {
        handleFlagUpdatedError((flags, error) => {
          // Handle flag updated error event
          setErrorOnPolling(error);
        });
      }, [handleFlagUpdatedError]);

      return (
        <div>
          <h1>Feature Flags:</h1>
          <p key="demo" data-testid="demo">
            {String(flagValue)}
          </p>
          <p key="error" data-testid="error">
            {errorOnPolling ? errorOnPolling.message : ''}
          </p>
        </div>
      );
    };

    render(
      <NumeratorProvider configClient={mockConfig} defaultContext={{ platform: 'ios' }} loadPolling={false}>
        <ConsumerComponent />
      </NumeratorProvider>,
    );

    act(() => {
      jest.advanceTimersByTime(40000);
    });

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.fetchPoolingFlag).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('error').textContent).toBe('');
      expect(screen.getByTestId('demo').textContent).toBe('test value');
    });

    act(() => {
      jest.advanceTimersByTime(40000);
    });

    // Wait for promises to resolve
    await waitFor(() => {
      expect(NumeratorClient.prototype.fetchPoolingFlag).toHaveBeenCalledTimes(2);
      expect(screen.getByTestId('error').textContent).toBe('Something wrong with server');
    });
  });
});
