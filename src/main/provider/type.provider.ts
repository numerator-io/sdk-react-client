import { ReactNode } from 'react';
import { FeatureFlagConfig, FeatureFlagValue, ConfigClient } from '../client/type.client';

export interface NumeratorContextType {
  /**
   * Record of feature flags configuration.
   * Keys are feature flag keys, values are the corresponding feature flag configurations.
   */
  featureFlagsConfig: Record<string, FeatureFlagConfig>;

  /**
   * Record of feature flags values.
   * Keys are feature flag keys, values are the corresponding feature flag values.
   */
  featureFlagsValue: Record<string, FeatureFlagValue<any>>;

  /**
   * Function to fetch configuration for all feature flags.
   * This function retrieves configuration data for all feature flags and updates the context.
   */
  fetchAllFeatureFlagsConfig: () => void;

  /**
   * Function to fetch configuration for a specific feature flag.
   * @param key - The key of the feature flag to fetch configuration for.
   */
  fetchFeatureFlagConfig: ({ key }: { key: string }) => void;

  /**
   * Function to fetch value for a specific feature flag.
   * @param key - The key of the feature flag to fetch value for.
   * @param context - Optional context data to be passed to the NumeratorClient.
   */
  fetchFeatureFlagValue: ({ key, context }: { key: string; context?: Record<string, any> }) => void;
}

export interface NumeratorProviderProps {
  children: ReactNode;

  /**
   * The configuration client instance used by the NumeratorProvider.
   */
  configClient: ConfigClient;

  /**
   * Whether to load all feature flags configuration on mount.
   * If true, the NumeratorProvider will fetch and load all feature flags configuration when it mounts.
   * Defaults to false.
   */
  loadAllFlagsConfigOnMount?: boolean;

  /**
   * Optional: load the values for feature flags on component mount.
   * The keys represent feature flag names, and each value is a context object associated with that feature flag.
   * This allows you to set the initial context for specific feature flags.
   * Example:
   * ```
   * {
   *   featureFlagKey1: { userId: 1 },
   *   featureFlagKey2: { companyId: 42 },
   * }
   * ```
   */
  loadFeatureFlagsValueOnMount?: Record<string, Record<string, any>>;
}
