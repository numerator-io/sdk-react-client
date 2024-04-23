import React, { ReactNode } from 'react';

type ConfigClient = {
    apiKey: string;
    baseUrl?: string;
};
interface ErrorResponse {
    message: string;
    errorCode: string;
    errorStatus: number;
}
interface ApiResponse<T> {
    data?: T;
    error?: ErrorResponse | any;
    headers?: any;
}
interface ApiRequestOptions {
    endpoint: string;
    method: string;
    headers?: Record<string, any>;
    data?: Record<string, any>;
}
interface ApiClientInterface {
    apiKey: string;
    baseUrl: string;
    request<T>(apiRequestOptions: ApiRequestOptions): Promise<ApiResponse<T>>;
}
interface PaginationRequest {
    page?: number;
    size?: number;
}
interface PaginationResponse<T> {
    count: number;
    data: T[];
}
interface FeatureFlagConfigListingRequest extends PaginationRequest {
    page?: number;
    size?: number;
}
interface FeatureFlagValueByKeyRequest {
    key: string;
    context?: Record<string, any>;
}
interface FeatureFlagConfigListingResponse extends PaginationResponse<FeatureFlagConfig> {
    count: number;
    data: FeatureFlagConfig[];
}
interface FeatureFlagPollingResponse {
    flags: FlagCollection[];
    etag: string;
}
type VariationKeyType = 'stringValue' | 'booleanValue' | 'longValue' | 'doubleValue';
declare enum FlagStatusEnum {
    ON = "ON",
    OFF = "OFF"
}
declare enum FlagValueTypeEnum {
    BOOLEAN = "BOOLEAN",
    STRING = "STRING",
    LONG = "LONG",
    DOUBLE = "DOUBLE"
}
interface FeatureFlagConfig {
    id: string;
    name: string;
    key: string;
    organizationId: string;
    projectId: string;
    status: FlagStatusEnum;
    description?: string | null;
    defaultOnVariationId: string;
    defaultOffVariationId: string;
    valueType: FlagValueTypeEnum;
    createdAt: Date;
}
interface FlagVariationValue {
    key: string;
    status: FlagStatusEnum;
    value: VariationValue;
    valueType: FlagValueTypeEnum;
}
interface VariationValue {
    stringValue?: string;
    booleanValue?: boolean;
    longValue?: number;
    doubleValue?: number;
}
interface FlagEvaluationDetail<T> {
    key: string;
    value: T;
    reason: Record<string, any> | null;
}
interface FlagCollection {
    id: string;
    key: string;
    value: VariationValue;
    valueType: FlagValueTypeEnum;
    createdAt: string;
}

declare class NumeratorClient {
    private apiClient;
    constructor(config: ConfigClient);
    handleFeatureFlagNotFound: () => Promise<never>;
    featureFlagConfigListing(request?: FeatureFlagConfigListingRequest): Promise<FeatureFlagConfigListingResponse>;
    allFeatureFlagsConfig(): Promise<FeatureFlagConfig[]>;
    featureFlagConfigByKey(key: string): Promise<FeatureFlagConfig>;
    getFeatureFlagByKey<T>(request: FeatureFlagValueByKeyRequest): Promise<FlagVariationValue>;
    fetchPollingFlag(context: Record<string, any>, eTag?: string | undefined): Promise<FeatureFlagPollingResponse>;
}

interface NumeratorContextType {
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
    booleanFlagVariationDetail(key: string, defaultVal: boolean, context?: Record<string, any> | undefined, useDefaultContext?: boolean): Promise<FlagEvaluationDetail<boolean>>;
    /**
     * Retrieves the number object
     * @param key - The flag key of the feature flag to fetch value for.
     * @param defaultVal - Default value of number value if not get flag variation
     * @param context - Optional context data to be passed to the NumeratorClient.
     * @param useDefaultContext - Optional check using default context or not
     */
    numberFlagVariationDetail(key: string, defaultVal: number, context?: Record<string, any> | undefined, useDefaultContext?: boolean): Promise<FlagEvaluationDetail<number>>;
    /**
     * Retrieves the string object.
     * @param key - The flag key of the feature flag to fetch value for.
     * @param defaultVal - Default value of string value if not get flag variation
     * @param context - Optional context data to be passed to the NumeratorClient.
     * @param useDefaultContext - Optional check using default context or not
     */
    stringFlagVariationDetail(key: string, defaultVal: string, context?: Record<string, any> | undefined, useDefaultContext?: boolean): Promise<FlagEvaluationDetail<string>>;
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
    getFeatureFlag(key: string, defaultVal: any, context?: Record<string, any> | undefined, useDefaultContext?: boolean): Promise<any>;
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
    cacheFlags: Record<string, FlagCollection>;
}
interface NumeratorProviderProps {
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
type FlagUpdatedCallback = (updatedData: Record<string, FlagCollection>) => void;
/**
 * Callback function when flag is updated
*/
type FlagUpdatedErrorCallback = (latestData: Record<string, FlagCollection>, error: any) => void;

declare const NumeratorProvider: React.FC<NumeratorProviderProps>;
declare const useNumeratorContext: () => NumeratorContextType;

export { type ApiClientInterface, type ApiRequestOptions, type ApiResponse, type ConfigClient, type ErrorResponse, type FeatureFlagConfig, type FeatureFlagConfigListingRequest, type FeatureFlagConfigListingResponse, type FeatureFlagPollingResponse, type FeatureFlagValueByKeyRequest, type FlagCollection, type FlagEvaluationDetail, FlagStatusEnum, type FlagUpdatedCallback, type FlagUpdatedErrorCallback, FlagValueTypeEnum, type FlagVariationValue, NumeratorClient, type NumeratorContextType, NumeratorProvider, type NumeratorProviderProps, type PaginationRequest, type PaginationResponse, type VariationKeyType, type VariationValue, useNumeratorContext };
