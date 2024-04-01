import React, { useContext, useEffect, useState } from 'react';

import NumeratorClient from '../client';
import {
  ConfigClient,
  FeatureFlagConfig,
  FlagCollection,
  FlagEvaluationDetail
} from '../client/type.client';
import { NumeratorContext } from './context.provider';
import { NumeratorContextType, NumeratorProviderProps } from './type.provider';
import { areObjectsEqual } from '../util';

const POLLING_INTERVAL= 60000 // 1 minute

const initializeNumeratorClient = (configClient: ConfigClient): NumeratorClient => {
  const numeratorClient: NumeratorClient = new NumeratorClient({
    apiKey: configClient.apiKey,
    baseUrl: configClient.baseUrl || 'https://service-platform.dev.numerator.io',
  });

  return numeratorClient;
};

// Create a provider component
export const NumeratorProvider: React.FC<NumeratorProviderProps> = ({ children, configClient, defaultContext }) => {
  // Initialize the SDK client
  const numeratorClient: NumeratorClient = initializeNumeratorClient(configClient);
  const [cacheFlags, setCacheFlags] = useState<Record<string, FlagCollection>>({})
  const [featureFlags, setFeatureFlags] = useState<Record<string, any>>({});
  const [currentEtag, setCurrentEtag] = useState<string>()

  const fetchPollingFeatureFlag = async() => {
    const result = await numeratorClient.fetchPoolingFlag(defaultContext, currentEtag)
    setCurrentEtag(result.etag)
    const cache = result.flags.reduce((acc, flag) => {
      acc[flag.key] = flag
      return acc
    }, {} as Record<string, any>)
    setCacheFlags(cache)
  }

  const flagValueByKey = async (key: string, context: Record<string, any> | undefined) => {
    const result = await numeratorClient.getFeatureFlagByKey({ key, context });
    return result;
  };

  const allFlags = async (): Promise<FeatureFlagConfig[]> => {
    const allFlagsConfig = await numeratorClient.allFeatureFlagsConfig();
    return allFlagsConfig;
  };

  const booleanFlagVariation = async (
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

  const numberFlagVariation = async (
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

  const stringFlagVariation = async (
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
    featureFlags[key] = defaultVal
    setFeatureFlags(featureFlags);
  };

  const getFeatureFlag = async (
    key: string,
    defaultVal: any,
    context: Record<string, any> | undefined = undefined,
    useDefaultContext: boolean = true,
  ): Promise<any> => {
    const defaultValue = featureFlags[key] ?? defaultVal;
    const hasCacheValue = cacheFlags.hasOwnProperty(key) && areObjectsEqual(context, defaultContext)

    switch (typeof defaultVal) {
      case 'boolean':
        if(hasCacheValue) {
          return cacheFlags[key].value.booleanValue as boolean ?? defaultValue
        }
        const resBoolean = await booleanFlagVariation(key, defaultValue, context, useDefaultContext);
        return resBoolean.value as boolean;
      case 'number':
        if(hasCacheValue) {
          return cacheFlags[key].value.longValue ?? cacheFlags[key].value.doubleValue as number ?? defaultValue
        }
        const resNumber = await numberFlagVariation(key, defaultValue, context, useDefaultContext);
        return resNumber.value as number;

      case 'string':
        if(hasCacheValue) {
          return cacheFlags[key].value.stringValue as string ?? defaultValue
        }
        const resString = await stringFlagVariation(key, defaultValue, context, useDefaultContext);
        return resString.value as string;
      default:
        throw Error("Unsupported flag type")  
    }
  };

  useEffect(() => {
    const timeInterval = setInterval(fetchPollingFeatureFlag, POLLING_INTERVAL)

    return () => clearInterval(timeInterval)
  }, [])

  // Create an object with SDK methods and state to be shared
  const sdkContextValue: NumeratorContextType = {
    allFlags,
    booleanFlagVariation,
    numberFlagVariation,
    stringFlagVariation,
    initFeatureFlag,
    getFeatureFlag,
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
