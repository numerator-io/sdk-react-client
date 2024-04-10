import React, { useContext, useEffect, useState } from 'react';

import NumeratorClient from '../client';
import { ConfigClient, FeatureFlagConfig, FlagCollection, FlagEvaluationDetail, FlagVariationValue } from '../client/type.client';
import { areObjectsEqual } from '../util';
import { NumeratorContext } from './context.provider';
import { NumeratorContextType, NumeratorProviderProps } from './type.provider';
import { useDefaultContext } from './useDefaultContext';

const pjson = require('../../../package.json')

const POLLING_INTERVAL = 30000; // 30 seconds

const initializeNumeratorClient = (configClient: ConfigClient): NumeratorClient => {
  const numeratorClient: NumeratorClient = new NumeratorClient({
    apiKey: configClient.apiKey,
    baseUrl: configClient.baseUrl || 'https://service-platform.dev.numerator.io',
  });

  return numeratorClient;
};

// Create a provider component
export const NumeratorProvider: React.FC<NumeratorProviderProps> = ({ children, configClient, defaultContext, loadPolling = true }) => {
  // Initialize the SDK client
  const numeratorClient: NumeratorClient = initializeNumeratorClient(configClient);
  const [cacheFlags, setCacheFlags] = useState<Record<string, FlagCollection>>({})
  const [flags, setFlags] = useState<Record<string, any>>({});
  const [defaultContextValues, setDefaultContextValues] = useState(defaultContext);
  const [currentEtag, setCurrentEtag] = useState<string>()
  const [activeTimeInterval, setActiveTimeInterval] = useState(loadPolling)

  const version = () => {
    return pjson.version
  }

  const fetchPollingFeatureFlag = async () => {
    const result = await numeratorClient.fetchPoolingFlag(defaultContext, currentEtag);
    setCurrentEtag(result.etag);
    const cache = result.flags.reduce(
      (acc, flag) => {
        acc[flag.key] = flag;
        return acc;
      },
      {} as Record<string, any>,
    );
    setCacheFlags(cache);
  };

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
    flags[key] = defaultVal;
    setFlags(flags);
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
        if(hasCacheValue) {
          return cacheFlags[key].value.booleanValue as boolean ?? defaultValue
        }
        const resBoolean = await booleanFlagVariationDetail(key, defaultVal, context, useDefaultContext);
        return resBoolean.value as boolean;
      case 'number':
        if(hasCacheValue) {
          return cacheFlags[key].value.longValue ?? cacheFlags[key].value.doubleValue as number ?? defaultValue
        }
        const resNumber = await numberFlagVariationDetail(key, defaultVal, context, useDefaultContext);
        return resNumber.value as number;

      case 'string':
        if(hasCacheValue) {
          return cacheFlags[key].value.stringValue as string ?? defaultValue
        }
        const resString = await stringFlagVariationDetail(key, defaultVal, context, useDefaultContext);
        return resString.value as string;
      default:
        throw Error("Unsupported flag type")  
    }
  };

  const { getDefaultContext, clearDefaultContext, addDefaultContextValue, removeDefaultContextValue } =
    useDefaultContext(defaultContextValues, setDefaultContextValues);
    
  const startPolling = () => {
    setActiveTimeInterval(true)
  }

  const stopPolling = () => {
    setActiveTimeInterval(false)
    setCacheFlags({})
  }

  useEffect(() => {
    let timeInterval: any;

    if(activeTimeInterval) {
      timeInterval = setInterval(fetchPollingFeatureFlag, POLLING_INTERVAL)
    } else {
      clearInterval(timeInterval)
    }

    return () => clearInterval(timeInterval)

  }, [activeTimeInterval])

  // Create an object with SDK methods and state to be shared
  const sdkContextValue: NumeratorContextType = {
    version,
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
    fetchPollingFeatureFlag,
  };

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
