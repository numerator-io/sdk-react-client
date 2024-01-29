import React, { useContext, useEffect, useState } from 'react';

import NumeratorClient from '../client';
import { FeatureFlag, FeatureFlagState } from '../client/type.client';
import { NumeratorContext } from './context.provider';
import { NumeratorContextType } from './type.provider';
import { mapArrayToRecord } from '../util/utils';

// Check if the API key is defined
if (process.env.REACT_APP_NUMERATOR_API_KEY === undefined) {
  throw new Error('REACT_APP_NUMERATOR_API_KEY is undefined');
}

const numeratorClient = new NumeratorClient({
  apiKey: process.env.REACT_APP_NUMERATOR_API_KEY,
  baseUrl: process.env.REACT_APP_NUMERATOR_BASE_URL || 'https://service-platform.dev.numerator.io',
});

// Create a provider component
export const NumeratorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [featureFlagsConfig, setFeatureFlagsConfig] = useState<Record<string, FeatureFlag>>({});
  const [featureFlagsState, setFeatureFlagsState] = useState<Record<string, FeatureFlagState<any>>>({});

  const fetchFeatureFlagsConfig = async () => {
    const allFlagsConfigRes = await numeratorClient.featureFlags();
    setFeatureFlagsConfig(mapArrayToRecord(allFlagsConfigRes.data));
  };

  const fetchFeatureFlagsConfigBy = async ({ key, id }: { key?: string; id?: string }) => {
    if (key === undefined && id === undefined) {
      throw new Error('Either key or id must be provided');
    }

    let featureFlagConfigRes;
    if (id !== undefined) {
      featureFlagConfigRes = await numeratorClient.featureFlagById(id);
    } else {
      featureFlagConfigRes = await numeratorClient.featureFlagByKey(key!!);
    }

    // Update the state directly with the new Record containing a single FeatureFlag
    setFeatureFlagsConfig({
      ...featureFlagsConfig,
      [featureFlagConfigRes.key]: featureFlagConfigRes,
    });
  };

  const fetchFeatureFlagState = async ({ context, key, id }: { context?: Record<string, any>; key?: string; id?: string }) => {
    if (key === undefined && id === undefined) {
      throw new Error('Either key or id must be provided');
    }

    let featureFlagStateRes;
    if (id !== undefined) {
      featureFlagStateRes = await numeratorClient.featureFlagStateById({ id, context });
    } else {
      featureFlagStateRes = await numeratorClient.featureFlagStateByKey({ key: key!!, context });
    }

    // Update the state directly with the new Record containing a single FeatureFlagState
    setFeatureFlagsState({
      ...featureFlagsState,
      [featureFlagStateRes.key]: featureFlagStateRes,
    });
  };

  useEffect(() => {
    fetchFeatureFlagsConfig();
  }, []);

  // Create an object with SDK methods and state to be shared
  const sdkContextValue: NumeratorContextType = {
    featureFlagsConfig,
    featureFlagsState,
    fetchFeatureFlagsConfig,
    fetchFeatureFlagsConfigBy,
    fetchFeatureFlagState,
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
