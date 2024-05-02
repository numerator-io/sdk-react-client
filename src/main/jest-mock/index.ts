import { FlagCollection, FlagEvaluationDetail } from '@/client/type.client';
import { NumeratorProviderProps } from '@/provider/type.provider';
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

// Mock NumeratorClient
const mockNumeratorClient = () => ({
  featureFlagConfigListing: jest.fn(),
  allFeatureFlagsConfig: jest.fn(),
  featureFlagConfigByKey: jest.fn(),
  getFeatureFlagByKey: jest.fn(),
  fetchPollingFlag: jest.fn(),
});

// Mock NumeratorProvider
const mockNumeratorProvider = (props: any = {}) => {
  let cacheFlags: Record<string, FlagCollection> = {};
  let defaultContext = props.defaultContext ?? {};

  // Define base mock implementations for booleanFlagVariationDetail, numberFlagVariationDetail, and stringFlagVariationDetail
  const flagVariationDetail = jest.fn(async (key, defaultVal, context, useDefaultContext): Promise<any> => {
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
  const getFeatureFlag = jest.fn(async (key, defaultVal, context, useDefaultContext): Promise<any> => {
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
    children: props.children ?? null,
    configClient: props.configClient ?? {},
    defaultContext: defaultContext,
    loadPolling: props.loadPolling ?? true,

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

export { mockFlags, addMockedFlag, removeMockedFlag, mockNumeratorProvider, mockNumeratorClient };
