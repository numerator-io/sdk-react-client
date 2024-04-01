import React, { useContext, useState } from 'react';

import NumeratorClient from '../client';
import {
  ConfigClient,
  FeatureFlagConfig,
  FlagEvaluationDetail
} from '../client/type.client';
import { NumeratorContext } from './context.provider';
import { NumeratorContextType, NumeratorProviderProps } from './type.provider';

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

  const [featureFlags, setFeatureFlags] = useState<Record<string, any>>({});

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
    context: Record<string, any> | undefined = undefined,
    useDefaultContext: boolean = true,
  ): Promise<any> => {
    const defaultVal = featureFlags[key];
    switch (typeof defaultVal) {
      case 'boolean':
        const resBoolean = await booleanFlagVariation(key, defaultVal, context, useDefaultContext);
        return resBoolean.value as boolean;
      case 'number':
        const resNumber = await numberFlagVariation(key, defaultVal, context, useDefaultContext);
        return resNumber.value as number;

      case 'string':
        const resString = await stringFlagVariation(key, defaultVal, context, useDefaultContext);
        return resString.value as string;
    }
  };

  // Create an object with SDK methods and state to be shared
  const sdkContextValue: NumeratorContextType = {
    allFlags,
    booleanFlagVariation,
    numberFlagVariation,
    stringFlagVariation,
    initFeatureFlag,
    getFeatureFlag,
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
