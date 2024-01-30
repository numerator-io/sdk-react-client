import React, { useContext, useEffect, useState } from 'react';

import NumeratorClient from '../client';
import { NumeratorContext } from './context.provider';
import { NumeratorContextType, NumeratorProviderProps } from './type.provider';
import { mapArrayToRecord } from '../util/utils';
import { FeatureFlagConfig, FeatureFlagValue } from '../client/type.client';

const initializeNumeratorClientFromEnvironment = () => {
  // Check if the API key is defined
  if (process.env.REACT_APP_NUMERATOR_API_KEY === undefined) {
    throw new Error('REACT_APP_NUMERATOR_API_KEY is undefined');
  }

  const numeratorClient: NumeratorClient = new NumeratorClient({
    apiKey: process.env.REACT_APP_NUMERATOR_API_KEY,
    baseUrl: process.env.REACT_APP_NUMERATOR_BASE_URL || 'https://service-platform.dev.numerator.io',
  });

  return numeratorClient;
};

var numeratorClient: NumeratorClient;

// Create a provider component
export const NumeratorProvider: React.FC<NumeratorProviderProps> = ({
  children,
  loadAllFlagsConfigOnMount,
  configClient,
}) => {
  // Initialize the SDK client
  if (configClient) {
    numeratorClient = new NumeratorClient(configClient);
  } else {
    numeratorClient = initializeNumeratorClientFromEnvironment();
  }

  const [featureFlagsConfig, setFeatureFlagsConfig] = useState<Record<string, FeatureFlagConfig>>({});
  const [featureFlagsValue, setFeatureFlagsState] = useState<Record<string, FeatureFlagValue<any>>>({});

  const fetchAllFeatureFlagsConfig = async () => {
    const allFlagsConfig = await numeratorClient.allFeatureFlagsConfig();
    setFeatureFlagsConfig(mapArrayToRecord(allFlagsConfig));
  };

  const fetchFeatureFlagConfig = async ({ key }: { key: string }) => {
    const featureFlagConfig = await numeratorClient.featureFlagConfigByKey(key);

    // Update the state directly with the new Record containing a single FeatureFlag
    setFeatureFlagsConfig({
      ...featureFlagsConfig,
      [featureFlagConfig.key]: featureFlagConfig,
    });
  };

  const fetchFeatureFlagValue = async ({ key, context }: { key: string; context?: Record<string, any> }) => {
    const featureFlagValue = await numeratorClient.featureFlagValueByKey({ key: key, context });

    // Update the state directly with the new Record containing a single FeatureFlagState
    setFeatureFlagsState({
      ...featureFlagsValue,
      [featureFlagValue.key]: featureFlagValue,
    });
  };

  useEffect(() => {
    if (loadAllFlagsConfigOnMount) {
      fetchAllFeatureFlagsConfig();
    }
  }, []);

  // Create an object with SDK methods and state to be shared
  const sdkContextValue: NumeratorContextType = {
    featureFlagsConfig,
    featureFlagsValue,
    fetchAllFeatureFlagsConfig,
    fetchFeatureFlagConfig,
    fetchFeatureFlagValue,
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
