import { ReactNode } from 'react';
import {
  ConfigClient,
  FeatureFlagConfig,
  FlagCollection,
  FlagEvaluationDetail,
  FlagVariationValue,
} from '@/client/type.client';

export interface NumeratorContextType {
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
   * Start polling feature flag
   */
  startPolling(): void;

  /**
   * Stop polling feature flag
   */
  stopPolling(): void;

  /**
   * Restart polling feature flag
   */
  restartPolling(): void;

  /**
   * Get polling flag value
   * @param context - Optional context data to be passed to the NumeratorClient.
   * @param eTag - The tag to check if value update or not
   */
  fetchPollingFeatureFlag(context: Record<string, any>, eTag?: string): void;

  /**
   * Handles the flag updated event.
   * @param callback The callback to handle the event.
   */
  handleFlagUpdated(callback: FlagUpdatedCallback): void;

  /**
   * Handles the flag updated error event.
   * @param callback The callback to handle the event.
   */
  handleFlagUpdatedError(callback: FlagUpdatedErrorCallback): void;

  /**
   * A cache holding latest state of all feature flags. This object maps flag keys to their respective
   * flag. This cache is automatically updated as flags are polled and fetched.
   */
  cacheFlags: Record<string, FlagCollection>;

  /**
   * Indicates whether the feature flag polling process is currently active. This boolean is true if
   * polling has been started and not yet stopped. It is used to manage and monitor the status of
   * flag updates, facilitating the control of real-time feature flag checking.
   */
  isPolling: boolean;
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

/**
 * Callback function when flag is updated
 */
export type FlagUpdatedCallback = (updatedData: Record<string, FlagCollection>) => void;

/**
 * Callback function when flag is updated
 */
export type FlagUpdatedErrorCallback = (latestData: Record<string, FlagCollection>, error: any) => void;
