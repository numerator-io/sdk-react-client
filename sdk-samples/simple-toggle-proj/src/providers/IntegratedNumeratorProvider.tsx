import React, { useCallback, useEffect, createContext, useContext } from 'react';
import { useNumeratorContext } from '@numerator-io/sdk-react-client';
interface IntegratedNumeratorContextType {
  /**
   * Get feature flag value when polling is enabled.
   * @param key - The flag key of the feature flag to fetch value for.
   * @param defaultVal - Default value of string value if not get flag variation
   */
  checkEnabledFeatureFlag(key: string, defaultVal?: boolean): boolean;
  /**
   * Get feature flag value async when polling is disabled.
   * @param key - The flag key of the feature flag to fetch value for.
   * @param defaultVal - Default value of string value if not get flag variation
   */
  checkAsyncEnabledFeatureFlag(key: string, defaultVal?: boolean): Promise<boolean>;
}

const useNumeratorFeatureFlags = (): IntegratedNumeratorContextType => {
  const { handleFlagUpdated, cacheFlags, getFeatureFlag } = useNumeratorContext();

  // Utilize when polling is disabled (OFF)
  const checkAsyncEnabledFeatureFlag = useCallback(
    async (key: string, defaultVal = false): Promise<boolean> => {
      const defaultValue = cacheFlags[key]?.value.booleanValue ?? defaultVal;
      return getFeatureFlag(key, defaultValue);
    },
    [cacheFlags, getFeatureFlag],
  );

  // Utilize when polling is enabled (ON)
  const checkEnabledFeatureFlag = useCallback(
    (key: string, defaultVal = false): boolean => {
      return cacheFlags[key]?.value.booleanValue ?? defaultVal;
    },
    [cacheFlags],
  );

  // Subscribe to flag updates
  useEffect(() => {
    // Register a callback function to handle flag updates
    const unregister = handleFlagUpdated((flags) => {
      // Upon flag update, you might trigger actions or updates
    });

    // Clean up by unregistering the callback when the component unmounts or dependencies change.
    return unregister;
  }, []);

  return { checkEnabledFeatureFlag, checkAsyncEnabledFeatureFlag };
};

// Create a context for the SDK
export const IntegratedNumeratorContext = createContext<IntegratedNumeratorContextType | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export const IntegratedNumeratorProvider: React.FC<Props> = ({ children }) => {
  const featureFlagActions = useNumeratorFeatureFlags();

  return (
    <IntegratedNumeratorContext.Provider value={featureFlagActions}>{children}</IntegratedNumeratorContext.Provider>
  );
};

export const useIntegratedNumeratorContext = () => {
  const context = useContext(IntegratedNumeratorContext);
  if (!context) {
    throw new Error('Must be used within a IntegratedNumeratorContext');
  }
  return context;
};
