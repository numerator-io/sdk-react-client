import { ReactNode } from 'react';
import {
  ConfigClient,
  FeatureFlagConfig,
  FlagEvaluationDetail
} from '../client/type.client';

export interface NumeratorContextType {
  /**
   * Get all feature flags
   */
  allFlags(): Promise<FeatureFlagConfig[]>;

  /**
   * Retrieves the boolean object
   * @param key - The flag key of the feature flag to fetch value for.
   * @param defaultVal - Default value of boolean value if not get flag variation
   * @param context - Optional context data to be passed to the NumeratorClient.
   * @param useDefaultContext - Optional check using default context or not
   */
  booleanFlagVariation(
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
  numberFlagVariation(
    key: string,
    defaultVal: number,
    context?: Record<string, any> | undefined,
    useDefaultContext?: boolean,
  ): Promise<FlagEvaluationDetail<number>>;

  /**
   * Retrieves the string object
   * @param key - The flag key of the feature flag to fetch value for.
   * @param defaultVal - Default value of string value if not get flag variation
   * @param context - Optional context data to be passed to the NumeratorClient.
   * @param useDefaultContext - Optional check using default context or not
   */
  stringFlagVariation(
    key: string,
    defaultVal: string,
    context?: Record<string, any> | undefined,
    useDefaultContext?: boolean,
  ): Promise<FlagEvaluationDetail<string>>;

  /**
   * Initialize new feature flag
   * @param key - The flag key of the feature flag to fetch value for.
   * @param defaultVal - Default value of string value if not get flag variation
   */
  initFeatureFlag(key: string, defaultVal: any): void;

  /**
   * Get feature flag value
   * @param key - The flag key of the feature flag to fetch value for.
   * @param context - Optional context data to be passed to the NumeratorClient.
   * @param useDefaultContext - Optional check using default context or not
   */
  getFeatureFlag(key: string, context?: Record<string, any> | undefined, useDefaultContext?: boolean): Promise<any>;
  
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
}
