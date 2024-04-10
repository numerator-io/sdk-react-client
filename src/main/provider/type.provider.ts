import { ReactNode } from 'react';
import { ConfigClient, FeatureFlagConfig, FlagEvaluationDetail, FlagVariationValue } from '../client/type.client';

export interface NumeratorContextType {
  /**
   * Return version of the Numerator SDK
   */
  version(): String;

  /**
   * Get all feature flags
   */
  featureFlags(): Promise<FeatureFlagConfig[]>;

  /**
   * Get Variation of the feature flag.
   * @param key - The flag key of the feature flag to fetch value for.
   * @param defaultVal - Default value of boolean value if not get flag variation
   * @param context - Optional context data to be passed to the NumeratorClient.
   * @param useDefaultContext - Optional check using default context or not
   */
  flagValueByKey(key: string, context: Record<string, any> | undefined): Promise<FlagVariationValue>;

  /**
   * Retrieves the boolean object
   * @param key - The flag key of the feature flag to fetch value for.
   * @param defaultVal - Default value of boolean value if not get flag variation
   * @param context - Optional context data to be passed to the NumeratorClient.
   * @param useDefaultContext - Optional check using default context or not
   */
  booleanFlagVariationDetail(
    key: string,
    defaultVal: boolean,
    context?: Record<string, any> | undefined,
    useDefaultContext?: boolean,
  ): Promise<FlagEvaluationDetail<boolean>>;

  /**
   * Retrieves the number object
   * @param key - The flag key of the feature flag to fetch value for.
   * @param defaultVal - Default value of number value if not get flag variation
   * @param context - Optional context data to be passed to the NumeratorClient.
   * @param useDefaultContext - Optional check using default context or not
   */
  numberFlagVariationDetail(
    key: string,
    defaultVal: number,
    context?: Record<string, any> | undefined,
    useDefaultContext?: boolean,
  ): Promise<FlagEvaluationDetail<number>>;

  /**
   * Retrieves the string object.
   * @param key - The flag key of the feature flag to fetch value for.
   * @param defaultVal - Default value of string value if not get flag variation
   * @param context - Optional context data to be passed to the NumeratorClient.
   * @param useDefaultContext - Optional check using default context or not
   */
  stringFlagVariationDetail(
    key: string,
    defaultVal: string,
    context?: Record<string, any> | undefined,
    useDefaultContext?: boolean,
  ): Promise<FlagEvaluationDetail<string>>;

  /**
   * Initialize new feature flag.
   * @param key - The flag key of the feature flag to fetch value for.
   * @param defaultVal - Default value of string value if not get flag variation
   */
  initFeatureFlag(key: string, defaultVal: any): void;

  /**
   * Get feature flag value.
   * @param key - The flag key of the feature flag to fetch value for.
   * @param defaultVal - Default value of string value if not get flag variation
   * @param context - Optional context data to be passed to the NumeratorClient.
   * @param useDefaultContext - Optional check using default context or not
   */
  getFeatureFlag(
    key: string,
    defaultVal: any,
    context?: Record<string, any> | undefined,
    useDefaultContext?: boolean,
  ): Promise<any>;

  /**
   * get default context of SDK.
   */
  getDefaultContext(): Record<string, any>;

  /**
   * Clear all values in default context.
   */
  clearDefaultContext(): void;

  /**
   * Add more record value in default context.
   * @param key - The key name of added record
   * @param value - the value of added record
   */
  addDefaultContextValue(key: string, value: any): void;

  /**
   * removerecord value in default context.
   * @param key - The key name of added record
   */
  removeDefaultContextValue(key: string): void;

  /**
   * Start the polling feature flag
   */
  startPolling(): void;

  /**
   * Stop the polling feature flag
   */
  stopPolling(): void;

  /**
   * Get polling flag value
   * @param context - Optional context data to be passed to the NumeratorClient.
   * @param eTag - The tag to check if value update or not
   */
  fetchPollingFeatureFlag(context: Record<string, any>, eTag?: string): void;
}

export interface NumeratorProviderProps {
  children: ReactNode;

  /**
   * The configuration client instance used by the NumeratorProvider.
   */
  configClient: ConfigClient;

  /**
   * The default context client send to NumeratorProvider
   */
  defaultContext: Record<string, any>;
  /**
   * Start to load polling
   */
  loadPolling?: boolean;
}
