import { ConfigClient } from '@/client/type.client';
import { areObjectsEqual } from '@/util';

// Mock flags
interface MockFlag {
  key: string;
  value: any;
  context: Record<string, any>;
}
let mockedFlags: MockFlag[] = [];
const mockFlags = (flags: MockFlag[]) => {
  mockedFlags = flags;
};

const addMockedFlag = (flag: MockFlag) => {
  mockedFlags.push(flag);
};

const removeMockedFlag = (key: string, context?: Record<string, any>) => {
  mockedFlags = context
    ? mockedFlags.filter((flag) => !(flag.key === key && areObjectsEqual(flag.context, context)))
    : mockedFlags.filter((flag) => flag.key !== key);
};

export interface MockNumeratorProviderProps {
  /**
   * The configuration client instance used by the NumeratorProvider.
   */
  configClient?: ConfigClient;

  /**
   * The default context client send to NumeratorProvider
   */

  defaultContext?: Record<string, any>;
  /**
   * Start to load polling
   */

  loadPolling?: boolean;
}

// Mock NumeratorProvider
const useMockNumeratorProvider = (props: MockNumeratorProviderProps = {}) => {
  let cacheFlags: Record<string, any> = {};
  let defaultContext = props.defaultContext ?? {};

  // Define base mock implementations for booleanFlagVariationDetail, numberFlagVariationDetail, and stringFlagVariationDetail
  const flagVariationDetail = jest.fn(async (key, defaultVal, context?, useDefaultContext = true): Promise<any> => {
    const requestContext = context ?? (useDefaultContext ? defaultContext : {});
    const variation = mockedFlags.find((flag) => flag.key === key && areObjectsEqual(flag.context, requestContext));
    if (variation) {
      return {
        key: key,
        value: variation.value,
        reason: {},
      };
    }
    return {
      key: key,
      value: defaultVal,
      reason: {},
    };
  });

  // Define mock implementation for getFeatureFlag
  const getFeatureFlag = jest.fn(async (key, defaultVal, context?, useDefaultContext = true): Promise<any> => {
    const hasCacheValue = !!context && cacheFlags.hasOwnProperty(key) && areObjectsEqual(context, props.defaultContext);
    switch (typeof defaultVal) {
      case 'boolean':
        if (hasCacheValue) {
          return cacheFlags[key].value.booleanValue as boolean;
        }
        const resBoolean = await flagVariationDetail(key, defaultVal, context, useDefaultContext);
        return resBoolean.value as boolean;
      case 'number':
        if (hasCacheValue) {
          return cacheFlags[key].value.longValue ?? (cacheFlags[key].value.doubleValue as number);
        }
        const resNumber = await flagVariationDetail(key, defaultVal, context, useDefaultContext);
        return resNumber.value as number;
      case 'string':
        if (hasCacheValue) {
          return cacheFlags[key].value.stringValue as string;
        }
        const resString = await flagVariationDetail(key, defaultVal, context, useDefaultContext);
        return resString.value as string;
      default:
        throw new Error('Unsupported flag type');
    }
  });
  return {
    getFeatureFlag,
    booleanFlagVariationDetail: flagVariationDetail,
    numberFlagVariationDetail: flagVariationDetail,
    stringFlagVariationDetail: flagVariationDetail,
    getDefaultContext: jest.fn(() => defaultContext),
    clearDefaultContext: jest.fn(() => (defaultContext = {})),
    addDefaultContextValue: jest.fn((key, value) => (defaultContext = { ...defaultContext, [key]: value })),
    removeDefaultContextValue: jest.fn((key) => {
      const { [key]: _, ...newDefaultContext } = defaultContext;
      defaultContext = newDefaultContext;
    }),
    fetchPollingFeatureFlag: jest.fn(async () => {
      const result = mockedFlags.filter((flag) => areObjectsEqual(flag.context, defaultContext));
      const newCache: Record<string, any> = {};
      result.forEach((flag) => {
        newCache[flag.key] = flag;
      });
      cacheFlags = newCache;
    }),
    initFeatureFlag: jest.fn(),
    featureFlags: jest.fn(),
    flagValueByKey: jest.fn(),
    startPolling: jest.fn(),
    stopPolling: jest.fn(),
    restartPolling: jest.fn(),
    handleFlagUpdated: jest.fn(),
    handleFlagUpdatedError: jest.fn(),
    cacheFlags: cacheFlags,
  };
};

const resetNumeratorMocks = () => {
  // Reset mockedFlags array
  mockedFlags = [];

  // Reset mocks for NumeratorProvider
  const mockProvider = useMockNumeratorProvider();
  Object.values(mockProvider).forEach((mockFn) => {
    if (typeof mockFn.mock !== 'undefined') {
      mockFn.mockReset();
    }
  });
};

export { mockFlags, addMockedFlag, removeMockedFlag, useMockNumeratorProvider, resetNumeratorMocks };
