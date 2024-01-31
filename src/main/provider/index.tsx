import React, { useContext, useEffect, useState } from 'react';

import NumeratorClient from '../client';
import { NumeratorContext } from './context.provider';
import { NumeratorContextType, NumeratorProviderProps } from './type.provider';
import { mapArrayToRecord } from '../util';
import { ConfigClient, FeatureFlagConfig, FeatureFlagValue } from '../client/type.client';

const initializeNumeratorClient = (configClient: ConfigClient): NumeratorClient => {
  const numeratorClient: NumeratorClient = new NumeratorClient({
    apiKey: configClient.apiKey,
    baseUrl: configClient.baseUrl || 'https://service-platform.dev.numerator.io',
  });

  return numeratorClient;
};

// Create a provider component
export const NumeratorProvider: React.FC<NumeratorProviderProps> = ({
  children,
  configClient,
  loadAllFlagsConfigOnMount,
  loadFeatureFlagsValueOnMount,
}) => {
  // Initialize the SDK client
  const numeratorClient: NumeratorClient = initializeNumeratorClient(configClient);

  const [featureFlagsConfig, setFeatureFlagsConfig] = useState<Record<string, FeatureFlagConfig>>({});
  const [featureFlagsValue, setFeatureFlagsState] = useState<Record<string, FeatureFlagValue<any>>>({});

  const fetchAllFeatureFlagsConfig = async () => {
    const allFlagsConfig = await numeratorClient.allFeatureFlagsConfig();
    setFeatureFlagsConfig(mapArrayToRecord(allFlagsConfig));
  };

  const fetchFeatureFlagConfig = async ({ key }: { key: string }) => {
    const flagConfigRes = await numeratorClient.featureFlagConfigByKey(key);

    // Update the state directly with the new Record containing a single FeatureFlag
    setFeatureFlagsConfig((prevFeatureFlagsConfig) => ({
      ...prevFeatureFlagsConfig,
      [flagConfigRes.key]: flagConfigRes,
    }));
  };

  const fetchFeatureFlagValue = async ({ key, context }: { key: string; context?: Record<string, any> }) => {
    const flagValueRes = await numeratorClient.featureFlagValueByKey({ key: key, context });

    // Update the state directly with the new Record containing a single FeatureFlagState
    setFeatureFlagsState((prevFeatureFlagsValue) => ({
      ...prevFeatureFlagsValue,
      [flagValueRes.key]: flagValueRes,
    }));
  };

  // Create an object with SDK methods and state to be shared
  const sdkContextValue: NumeratorContextType = {
    featureFlagsConfig,
    featureFlagsValue,
    fetchAllFeatureFlagsConfig,
    fetchFeatureFlagConfig,
    fetchFeatureFlagValue,
  };

  useEffect(() => {
    if (loadAllFlagsConfigOnMount) {
      fetchAllFeatureFlagsConfig();
    }

    if (loadFeatureFlagsValueOnMount && Object.keys(loadFeatureFlagsValueOnMount).length > 0) {
      Object.keys(loadFeatureFlagsValueOnMount).forEach((key) => {
        fetchFeatureFlagValue({ key, context: loadFeatureFlagsValueOnMount[key] });
      });
    }
  }, []);

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
