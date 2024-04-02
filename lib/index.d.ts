import { AxiosRequestConfig } from 'axios';
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
}
interface ApiRequestOptions extends AxiosRequestConfig {
    endpoint: string;
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

declare class NumeratorClient {
    private apiClient;
    constructor(config: ConfigClient);
    handleFeatureFlagNotFound: () => Promise<never>;
    featureFlagConfigListing(request?: FeatureFlagConfigListingRequest): Promise<FeatureFlagConfigListingResponse>;
    allFeatureFlagsConfig(): Promise<FeatureFlagConfig[]>;
    featureFlagConfigByKey(key: string): Promise<FeatureFlagConfig>;
    getFeatureFlagByKey<T>(request: FeatureFlagValueByKeyRequest): Promise<FlagVariationValue>;
}

interface NumeratorContextType {
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
    booleanFlagVariation(key: string, defaultVal: boolean, context?: Record<string, any> | undefined, useDefaultContext?: boolean): Promise<FlagEvaluationDetail<boolean>>;
    /**
     * Retrieves the number object
     * @param key - The flag key of the feature flag to fetch value for.
     * @param defaultVal - Default value of number value if not get flag variation
     * @param context - Optional context data to be passed to the NumeratorClient.
     * @param useDefaultContext - Optional check using default context or not
     */
    numberFlagVariation(key: string, defaultVal: number, context?: Record<string, any> | undefined, useDefaultContext?: boolean): Promise<FlagEvaluationDetail<number>>;
    /**
     * Retrieves the string object
     * @param key - The flag key of the feature flag to fetch value for.
     * @param defaultVal - Default value of string value if not get flag variation
     * @param context - Optional context data to be passed to the NumeratorClient.
     * @param useDefaultContext - Optional check using default context or not
     */
    stringFlagVariation(key: string, defaultVal: string, context?: Record<string, any> | undefined, useDefaultContext?: boolean): Promise<FlagEvaluationDetail<string>>;
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
}

declare const NumeratorProvider: React.FC<NumeratorProviderProps>;
declare const useNumeratorContext: () => NumeratorContextType;

export { type ApiClientInterface, type ApiRequestOptions, type ApiResponse, type ConfigClient, type ErrorResponse, type FeatureFlagConfig, type FeatureFlagConfigListingRequest, type FeatureFlagConfigListingResponse, type FeatureFlagValueByKeyRequest, type FlagEvaluationDetail, FlagStatusEnum, FlagValueTypeEnum, type FlagVariationValue, NumeratorClient, type NumeratorContextType, NumeratorProvider, type NumeratorProviderProps, type PaginationRequest, type PaginationResponse, type VariationKeyType, type VariationValue, useNumeratorContext };
