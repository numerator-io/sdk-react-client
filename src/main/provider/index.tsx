import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import NumeratorClient from '@/client';
import {
  ConfigClient,
  FeatureFlagConfig,
  FlagCollection,
  FlagEvaluationDetail,
  FlagVariationValue,
} from '@/client/type.client';
import { areObjectsEqual } from '@/util';
import { NumeratorContext } from '@/provider/context.provider';
import {
  FlagUpdatedCallback,
  FlagUpdatedErrorCallback,
  NumeratorContextType,
  NumeratorProviderProps,
} from '@/provider/type.provider';
import { useDefaultContext } from '@/provider/useDefaultContext';

const POLLING_INTERVAL = 30000; // 30 seconds

const initializeNumeratorClient = (configClient: ConfigClient): NumeratorClient => {
  const numeratorClient: NumeratorClient = new NumeratorClient({
    apiKey: configClient.apiKey,
    baseUrl: configClient.baseUrl || 'https://service-platform.numerator.io',
    pollingInterval: configClient.pollingInterval || POLLING_INTERVAL,
  });

  return numeratorClient;
};

// Create a provider component
export const NumeratorProvider: React.FC<NumeratorProviderProps> = ({
  children,
  configClient,
  defaultContext,
  loadPolling = true,
}) => {
  // Initialize the SDK client
  const numeratorClient: NumeratorClient = initializeNumeratorClient(configClient);
  const [cacheFlags, setCacheFlags] = useState<Record<string, FlagCollection>>({});
  const [flags, setFlags] = useState<Record<string, any>>({});
  const [defaultContextValues, setDefaultContextValues] = useState(defaultContext);
  const [currentEtag, setCurrentEtag] = useState<string>();
  const [isPolling, setIsPolling] = useState(loadPolling);
  const [updateListeners, setUpdateListeners] = useState<FlagUpdatedCallback[]>([]);
  const [errorListeners, setErrorListeners] = useState<FlagUpdatedErrorCallback[]>([]);

  const fetchPollingFeatureFlag = useCallback(async () => {
    try {
      const result = await numeratorClient.fetchPollingFlag(defaultContextValues, {}, currentEtag);
      if (result.flags) {
        // 200 OK
        const newCache = result.flags.reduce(
          (acc, flag) => {
            acc[flag.key] = flag;
            return acc;
          },
          {} as Record<string, any>,
        );
        setCacheFlags(newCache);
        setCurrentEtag(result.etag);
        updateListeners.forEach((listener) => listener(newCache)); // Notify all update listeners
      }
    } catch (error) {
      errorListeners.forEach((listener) => listener(cacheFlags, error)); // Notify all error listeners
    }
  }, [numeratorClient, defaultContextValues, currentEtag, updateListeners, errorListeners]);

  const flagValueByKey = async (key: string, context: Record<string, any> | undefined): Promise<FlagVariationValue> => {
    const result = await numeratorClient.getFeatureFlagByKey({ key, context });
    return result;
  };

  const featureFlags = async (): Promise<FeatureFlagConfig[]> => {
    const allFlagsConfig = await numeratorClient.allFeatureFlagsConfig();
    return allFlagsConfig;
  };

  const booleanFlagVariationDetail = async (
    key: string,
    defaultVal: boolean,
    context: Record<string, any> | undefined = undefined,
    useDefaultContext: boolean = true,
  ): Promise<FlagEvaluationDetail<boolean>> => {
    try {
      const requestContext = context ?? (useDefaultContext ? defaultContext : {});
      const variation = await flagValueByKey(key, requestContext);
      return {
        key: key,
        value: variation.value.booleanValue ?? false,
        reason: {},
      };
    } catch (e) {
      return {
        key: key,
        value: defaultVal,
        reason: {},
      };
    }
  };

  const numberFlagVariationDetail = async (
    key: string,
    defaultVal: number,
    context: Record<string, any> | undefined = undefined,
    useDefaultContext: boolean = true,
  ): Promise<FlagEvaluationDetail<number>> => {
    try {
      const requestContext = context ?? (useDefaultContext ? defaultContext : {});
      const variation = await flagValueByKey(key, requestContext);
      return {
        key: key,
        value: variation.value.longValue ?? variation.value.doubleValue ?? 0,
        reason: {},
      };
    } catch (e) {
      return {
        key: key,
        value: defaultVal,
        reason: {},
      };
    }
  };

  const stringFlagVariationDetail = async (
    key: string,
    defaultVal: string,
    context: Record<string, any> | undefined = undefined,
    useDefaultContext: boolean = true,
  ): Promise<FlagEvaluationDetail<string>> => {
    try {
      const requestContext = context ?? (useDefaultContext ? defaultContext : {});
      const variation = await flagValueByKey(key, requestContext);
      return {
        key: key,
        value: variation.value.stringValue ?? '',
        reason: {},
      };
    } catch (e) {
      return {
        key: key,
        value: defaultVal,
        reason: {},
      };
    }
  };

  const initFeatureFlag = (key: string, defaultVal: any) => {
    setFlags((prevFlags) => ({
      ...prevFlags,
      [key]: defaultVal,
    }));
  };

  const getFeatureFlag = async (
    key: string,
    defaultVal: any,
    context: Record<string, any> | undefined = undefined,
    useDefaultContext: boolean = true,
  ): Promise<any> => {
    const defaultValue = flags[key];
    const hasCacheValue = !!context && cacheFlags.hasOwnProperty(key) && areObjectsEqual(context, defaultContext);
    switch (typeof defaultVal) {
      case 'boolean':
        if (hasCacheValue) {
          return (cacheFlags[key].value.booleanValue as boolean) ?? defaultValue;
        }
        const resBoolean = await booleanFlagVariationDetail(key, defaultVal, context, useDefaultContext);
        return resBoolean.value as boolean;
      case 'number':
        if (hasCacheValue) {
          return cacheFlags[key].value.longValue ?? (cacheFlags[key].value.doubleValue as number) ?? defaultValue;
        }
        const resNumber = await numberFlagVariationDetail(key, defaultVal, context, useDefaultContext);
        return resNumber.value as number;

      case 'string':
        if (hasCacheValue) {
          return (cacheFlags[key].value.stringValue as string) ?? defaultValue;
        }
        const resString = await stringFlagVariationDetail(key, defaultVal, context, useDefaultContext);
        return resString.value as string;
      default:
        throw Error('Unsupported flag type');
    }
  };

  const { getDefaultContext, clearDefaultContext, addDefaultContextValue, removeDefaultContextValue } =
    useDefaultContext(defaultContextValues, setDefaultContextValues);

  const startPolling = () => {
    setIsPolling(true);
  };

  const stopPolling = () => {
    setIsPolling(false);
    setCacheFlags({});
  };

  const restartPolling = useCallback(() => {
    stopPolling();
    startPolling();
  }, [stopPolling, startPolling]);

  // Register and unregister update listeners
  const handleFlagUpdated = useCallback((callback: FlagUpdatedCallback) => {
    setUpdateListeners((prev) => [...prev, callback]);
    return () => setUpdateListeners((prev) => prev.filter((c) => c !== callback));
  }, []);

  // Register and unregister error listeners
  const handleFlagUpdatedError = useCallback((callback: FlagUpdatedErrorCallback) => {
    setErrorListeners((prev) => [...prev, callback]);
    return () => setErrorListeners((prev) => prev.filter((c) => c !== callback));
  }, []);

  useEffect(() => {
    let timeIntervalId: any;

    if (isPolling) {
      timeIntervalId = setInterval(fetchPollingFeatureFlag, configClient.pollingInterval || POLLING_INTERVAL);
    } else {
      clearInterval(timeIntervalId);
    }

    return () => clearInterval(timeIntervalId);
  }, [isPolling, fetchPollingFeatureFlag]);

  // Create an object with SDK methods and state to be shared
  const sdkContextValue: NumeratorContextType = useMemo(
    () => ({
      featureFlags,
      flagValueByKey,
      booleanFlagVariationDetail,
      numberFlagVariationDetail,
      stringFlagVariationDetail,
      initFeatureFlag,
      getFeatureFlag,
      getDefaultContext,
      clearDefaultContext,
      addDefaultContextValue,
      removeDefaultContextValue,
      startPolling,
      stopPolling,
      restartPolling,
      fetchPollingFeatureFlag,
      handleFlagUpdated,
      handleFlagUpdatedError,
      cacheFlags,
      isPolling: isPolling,
    }),
    [cacheFlags, isPolling],
  );

  return <NumeratorContext.Provider value={sdkContextValue}>{children}</NumeratorContext.Provider>;
};

// Custom hook to access the SDK context value
export const useNumeratorContext = () => {
  const context = useContext(NumeratorContext);
  if (!context) {
    throw new Error('NumeratorClient must be used within a NumeratorProvider');
  }
  return context;
};
