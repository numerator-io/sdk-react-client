import React, { ReactNode } from 'react';

type ConfigClient = {
    apiKey: string;
    baseUrl?: string;
    pollingInterval?: number;
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
    key: string;
    value: VariationValue;
    valueType: FlagValueTypeEnum;
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

interface MockFlag {
    key: string;
    value: any;
    context?: Record<string, any>;
}
/**
 * Sets the mocked feature flags to the provided array of flags.
 * If a flag's context is not provided, it defaults to an empty object.
 *
 * @param flags An array of MockFlag objects representing the feature flags to be mocked.
 */
declare const mockFlags: (flags: MockFlag[]) => void;
/**
 * Adds a mocked feature flag to the list of mocked flags.
 * If the flag's context is not provided, it defaults to an empty object.
 *
 * @param flag The MockFlag object representing the feature flag to be added.
 */
declare const addMockedFlag: (flag: MockFlag) => void;
/**
 * Removes a mocked feature flag with the specified key and context from the list of mocked flags.
 * If no context is provided, it removes the flag regardless of its context.
 *
 * @param key The key of the feature flag to be removed.
 * @param context (Optional) The context of the feature flag to be removed.
 */
declare const removeMockedFlag: (key: string, context?: Record<string, any>) => void;
interface MockNumeratorProviderProps {
    configClient?: ConfigClient;
    defaultContext?: Record<string, any>;
    loadPolling?: boolean;
}
declare const useMockNumeratorProvider: (props?: MockNumeratorProviderProps) => {
    /**
     * Retrieve the feature flag value, working the same as the function provided in useNumeratorContext.
     *
     * @param key The key of the feature flag.
     * @param defaultVal The default value to return if the feature flag is not found.
     * @param context (Optional) The context for the feature flag.
     * @param useDefaultContext (Optional) Specifies whether to use the default context if no context is provided. Defaults to true.
     */
    getFeatureFlag: jest.Mock<Promise<any>, [key: any, defaultVal: any, context?: any, useDefaultContext?: any], any>;
    /**
     * Retrieve the feature flag type BOOLEAN, working the same as the function provided in useNumeratorContext.
     *
     * @param key The key of the feature flag.
     * @param defaultVal The default value to return if the feature flag is not found.
     * @param context (Optional) The context for the feature flag.
     * @param useDefaultContext (Optional) Specifies whether to use the default context if no context is provided. Defaults to true.
     */
    booleanFlagVariationDetail: jest.Mock<Promise<any>, [key: any, defaultVal: any, context?: any, useDefaultContext?: any], any>;
    /**
     * Retrieve the feature flag type NUMBER (LONG or DOUBLE), working the same as the function provided in useNumeratorContext.
     *
     * @param key The key of the feature flag.
     * @param defaultVal The default value to return if the feature flag is not found.
     * @param context (Optional) The context for the feature flag.
     * @param useDefaultContext (Optional) Specifies whether to use the default context if no context is provided. Defaults to true.
     */
    numberFlagVariationDetail: jest.Mock<Promise<any>, [key: any, defaultVal: any, context?: any, useDefaultContext?: any], any>;
    /**
     * Retrieve the feature flag type STRING, working the same as the function provided in useNumeratorContext.
     *
     * @param key The key of the feature flag.
     * @param defaultVal The default value to return if the feature flag is not found.
     * @param context (Optional) The context for the feature flag.
     * @param useDefaultContext (Optional) Specifies whether to use the default context if no context is provided. Defaults to true.
     */
    stringFlagVariationDetail: jest.Mock<Promise<any>, [key: any, defaultVal: any, context?: any, useDefaultContext?: any], any>;
    /**
     * Retrieve the default context, working the same as the function provided in useNumeratorContext.
     */
    getDefaultContext: jest.Mock<Record<string, any>, [], any>;
    /**
     * Clear default context, working the same as the function provided in useNumeratorContext.
     */
    clearDefaultContext: jest.Mock<{}, [], any>;
    /**
     * Add another default context, working the same as the function provided in useNumeratorContext.
     */
    addDefaultContextValue: jest.Mock<{}, [key: any, value: any], any>;
    /**
     * Remove an existing default context, working the same as the function provided in useNumeratorContext.
     */
    removeDefaultContextValue: jest.Mock<void, [key: any], any>;
    /**
     * Update cache flags for faster retrieval of flag with default context, working the same as the function provided in useNumeratorContext.
     */
    fetchPollingFeatureFlag: jest.Mock<Promise<void>, [], any>;
    /**
     * Currently not supported, but you might define on your own.
     */
    initFeatureFlag: jest.Mock<any, any, any>;
    /**
     * Currently not supported, but you might define on your own.
     */
    featureFlags: jest.Mock<any, any, any>;
    /**
     * Currently not supported, but you might define on your own.
     */
    flagValueByKey: jest.Mock<any, any, any>;
    /**
     * Currently not supported, but you might define on your own.
     */
    startPolling: jest.Mock<any, any, any>;
    /**
     * Currently not supported, but you might define on your own.
     */
    stopPolling: jest.Mock<any, any, any>;
    /**
     * Currently not supported, but you might define on your own.
     */
    restartPolling: jest.Mock<any, any, any>;
    /**
     * Currently not supported, but you might define on your own.
     */
    handleFlagUpdated: jest.Mock<any, any, any>;
    /**
     * Currently not supported, but you might define on your own.
     */
    handleFlagUpdatedError: jest.Mock<any, any, any>;
    /**
     * Current cache flags.
     */
    cacheFlags: Record<string, any>;
};
/**
 * Resets the mocked flags array and mocks for NumeratorProvider.
 *
 * It clears the mockedFlags array and resets all mocked functions provided by useMockNumeratorProvider.
 */
declare const resetNumeratorMocks: () => void;

export { type ApiClientInterface, type ApiRequestOptions, type ApiResponse, type ConfigClient, type ErrorResponse, type FeatureFlagConfig, type FeatureFlagConfigListingRequest, type FeatureFlagConfigListingResponse, type FeatureFlagPollingResponse, type FeatureFlagValueByKeyRequest, type FlagCollection, type FlagEvaluationDetail, FlagStatusEnum, type FlagUpdatedCallback, type FlagUpdatedErrorCallback, FlagValueTypeEnum, type FlagVariationValue, type MockNumeratorProviderProps, NumeratorClient, type NumeratorContextType, NumeratorProvider, type NumeratorProviderProps, type PaginationRequest, type PaginationResponse, type VariationKeyType, type VariationValue, addMockedFlag, mockFlags, removeMockedFlag, resetNumeratorMocks, useMockNumeratorProvider, useNumeratorContext };
