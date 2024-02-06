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
type VariationKeyType = 'string_value' | 'boolean_value' | 'long_value' | 'double_value';
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
interface FeatureFlagValue<T> {
    key: string;
    status: FlagStatusEnum;
    value: T;
    valueType: FlagValueTypeEnum;
}
interface VariationValue {
    string_value?: string;
    boolean_value?: boolean;
    long_value?: number;
    double_value?: number;
}

declare class NumeratorClient {
    private apiClient;
    constructor(config: ConfigClient);
    handleFeatureFlagNotFound: () => Promise<never>;
    featureFlagConfigListing(request?: FeatureFlagConfigListingRequest): Promise<FeatureFlagConfigListingResponse>;
    allFeatureFlagsConfig(): Promise<FeatureFlagConfig[]>;
    featureFlagConfigByKey(key: string): Promise<FeatureFlagConfig>;
    featureFlagValueByKey<T>(request: FeatureFlagValueByKeyRequest): Promise<FeatureFlagValue<T>>;
}

interface NumeratorContextType {
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
    fetchFeatureFlagConfig: ({ key }: {
        key: string;
    }) => void;
    /**
     * Function to fetch value for a specific feature flag.
     * @param key - The key of the feature flag to fetch value for.
     * @param context - Optional context data to be passed to the NumeratorClient.
     */
    fetchFeatureFlagValue: ({ key, context }: {
        key: string;
        context?: Record<string, any>;
    }) => void;
}
interface NumeratorProviderProps {
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

declare const NumeratorProvider: React.FC<NumeratorProviderProps>;
declare const useNumeratorContext: () => NumeratorContextType;

/**
 * Deep copy an object using JSON.
 * @param obj - The object to be deep copied.
 * @returns A deep copy of the input object.
 */
declare const deepCopy: <T>(obj: T) => T;
/**
 * Asynchronous sleep function using Promises.
 * @param milliseconds - The duration to sleep in milliseconds.
 * @returns A Promise that resolves after the specified duration.
 */
declare const sleep: (milliseconds: number) => Promise<unknown>;
/**
 * Map an array of objects to a Record using a specific key.
 * @param array - The array of objects to be mapped.
 * @returns A Record where keys are extracted from the 'key' property of each object.
 */
declare const mapArrayToRecord: <T extends {
    key: string;
}>(array: T[]) => Record<string, T>;
/**
 * Create a promise with a timeout.
 * @param promise - The original promise to be wrapped with a timeout.
 * @param timeout - The timeout duration in milliseconds.
 * @returns A Promise that resolves when the original promise resolves or rejects with a timeout error.
 */
declare const withTimeout: <T>(promise: Promise<T>, timeout: number) => Promise<T>;

/**
 * Check if a feature flag is ON.
 * @param featureFlagsValue - The record of feature flags and their values.
 * @param key - The key of the feature flag to check.
 * @returns True if the feature flag is ON, false otherwise.
 */
declare const flagIsOn: (featureFlagsValue: Record<string, FeatureFlagValue<any>>, key: string) => boolean;
/**
 * Check if a feature flag is OFF.
 * @param featureFlagsValue - The record of feature flags and their values.
 * @param key - The key of the feature flag to check.
 * @returns True if the feature flag is OFF, false otherwise.
 */
declare const flagIsOff: (featureFlagsValue: Record<string, FeatureFlagValue<any>>, key: string) => boolean;
/**
 * Check if a feature flag's value equals a specified value.
 * @param featureFlagsValue - The record of feature flags and their values.
 * @param key - The key of the feature flag to check.
 * @param value - The value to compare with the feature flag's value.
 * @returns True if the feature flag's value equals the specified value, false otherwise.
 */
declare const flagEqualsValue: (featureFlagsValue: Record<string, FeatureFlagValue<any>>, key: string, value: any) => boolean;
/**
 * Check if a feature flag is ON and should render a React component.
 * @param featureFlagsValue - The record of feature flags and their values.
 * @param key - The key of the feature flag to check.
 * @param onComponent - The React component to render if the feature flag is ON.
 * @returns The specified React component if the feature flag is ON, otherwise an empty element.
 */
declare const flagIsOnShouldRenderComponent: (featureFlagsValue: Record<string, FeatureFlagValue<any>>, key: string, onComponent: React.ReactElement) => React.ReactElement;
/**
 * Renders the specified React component if the feature flag with the given key is in the "OFF" state.
 * Otherwise, it renders an empty fragment. If the feature flag is undefined, it also renders an empty fragment.
 * @param featureFlagsValue - The record of feature flag values.
 * @param key - The key of the feature flag to check.
 * @param offComponent - The React component to render when the feature flag is in the "OFF" state.
 * @returns The rendered React component or an empty fragment.
 */
declare const flagIsOffShouldRenderComponent: (featureFlagsValue: Record<string, FeatureFlagValue<any>>, key: string, offComponent: React.ReactElement) => React.ReactElement;
/**
 * Renders the specified React component if the value of the feature flag with the given key
 * matches the provided value. Otherwise, it renders an empty fragment.
 * If the feature flag is undefined, it also renders an empty fragment.
 * @param featureFlagsValue - The record of feature flag values.
 * @param key - The key of the feature flag to check.
 * @param value - The value to compare against.
 * @param renderComponent - The React component to render when the feature flag value matches the provided value.
 * @returns The rendered React component or an empty fragment.
 */
declare const flagEqualsValueShouldRenderComponent: (featureFlagsValue: Record<string, FeatureFlagValue<any>>, key: string, value: any, renderComponent: React.ReactElement) => React.ReactElement;
/**
 * Executes the provided callback if the value of the feature flag with the given key is ON.
 * If the feature flag is undefined or its value is not ON, the callback is not executed.
 * @param featureFlagsValue - The record of feature flag values.
 * @param key - The key of the feature flag to check.
 * @param onCallback - The callback function to execute when the feature flag value is ON.
 */
declare const flagIsOnShouldCallback: (featureFlagsValue: Record<string, FeatureFlagValue<any>>, key: string, onCallback: () => void) => void;
/**
 * Executes the provided callback if the value of the feature flag with the given key is OFF.
 * If the feature flag is undefined or its value is not OFF, the callback is not executed.
 * @param featureFlagsValue - The record of feature flag values.
 * @param key - The key of the feature flag to check.
 * @param offCallback - The callback function to execute when the feature flag value is OFF.
 */
declare const flagIsOffShouldCallback: (featureFlagsValue: Record<string, FeatureFlagValue<any>>, key: string, offCallback: () => void) => void;
/**
 * Executes the provided callback if the value of the feature flag with the given key equals the specified value.
 * If the feature flag is undefined or its value does not equal the specified value, the callback is not executed.
 * @param featureFlagsValue - The record of feature flag values.
 * @param key - The key of the feature flag to check.
 * @param value - The value to compare with the feature flag's value.
 * @param equalsCallback - The callback function to execute when the feature flag value equals the specified value.
 */
declare const flagEqualsValueShouldCallback: (featureFlagsValue: Record<string, FeatureFlagValue<any>>, key: string, value: any, equalsCallback: () => void) => void;

export { type ApiClientInterface, type ApiRequestOptions, type ApiResponse, type ConfigClient, type ErrorResponse, type FeatureFlagConfig, type FeatureFlagConfigListingRequest, type FeatureFlagConfigListingResponse, type FeatureFlagValue, type FeatureFlagValueByKeyRequest, FlagStatusEnum, FlagValueTypeEnum, NumeratorClient, type NumeratorContextType, NumeratorProvider, type NumeratorProviderProps, type PaginationRequest, type PaginationResponse, type VariationKeyType, type VariationValue, deepCopy, flagEqualsValue, flagEqualsValueShouldCallback, flagEqualsValueShouldRenderComponent, flagIsOff, flagIsOffShouldCallback, flagIsOffShouldRenderComponent, flagIsOn, flagIsOnShouldCallback, flagIsOnShouldRenderComponent, mapArrayToRecord, sleep, useNumeratorContext, withTimeout };
