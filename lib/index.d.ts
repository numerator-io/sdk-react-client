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
declare enum FlagStatusEnum {
    ON = 0,
    OFF = 1
}
declare enum FlagValueTypeEnum {
    BOOLEAN = 0,
    STRING = 1
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
    featureFlagsConfig: Record<string, FeatureFlagConfig>;
    featureFlagsValue: Record<string, FeatureFlagValue<any>>;
    fetchAllFeatureFlagsConfig: () => void;
    fetchFeatureFlagConfig: ({ key }: {
        key: string;
    }) => void;
    fetchFeatureFlagValue: ({ key, context }: {
        key: string;
        context?: Record<string, any>;
    }) => void;
}
interface NumeratorProviderProps {
    children: ReactNode;
    loadAllFlagsConfigOnMount?: boolean;
    configClient: ConfigClient;
}

declare const NumeratorProvider: React.FC<NumeratorProviderProps>;
declare const useNumeratorContext: () => NumeratorContextType;

declare const deepCopy: <T>(obj: T) => T;
declare const sleep: (milliseconds: number) => Promise<unknown>;
declare const mapArrayToRecord: <T extends {
    key: string;
}>(array: T[]) => Record<string, T>;
declare const withTimeout: <T>(promise: Promise<T>, timeout: number) => Promise<T>;

export { type ApiClientInterface, type ApiRequestOptions, type ApiResponse, type ConfigClient, type ErrorResponse, type FeatureFlagConfig, type FeatureFlagConfigListingRequest, type FeatureFlagConfigListingResponse, type FeatureFlagValue, type FeatureFlagValueByKeyRequest, FlagStatusEnum, FlagValueTypeEnum, NumeratorClient, type NumeratorContextType, NumeratorProvider, type NumeratorProviderProps, type PaginationRequest, type PaginationResponse, deepCopy, mapArrayToRecord, sleep, useNumeratorContext, withTimeout };
