import { ConfigClient } from '@/client/type.client';
import { areObjectsEqual } from '@/util';

// Mock flags
interface MockFlag {
  key: string;
  value: any;
  context?: Record<string, any>;
}
let mockedFlags: MockFlag[] = [];

/**
 * Sets the mocked feature flags to the provided array of flags. 
 * If a flag's context is not provided, it defaults to an empty object.
 *
 * @param flags An array of MockFlag objects representing the feature flags to be mocked.
 */
const mockFlags = (flags: MockFlag[]) => {
  flags.forEach((flag) => {
    if (!flag.context) {
      flag.context = {}; // Set context to an empty object if it's undefined
    }
  });
  mockedFlags = flags;
};

/**
 * Adds a mocked feature flag to the list of mocked flags.
 * If the flag's context is not provided, it defaults to an empty object.
 *
 * @param flag The MockFlag object representing the feature flag to be added.
 */
const addMockedFlag = (flag: MockFlag) => {
  if (!flag.context) {
    flag.context = {}; // Set context to an empty object if it's undefined
  }
  mockedFlags.push(flag);
};

/**
 * Removes a mocked feature flag with the specified key and context from the list of mocked flags.
 * If no context is provided, it removes the flag regardless of its context.
 *
 * @param key The key of the feature flag to be removed.
 * @param context (Optional) The context of the feature flag to be removed.
 */
const removeMockedFlag = (key: string, context?: Record<string, any>) => {
  mockedFlags = context
    ? mockedFlags.filter((flag) => !(flag.key === key && areObjectsEqual(flag.context, context)))
    : mockedFlags.filter((flag) => flag.key !== key);
};

export interface MockNumeratorProviderProps {
  configClient?: ConfigClient;
  defaultContext?: Record<string, any>;
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
    /**
     * Retrieve the feature flag value, working the same as the function provided in useNumeratorContext.
     *
     * @param key The key of the feature flag.
     * @param defaultVal The default value to return if the feature flag is not found.
     * @param context (Optional) The context for the feature flag.
     * @param useDefaultContext (Optional) Specifies whether to use the default context if no context is provided. Defaults to true.
     */
    getFeatureFlag,
    /**
     * Retrieve the feature flag type BOOLEAN, working the same as the function provided in useNumeratorContext.
     *
     * @param key The key of the feature flag.
     * @param defaultVal The default value to return if the feature flag is not found.
     * @param context (Optional) The context for the feature flag.
     * @param useDefaultContext (Optional) Specifies whether to use the default context if no context is provided. Defaults to true.
     */
    booleanFlagVariationDetail: flagVariationDetail,
    /**
     * Retrieve the feature flag type NUMBER (LONG or DOUBLE), working the same as the function provided in useNumeratorContext.
     *
     * @param key The key of the feature flag.
     * @param defaultVal The default value to return if the feature flag is not found.
     * @param context (Optional) The context for the feature flag.
     * @param useDefaultContext (Optional) Specifies whether to use the default context if no context is provided. Defaults to true.
     */
    numberFlagVariationDetail: flagVariationDetail,
    /**
     * Retrieve the feature flag type STRING, working the same as the function provided in useNumeratorContext.
     *
     * @param key The key of the feature flag.
     * @param defaultVal The default value to return if the feature flag is not found.
     * @param context (Optional) The context for the feature flag.
     * @param useDefaultContext (Optional) Specifies whether to use the default context if no context is provided. Defaults to true.
     */
    stringFlagVariationDetail: flagVariationDetail,
    /**
     * Retrieve the default context, working the same as the function provided in useNumeratorContext.
     */
    getDefaultContext: jest.fn(() => defaultContext),
    /**
     * Clear default context, working the same as the function provided in useNumeratorContext.
     */
    clearDefaultContext: jest.fn(() => (defaultContext = {})),
    /**
     * Add another default context, working the same as the function provided in useNumeratorContext.
     */
    addDefaultContextValue: jest.fn((key, value) => (defaultContext = { ...defaultContext, [key]: value })),
    /**
     * Remove an existing default context, working the same as the function provided in useNumeratorContext.
     */
    removeDefaultContextValue: jest.fn((key) => {
      const { [key]: _, ...newDefaultContext } = defaultContext;
      defaultContext = newDefaultContext;
    }),
    /**
     * Update cache flags for faster retrieval of flag with default context, working the same as the function provided in useNumeratorContext.
     */
    fetchPollingFeatureFlag: jest.fn(async () => {
      const result = mockedFlags.filter((flag) => areObjectsEqual(flag.context, defaultContext));
      const newCache: Record<string, any> = {};
      result.forEach((flag) => {
        newCache[flag.key] = flag;
      });
      cacheFlags = newCache;
    }),
    /**
     * Currently not supported, but you might define on your own.
     */
    initFeatureFlag: jest.fn(),
    /**
     * Currently not supported, but you might define on your own.
     */
    featureFlags: jest.fn(),
    /**
     * Currently not supported, but you might define on your own.
     */
    flagValueByKey: jest.fn(),
    /**
     * Currently not supported, but you might define on your own.
     */
    startPolling: jest.fn(),
    /**
     * Currently not supported, but you might define on your own.
     */
    stopPolling: jest.fn(),
    /**
     * Currently not supported, but you might define on your own.
     */
    restartPolling: jest.fn(),
    /**
     * Currently not supported, but you might define on your own.
     */
    handleFlagUpdated: jest.fn(),
    /**
     * Currently not supported, but you might define on your own.
     */
    handleFlagUpdatedError: jest.fn(),
    /**
     * Current cache flags.
     */
    cacheFlags: cacheFlags,
  };
};

/**
 * Resets the mocked flags array and mocks for NumeratorProvider.
 * 
 * It clears the mockedFlags array and resets all mocked functions provided by useMockNumeratorProvider.
 */
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
